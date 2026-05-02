#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Env, Symbol};

#[derive(Clone)]
#[contracttype]
pub enum DataKey {
    Admin,
    RiskLevel,
    UserRisky(Address),
    UserSafe(Address),
    UserLastAccrual(Address),
    TotalRisky,
    TotalSafe,
    YieldBps,
}

#[contract]
pub struct VaultManager;

#[contractimpl]
impl VaultManager {
    pub fn init(e: Env, admin: Address, yield_bps: i128) {
        admin.require_auth();
        e.storage().instance().set(&DataKey::Admin, &admin);
        e.storage().instance().set(&DataKey::RiskLevel, &symbol_short!("low"));
        e.storage().instance().set(&DataKey::YieldBps, &yield_bps);
        e.storage().instance().set(&DataKey::TotalRisky, &0_i128);
        e.storage().instance().set(&DataKey::TotalSafe, &0_i128);
    }
    pub fn deposit(e: Env, user: Address, amount: i128) {
        user.require_auth();
        assert!(amount > 0, "invalid amount");
        let bal = e.storage().persistent().get(&DataKey::UserRisky(user.clone())).unwrap_or(0_i128);
        e.storage().persistent().set(&DataKey::UserRisky(user.clone()), &(bal + amount));
        let total = e.storage().instance().get(&DataKey::TotalRisky).unwrap_or(0_i128);
        e.storage().instance().set(&DataKey::TotalRisky, &(total + amount));
        e.events().publish((symbol_short!("deposit"), user), amount);
    }
    pub fn withdraw(e: Env, user: Address, amount: i128, from_safe: bool) {
        user.require_auth();
        assert!(amount > 0, "invalid amount");
        if from_safe { Self::accrue(e.clone(), user.clone()); }
        let key = if from_safe { DataKey::UserSafe(user.clone()) } else { DataKey::UserRisky(user.clone()) };
        let bal: i128 = e.storage().persistent().get(&key).unwrap_or(0_i128);
        assert!(bal >= amount, "insufficient");
        e.storage().persistent().set(&key, &(bal - amount));
        let tkey = if from_safe { DataKey::TotalSafe } else { DataKey::TotalRisky };
        let total: i128 = e.storage().instance().get(&tkey).unwrap_or(0_i128);
        e.storage().instance().set(&tkey, &(total - amount));
        e.events().publish((symbol_short!("withdraw"), user), amount);
    }
    pub fn apply_risk_signal(e: Env, admin: Address, risk: Symbol, user: Address, amount: i128) {
        admin.require_auth();
        let stored: Address = e.storage().instance().get(&DataKey::Admin).unwrap();
        assert!(stored == admin, "unauthorized");
        e.storage().instance().set(&DataKey::RiskLevel, &risk);
        if risk == symbol_short!("high") && amount > 0 { Self::move_to_safe(e.clone(), user.clone(), amount); }
        e.events().publish((symbol_short!("risk"), user), risk);
    }
    pub fn balances(e: Env, user: Address) -> (i128, i128) {
        let risky = e.storage().persistent().get(&DataKey::UserRisky(user.clone())).unwrap_or(0_i128);
        let safe = e.storage().persistent().get(&DataKey::UserSafe(user)).unwrap_or(0_i128);
        (risky, safe)
    }
    fn move_to_safe(e: Env, user: Address, amount: i128) {
        let r = e.storage().persistent().get(&DataKey::UserRisky(user.clone())).unwrap_or(0_i128);
        assert!(r >= amount, "insufficient risky");
        Self::accrue(e.clone(), user.clone());
        e.storage().persistent().set(&DataKey::UserRisky(user.clone()), &(r - amount));
        let s = e.storage().persistent().get(&DataKey::UserSafe(user.clone())).unwrap_or(0_i128);
        e.storage().persistent().set(&DataKey::UserSafe(user.clone()), &(s + amount));
        let tr: i128 = e.storage().instance().get(&DataKey::TotalRisky).unwrap_or(0_i128);
        let ts: i128 = e.storage().instance().get(&DataKey::TotalSafe).unwrap_or(0_i128);
        e.storage().instance().set(&DataKey::TotalRisky, &(tr - amount));
        e.storage().instance().set(&DataKey::TotalSafe, &(ts + amount));
        e.events().publish((symbol_short!("transfer"), user), amount);
    }
    fn accrue(e: Env, user: Address) {
        let now = e.ledger().timestamp();
        let last: u64 = e.storage().persistent().get(&DataKey::UserLastAccrual(user.clone())).unwrap_or(now);
        let bal: i128 = e.storage().persistent().get(&DataKey::UserSafe(user.clone())).unwrap_or(0_i128);
        if bal > 0 && now > last {
            let dt = (now - last) as i128;
            let y: i128 = e.storage().instance().get(&DataKey::YieldBps).unwrap_or(400_i128);
            let year = 31_536_000_i128;
            let interest = bal * y * dt / (10_000_i128 * year);
            if interest > 0 {
                e.storage().persistent().set(&DataKey::UserSafe(user.clone()), &(bal + interest));
                let ts: i128 = e.storage().instance().get(&DataKey::TotalSafe).unwrap_or(0_i128);
                e.storage().instance().set(&DataKey::TotalSafe, &(ts + interest));
                e.events().publish((symbol_short!("yield"), user.clone()), interest);
            }
        }
        e.storage().persistent().set(&DataKey::UserLastAccrual(user), &now);
    }
}
