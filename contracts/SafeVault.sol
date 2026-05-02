// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SafeVault
 * @notice A secure vault for protecting user funds during high market volatility
 * @dev This is a simplified version for demonstration purposes
 */
contract SafeVault {
    // Mapping of user addresses to their balances
    mapping(address => uint256) public balances;
    
    // Total vault balance
    uint256 public totalVaultBalance;
    
    // Admin address
    address public admin;
    
    // RiskyPool contract address
    address public riskyPool;
    
    // Mock interest rate (in basis points, e.g., 500 = 5%)
    uint256 public interestRate = 500;
    
    // Last interest update timestamp
    mapping(address => uint256) public lastInterestUpdate;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event ReceivedFromRiskyPool(address indexed user, uint256 amount);
    event InterestAccrued(address indexed user, uint256 amount);
    event AdminUpdated(address indexed newAdmin);
    event RiskyPoolUpdated(address indexed newRiskyPool);
    event InterestRateUpdated(uint256 newRate);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    modifier onlyRiskyPool() {
        require(msg.sender == riskyPool, "Only RiskyPool can call this function");
        _;
    }
    
    /**
     * @notice Constructor sets the admin address
     */
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @notice Deposit ETH into the safe vault
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        // Accrue interest before updating balance
        _accrueInterest(msg.sender);
        
        balances[msg.sender] += msg.value;
        totalVaultBalance += msg.value;
        lastInterestUpdate[msg.sender] = block.timestamp;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice Withdraw ETH from the safe vault
     * @param amount The amount to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than 0");
        
        // Accrue interest before withdrawal
        _accrueInterest(msg.sender);
        
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        totalVaultBalance -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }
    
    /**
     * @notice Receive funds from RiskyPool during sweep
     * @param user The user whose funds are being swept
     * @param amount The amount being swept
     */
    function receiveFromRiskyPool(address user, uint256 amount) external payable onlyRiskyPool {
        require(msg.value == amount, "Amount mismatch");
        require(amount > 0, "Amount must be greater than 0");
        
        // Accrue interest before updating balance
        _accrueInterest(user);
        
        balances[user] += amount;
        totalVaultBalance += amount;
        lastInterestUpdate[user] = block.timestamp;
        
        emit ReceivedFromRiskyPool(user, amount);
    }
    
    /**
     * @notice Get balance of a user (including accrued interest)
     * @param user The user address
     * @return The user's balance with accrued interest
     */
    function balanceOf(address user) external view returns (uint256) {
        return balances[user] + _calculateInterest(user);
    }
    
    /**
     * @notice Calculate accrued interest for a user
     * @param user The user address
     * @return The accrued interest amount
     */
    function _calculateInterest(address user) internal view returns (uint256) {
        if (balances[user] == 0 || lastInterestUpdate[user] == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - lastInterestUpdate[user];
        // Simple interest calculation: balance * rate * time / (365 days * 10000)
        uint256 interest = (balances[user] * interestRate * timeElapsed) / (365 days * 10000);
        
        return interest;
    }
    
    /**
     * @notice Accrue interest for a user
     * @param user The user address
     */
    function _accrueInterest(address user) internal {
        uint256 interest = _calculateInterest(user);
        
        if (interest > 0) {
            balances[user] += interest;
            totalVaultBalance += interest;
            emit InterestAccrued(user, interest);
        }
        
        lastInterestUpdate[user] = block.timestamp;
    }
    
    /**
     * @notice Manually accrue interest for a user
     * @param user The user address
     */
    function accrueInterest(address user) external {
        _accrueInterest(user);
    }
    
    /**
     * @notice Update admin address
     * @param newAdmin The new admin address
     */
    function updateAdmin(address newAdmin) external onlyAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        admin = newAdmin;
        emit AdminUpdated(newAdmin);
    }
    
    /**
     * @notice Set RiskyPool contract address
     * @param _riskyPool The RiskyPool contract address
     */
    function setRiskyPool(address _riskyPool) external onlyAdmin {
        require(_riskyPool != address(0), "Invalid RiskyPool address");
        riskyPool = _riskyPool;
        emit RiskyPoolUpdated(_riskyPool);
    }
    
    /**
     * @notice Update interest rate
     * @param newRate The new interest rate in basis points
     */
    function updateInterestRate(uint256 newRate) external onlyAdmin {
        require(newRate <= 10000, "Interest rate too high"); // Max 100%
        interestRate = newRate;
        emit InterestRateUpdated(newRate);
    }
    
    /**
     * @notice Fallback function to receive ETH
     */
    receive() external payable {
        _accrueInterest(msg.sender);
        balances[msg.sender] += msg.value;
        totalVaultBalance += msg.value;
        lastInterestUpdate[msg.sender] = block.timestamp;
        emit Deposit(msg.sender, msg.value);
    }
}
