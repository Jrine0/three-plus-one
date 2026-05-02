// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title RiskyPool
 * @notice A simple contract for managing user deposits in a risky DeFi pool
 * @dev This is a simplified version for demonstration purposes
 */
contract RiskyPool {
    // Mapping of user addresses to their balances
    mapping(address => uint256) public balances;
    
    // Total pool balance
    uint256 public totalPoolBalance;
    
    // Admin address for sweep operations
    address public admin;
    
    // SafeVault contract address
    address public safeVault;
    
    // Events
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Sweep(address indexed user, uint256 amount, address indexed destination);
    event AdminUpdated(address indexed newAdmin);
    event SafeVaultUpdated(address indexed newSafeVault);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }
    
    /**
     * @notice Constructor sets the admin address
     */
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @notice Deposit ETH into the risky pool
     */
    function deposit() external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        
        balances[msg.sender] += msg.value;
        totalPoolBalance += msg.value;
        
        emit Deposit(msg.sender, msg.value);
    }
    
    /**
     * @notice Withdraw ETH from the risky pool
     * @param amount The amount to withdraw
     */
    function withdraw(uint256 amount) external {
        require(amount > 0, "Withdraw amount must be greater than 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");
        
        balances[msg.sender] -= amount;
        totalPoolBalance -= amount;
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }
    
    /**
     * @notice Sweep user funds to SafeVault during high volatility
     * @param user The user whose funds to sweep
     * @param amount The amount to sweep
     */
    function sweep(address user, uint256 amount) external onlyAdmin {
        require(safeVault != address(0), "SafeVault not set");
        require(amount > 0, "Sweep amount must be greater than 0");
        require(balances[user] >= amount, "Insufficient user balance");
        
        balances[user] -= amount;
        totalPoolBalance -= amount;
        
        // Transfer to SafeVault
        (bool success, ) = safeVault.call{value: amount}(
            abi.encodeWithSignature("receiveFromRiskyPool(address,uint256)", user, amount)
        );
        require(success, "Sweep transfer failed");
        
        emit Sweep(user, amount, safeVault);
    }
    
    /**
     * @notice Sweep all funds for a user to SafeVault
     * @param user The user whose funds to sweep
     */
    function sweepAll(address user) external onlyAdmin {
        uint256 amount = balances[user];
        require(amount > 0, "No balance to sweep");
        
        this.sweep(user, amount);
    }
    
    /**
     * @notice Get balance of a user
     * @param user The user address
     * @return The user's balance
     */
    function balanceOf(address user) external view returns (uint256) {
        return balances[user];
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
     * @notice Set SafeVault contract address
     * @param _safeVault The SafeVault contract address
     */
    function setSafeVault(address _safeVault) external onlyAdmin {
        require(_safeVault != address(0), "Invalid SafeVault address");
        safeVault = _safeVault;
        emit SafeVaultUpdated(_safeVault);
    }
    
    /**
     * @notice Fallback function to receive ETH
     */
    receive() external payable {
        balances[msg.sender] += msg.value;
        totalPoolBalance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
