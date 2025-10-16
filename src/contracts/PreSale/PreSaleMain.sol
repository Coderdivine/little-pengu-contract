//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        _status = _NOT_ENTERED;
    }
}

abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor() {
        _transferOwnership(_msgSender());
    }

    modifier onlyOwner() {
        _checkOwner();
        _;
    }

    function owner() public view virtual returns (address) {
        return _owner;
    }

    function _checkOwner() internal view virtual {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
    }

    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _transferOwnership(newOwner);
    }

    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

library Address {
    function isContract(address account) internal view returns (bool) {
        return account.code.length > 0;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(
            address(this).balance >= amount,
            "Address: insufficient balance"
        );

        (bool success, ) = recipient.call{value: amount}("");
        require(
            success,
            "Address: unable to send value, recipient may have reverted"
        );
    }

    function functionCall(address target, bytes memory data)
        internal
        returns (bytes memory)
    {
        return
            functionCallWithValue(
                target,
                data,
                0,
                "Address: low-level call failed"
            );
    }

    function functionCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        return functionCallWithValue(target, data, 0, errorMessage);
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value
    ) internal returns (bytes memory) {
        return
            functionCallWithValue(
                target,
                data,
                value,
                "Address: low-level call with value failed"
            );
    }

    function functionCallWithValue(
        address target,
        bytes memory data,
        uint256 value,
        string memory errorMessage
    ) internal returns (bytes memory) {
        require(
            address(this).balance >= value,
            "Address: insufficient balance for call"
        );
        (bool success, bytes memory returndata) = target.call{value: value}(
            data
        );
        return
            verifyCallResultFromTarget(
                target,
                success,
                returndata,
                errorMessage
            );
    }

    function functionStaticCall(address target, bytes memory data)
        internal
        view
        returns (bytes memory)
    {
        return
            functionStaticCall(
                target,
                data,
                "Address: low-level static call failed"
            );
    }

    function functionStaticCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        (bool success, bytes memory returndata) = target.staticcall(data);
        return
            verifyCallResultFromTarget(
                target,
                success,
                returndata,
                errorMessage
            );
    }

    function functionDelegateCall(address target, bytes memory data)
        internal
        returns (bytes memory)
    {
        return
            functionDelegateCall(
                target,
                data,
                "Address: low-level delegate call failed"
            );
    }

    function functionDelegateCall(
        address target,
        bytes memory data,
        string memory errorMessage
    ) internal returns (bytes memory) {
        (bool success, bytes memory returndata) = target.delegatecall(data);
        return
            verifyCallResultFromTarget(
                target,
                success,
                returndata,
                errorMessage
            );
    }

    function verifyCallResultFromTarget(
        address target,
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal view returns (bytes memory) {
        if (success) {
            if (returndata.length == 0) {
                require(isContract(target), "Address: call to non-contract");
            }
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function verifyCallResult(
        bool success,
        bytes memory returndata,
        string memory errorMessage
    ) internal pure returns (bytes memory) {
        if (success) {
            return returndata;
        } else {
            _revert(returndata, errorMessage);
        }
    }

    function _revert(bytes memory returndata, string memory errorMessage)
        private
        pure
    {
        if (returndata.length > 0) {
            assembly {
                let returndata_size := mload(returndata)
                revert(add(32, returndata), returndata_size)
            }
        } else {
            revert(errorMessage);
        }
    }
}

interface IERC20 {
    event Transfer(address indexed from, address indexed to, uint256 value);

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    function totalSupply() external view returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);
}

interface IERC20Metadata is IERC20 {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function decimals() external view returns (uint8);
}

interface Aggregator {
    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        );
}

contract  LILPENGU_Presale_Main is ReentrancyGuard, Ownable {
    uint256 public overalllRaised;
    uint256 public presaleId;
    uint256 public USDT_MULTIPLIER;
    uint256 public ETH_MULTIPLIER;
    address public fundReceiver;
    uint256 public uniqueBuyers;
    uint256 public blockchainCount;

    struct PresaleData {
        uint256 startTime;
        uint256 endTime;
        uint256 price;
        uint256 nextStagePrice;
        uint256 Sold;
        uint256 tokensToSell;
        uint256 UsdtHardcap;
        uint256 amountRaised;
        bool Active;
        bool isEnableClaim;
    }

    struct VestingData {
        uint256 vestingStartTime;
        uint256 initialClaimPercent;
        uint256 vestingTime;
        uint256 vestingPercentage;
        uint256 totalClaimCycles;
    }

    struct UserData {
        uint256 investedAmount;
        uint256 claimAt;
        uint256 claimAbleAmount;
        uint256 claimedVestingAmount;
        uint256 claimedAmount;
        uint256 claimCount;
        uint256 activePercentAmount;
    }


    struct BlockchainConfig {
        string name;
        bool isEnabled;
        bool isRegistered;
        uint256 vestingId;
        uint256 totalUsersImported;
        uint256 totalAmountImported;
    }

    struct CrossChainUserData {
        uint256 totalInvestedAmount;
        uint256 totalClaimableAmount;
        uint256 claimedVestingAmount;
        uint256 claimedAmount;
        uint256 claimCount;
        uint256 activePercentAmount;
        bool isImported;
    }

    IERC20Metadata public USDTInterface;
    IERC20Metadata public USDCInterface;
    Aggregator internal aggregatorInterface;

    mapping(uint256 => bool) public paused;
    mapping(uint256 => PresaleData) public presale;
    mapping(uint256 => VestingData) public vesting;
    mapping(address => mapping(uint256 => UserData)) public userClaimData;
    mapping(address => bool) public isExcludeMinToken;
    mapping(address => bool) public isBlackList;
    mapping(address => bool) public isExist;
    mapping(address => bytes32) public solanaBindings;

    mapping(string => BlockchainConfig) public blockchainRegistry;
    mapping(string => uint256) public blockchainIdByName;
    string[] public registeredBlockchains;
    mapping(address => mapping(string => CrossChainUserData)) public crossChainUserData;



    uint256 public MinTokenTobuy;
    uint256 public currentSale;
    address public SaleToken;

    event BlockchainRegistered(string indexed name, uint256 vestingId, uint256 timestamp);
    event BlockchainUpdated(string indexed name, bool isEnabled, uint256 timestamp);
    event CrossChainDataImported(
        address indexed user,
        string indexed blockchain,
        uint256 investedAmount,
        uint256 claimableAmount,
        uint256 timestamp
    );
    event CrossChainTokensClaimed(
        address indexed user,
        string indexed blockchain,
        uint256 amount,
        uint256 timestamp
    );


    event PresaleCreated(
        uint256 indexed _id,
        uint256 _totalTokens,
        uint256 _startTime,
        uint256 _endTime
    );

    event PresaleUpdated(
        bytes32 indexed key,
        uint256 prevValue,
        uint256 newValue,
        uint256 timestamp
    );

    event TokensBought(
        address indexed user,
        uint256 indexed id,
        address indexed purchaseToken,
        uint256 tokensBought,
        uint256 amountPaid,
        uint256 timestamp
    );

    event TokensClaimed(
        address indexed user,
        uint256 indexed id,
        uint256 amount,
        uint256 timestamp
    );

    event PresaleTokenAddressUpdated(
        address indexed prevValue,
        address indexed newValue,
        uint256 timestamp
    );

    event PresalePaused(uint256 indexed id, uint256 timestamp);
    event PresaleUnpaused(uint256 indexed id, uint256 timestamp);

    constructor(
        address _oracle,
        address _usdt,
        address _usdc,
        address _SaleToken,
        uint256 _MinTokenTobuy
    ) {
        aggregatorInterface = Aggregator(_oracle);
        SaleToken = _SaleToken;
        MinTokenTobuy = _MinTokenTobuy;
        USDTInterface = IERC20Metadata(_usdt);
        USDCInterface = IERC20Metadata(_usdc);
        ETH_MULTIPLIER = (10**18);
        USDT_MULTIPLIER = (10**18);
        fundReceiver = msg.sender;
    }

    function createPresale(
        uint256 _price,
        uint256 _nextStagePrice,
        uint256 _tokensToSell,
        uint256 _UsdtHardcap
    ) external onlyOwner {
        require(_price > 0, "Zero price");
        require(_tokensToSell > 0, "Zero tokens to sell");

        presaleId++;

        presale[presaleId] = PresaleData(
            0,
            0,
            _price,
            _nextStagePrice,
            0,
            _tokensToSell,
            _UsdtHardcap,
            0,
            false,
            false
        );

        emit PresaleCreated(presaleId, _tokensToSell, 0, 0);
    }

    function setPresaleStage(uint256 _id) public onlyOwner {
        require(presale[_id].tokensToSell > 0, "Presale don't exist");
        if (currentSale != 0) {
            presale[currentSale].endTime = block.timestamp;
            presale[currentSale].Active = false;
        }
        presale[_id].startTime = block.timestamp;
        presale[_id].Active = true;
        currentSale = _id;
    }

    function setPresaleVesting(
        uint256[] memory _id,
        uint256[] memory vestingStartTime,
        uint256[] memory _initialClaimPercent,
        uint256[] memory _vestingTime,
        uint256[] memory _vestingPercentage
    ) public onlyOwner {
        for (uint256 i = 0; i < _id.length; i++) {
            vesting[_id[i]] = VestingData(
                vestingStartTime[i],
                _initialClaimPercent[i],
                _vestingTime[i],
                _vestingPercentage[i],
                (1000 - _initialClaimPercent[i]) / _vestingPercentage[i]
            );
        }
    }

    function updatePresaleVesting(
        uint256 _id,
        uint256 _vestingStartTime,
        uint256 _initialClaimPercent,
        uint256 _vestingTime,
        uint256 _vestingPercentage
    ) public onlyOwner {
        vesting[_id].vestingStartTime = _vestingStartTime;
        vesting[_id].initialClaimPercent = _initialClaimPercent;
        vesting[_id].vestingTime = _vestingTime;
        vesting[_id].vestingPercentage = _vestingPercentage;
        vesting[_id].totalClaimCycles =
            (100 - _initialClaimPercent) /
            _vestingPercentage;
    }

    uint256 initialClaimPercent;
    uint256 vestingTime;
    uint256 vestingPercentage;
    uint256 totalClaimCycles;

    function enableClaim(uint256 _id, bool _status) public onlyOwner {
        presale[_id].isEnableClaim = _status;
    }

    function updatePresale(
        uint256 _id,
        uint256 _price,
        uint256 _nextStagePrice,
        uint256 _tokensToSell,
        uint256 _Hardcap,
        bool isclaimAble
    ) external onlyOwner {
        require(_price > 0, "Zero price");
        require(_tokensToSell > 0, "Zero tokens to sell");
        require(_Hardcap > 0, "Zero harcap");
        presale[_id].price = _price;
        presale[_id].nextStagePrice = _nextStagePrice;
        presale[_id].tokensToSell = _tokensToSell;
        presale[_id].UsdtHardcap = _Hardcap;
        presale[_id].isEnableClaim = isclaimAble;
    }

    function changeFundWallet(address _wallet) external onlyOwner {
        require(_wallet != address(0), "Invalid parameters");
        fundReceiver = _wallet;
    }

    function changeUSDTToken(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "Zero token address");
        USDTInterface = IERC20Metadata(_newAddress);
    }

    function changeUSDCToken(address _newAddress) external onlyOwner {
        require(_newAddress != address(0), "Zero token address");
        USDCInterface = IERC20Metadata(_newAddress);
    }

    function pausePresale(uint256 _id) external checkPresaleId(_id) onlyOwner {
        require(!paused[_id], "Already paused");
        paused[_id] = true;
        emit PresalePaused(_id, block.timestamp);
    }

    function unPausePresale(uint256 _id)
        external
        checkPresaleId(_id)
        onlyOwner
    {
        require(paused[_id], "Not paused");
        paused[_id] = false;
        emit PresaleUnpaused(_id, block.timestamp);
    }

    function getLatestPrice() public view returns (uint256) {
        (, int256 price, , , ) = aggregatorInterface.latestRoundData();
        price = (price * (10**10));
        return uint256(price);
    }


    modifier checkPresaleId(uint256 _id) {
        require(_id > 0 && _id == currentSale, "Invalid presale id");
        _;
    }

    modifier checkSaleState(uint256 _id, uint256 amount) {
        require(presale[_id].Active == true, "preSAle not Active");
        require(
            amount > 0 &&
                amount <= presale[_id].tokensToSell - presale[_id].Sold,
            "Invalid sale amount"
        );
        _;
    }

    function ExcludeAccouctFromMinBuy(address _user, bool _status)
        external
        onlyOwner
    {
        isExcludeMinToken[_user] = _status;
    }

    function buyWithUSDT(uint256 usdAmount)
        external
        checkPresaleId(currentSale)
        checkSaleState(currentSale, usdtToTokens(currentSale, usdAmount))
        nonReentrant
        returns (bool)
    {
        require(!paused[currentSale], "Presale paused");
        require(
            presale[currentSale].Active == true,
            "Presale is not active yet"
        );
        require(!isBlackList[msg.sender], "Account is blackListed");
        require(
            presale[currentSale].amountRaised + usdAmount <=
                presale[currentSale].UsdtHardcap,
            "Amount should be less than leftHardcap"
        );
        if (!isExist[msg.sender]) {
            isExist[msg.sender] = true;
            uniqueBuyers++;
        }
        uint256 tokens = usdtToTokens(currentSale, usdAmount);
        presale[currentSale].Sold += tokens;
        presale[currentSale].amountRaised += usdAmount;
        overalllRaised += usdAmount;

        if (isExcludeMinToken[msg.sender] == false) {
            require(tokens >= MinTokenTobuy, "Less than min amount");
        }
        if (userClaimData[_msgSender()][currentSale].claimAbleAmount > 0) {
            userClaimData[_msgSender()][currentSale].claimAbleAmount += tokens;
            userClaimData[_msgSender()][currentSale].investedAmount += usdAmount;
        } else {
            userClaimData[_msgSender()][currentSale] = UserData(
                usdAmount,
                0,
                tokens,
                0,
                0,
                0,
                0
            );
        }

        uint256 ourAllowance = USDTInterface.allowance(
            _msgSender(),
            address(this)
        );
        require(usdAmount <= ourAllowance, "Make sure to add enough allowance");
        (bool success, ) = address(USDTInterface).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                _msgSender(),
                fundReceiver,
                usdAmount
            )
        );
        require(success, "Token payment failed");
        emit TokensBought(
            _msgSender(),
            currentSale,
            address(USDTInterface),
            tokens,
            usdAmount,
            block.timestamp
        );
        return true;
    }

    function changeClaimAddress(address _oldAddress, address _newWallet)
        public
        onlyOwner
    {
        for (uint256 i = 1; i < presaleId; i++) {
            require(isExist[_oldAddress], "User not a participant");
            userClaimData[_newWallet][i].claimAbleAmount = userClaimData[
                _oldAddress
            ][i].claimAbleAmount;
            userClaimData[_oldAddress][i].claimAbleAmount = 0;
        }
        isExist[_oldAddress] = false;
        isExist[_newWallet] = true;
    }

    function blackListUser(address _user, bool _value) public onlyOwner {
        isBlackList[_user] = _value;
    }

    function buyWithUSDC(uint256 usdcAmount)
        external
        checkPresaleId(currentSale)
        checkSaleState(currentSale, usdtToTokens(currentSale, usdcAmount))
        nonReentrant
        returns (bool)
    {
        require(!paused[currentSale], "Presale paused");
        require(
            presale[currentSale].Active == true,
            "Presale is not active yet"
        );
        require(
            presale[currentSale].amountRaised + usdcAmount <=
                presale[currentSale].UsdtHardcap,
            "Amount should be less than leftHardcap"
        );
        require(!isBlackList[msg.sender], "Account is blackListed");
        if (!isExist[msg.sender]) {
            isExist[msg.sender] = true;
            uniqueBuyers++;
        }
        uint256 tokens = usdtToTokens(currentSale, usdcAmount);
        presale[currentSale].Sold += tokens;
        presale[currentSale].amountRaised += usdcAmount;
        overalllRaised += usdcAmount;

        if (isExcludeMinToken[msg.sender] == false) {
            require(tokens >= MinTokenTobuy, "Less than min amount");
        }
        if (userClaimData[_msgSender()][currentSale].claimAbleAmount > 0) {
            userClaimData[_msgSender()][currentSale].claimAbleAmount += tokens;
            userClaimData[_msgSender()][currentSale].investedAmount += usdcAmount;
        } else {
            userClaimData[_msgSender()][currentSale] = UserData(
                usdcAmount,
                0,
                tokens,
                0,
                0,
                0,
                0
            );
            require(isExist[_msgSender()], "User not a participant");
        }

        uint256 ourAllowance = USDTInterface.allowance(
            _msgSender(),
            address(this)
        );
        require(
            usdcAmount <= ourAllowance,
            "Make sure to add enough allowance"
        );
        (bool success, ) = address(USDCInterface).call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                _msgSender(),
                fundReceiver,
                usdcAmount
            )
        );
        require(success, "Token payment failed");
        emit TokensBought(
            _msgSender(),
            currentSale,
            address(USDTInterface),
            tokens,
            usdcAmount,
            block.timestamp
        );
        return true;
    }

    function buyWithEth()
        external
        payable
        checkPresaleId(currentSale)
        checkSaleState(currentSale, ethToTokens(currentSale, msg.value))
        nonReentrant
        returns (bool)
    {
        uint256 usdAmount = (msg.value * getLatestPrice() * USDT_MULTIPLIER) /
            (ETH_MULTIPLIER * ETH_MULTIPLIER);
        require(
            presale[currentSale].amountRaised + usdAmount <=
                presale[currentSale].UsdtHardcap,
            "Amount should be less than leftHardcap"
        );
        require(!isBlackList[msg.sender], "Account is blackListed");
        require(!paused[currentSale], "Presale paused");
        require(
            presale[currentSale].Active == true,
            "Presale is not active yet"
        );
        if (!isExist[msg.sender]) {
            isExist[msg.sender] = true;
            uniqueBuyers++;
        }

        uint256 tokens = usdtToTokens(currentSale, usdAmount);
        if (isExcludeMinToken[msg.sender] == false) {
            require(tokens >= MinTokenTobuy, "Insufficient amount!");
        }
        presale[currentSale].Sold += tokens;
        presale[currentSale].amountRaised += usdAmount;
        overalllRaised += usdAmount;

        if (userClaimData[_msgSender()][currentSale].claimAbleAmount > 0) {
            userClaimData[_msgSender()][currentSale].claimAbleAmount += tokens;
            userClaimData[_msgSender()][currentSale].investedAmount += usdAmount;
        } else {
            userClaimData[_msgSender()][currentSale] = UserData(
                usdAmount,
                0, // Last claimed at
                tokens, // total tokens to be claimed
                0, // vesting claimed amount
                0, // claimed amount
                0, // claim count
                0 // vesting percent
            );
        }

        sendValue(payable(fundReceiver), msg.value);
        emit TokensBought(
            _msgSender(),
            currentSale,
            address(0),
            tokens,
            msg.value,
            block.timestamp
        );
        return true;
    }

    function ethBuyHelper(uint256 _id, uint256 amount)
        external
        view
        returns (uint256 ethAmount)
    {
        uint256 usdPrice = (amount * presale[_id].price);
        ethAmount =
            (usdPrice * ETH_MULTIPLIER) /
            (getLatestPrice() * 10**IERC20Metadata(SaleToken).decimals());
    }

    function usdtBuyHelper(uint256 _id, uint256 amount)
        external
        view
        returns (uint256 usdPrice)
    {
        usdPrice =
            (amount * presale[_id].price) /
            10**IERC20Metadata(SaleToken).decimals();
    }

    function ethToTokens(uint256 _id, uint256 amount)
        public
        view
        returns (uint256 _tokens)
    {
        uint256 usdAmount = (amount * getLatestPrice() * USDT_MULTIPLIER) /
            (ETH_MULTIPLIER * ETH_MULTIPLIER);
        _tokens = usdtToTokens(_id, usdAmount);
    }

    function usdtToTokens(uint256 _id, uint256 amount)
        public
        view
        returns (uint256 _tokens)
    {
        _tokens = (amount * presale[_id].price) / USDT_MULTIPLIER;
    }

    function sendValue(address payable recipient, uint256 amount) internal {
        require(address(this).balance >= amount, "Low balance");
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "ETH Payment failed");
    }

    function claimableAmount(address user, uint256 _id)
        public
        view
        returns (uint256)
    {
        UserData memory _user = userClaimData[user][_id];

        require(_user.claimAbleAmount > 0, "Nothing to claim");
        uint256 amount = _user.claimAbleAmount;
        require(amount > 0, "Already claimed");
        return amount;
    }

    function claimMultiple() public {
        for(uint8 i=1 ; i<=presaleId ; i++){
            if(userClaimData[msg.sender][i].claimAbleAmount > 0 && 
            block.timestamp > vesting[i].vestingStartTime){
                claim(msg.sender, i);
            }
        }
    }

    function claimAmount(uint256 _id) public {
        claim(msg.sender, _id);
    }

    function claim(address _user, uint256 _id) internal returns (bool) {
        require(isExist[_msgSender()], "User not a participant");
        uint256 amount = claimableAmount(_user, _id);
        require(amount > 0, "No claimable amount");
        require(!isBlackList[_user], "Account is blackListed");
        require(SaleToken != address(0), "Presale token address not set");
        require(
            amount <= IERC20(SaleToken).balanceOf(address(this)),
            "Not enough tokens in the contract"
        );
        require((presale[_id].isEnableClaim == true), "Claim is not enable");
        require(block.timestamp > vesting[_id].vestingStartTime,"Vesting time is not started yet");
        uint256 transferAmount;
        if (userClaimData[_user][_id].claimCount == 0) {
            transferAmount =
                (amount * (vesting[_id].initialClaimPercent)) /
                1000;
            userClaimData[_user][_id].activePercentAmount =
                (amount * vesting[_id].vestingPercentage) /
                1000;
            bool status = IERC20(SaleToken).transfer(
                _user,
                transferAmount
            );
            require(status, "Token transfer failed");
            userClaimData[_user][_id].claimAbleAmount -= transferAmount;
            userClaimData[_user][_id].claimedAmount += transferAmount;
            userClaimData[_user][_id].claimCount++;
        } else if (
            userClaimData[_user][_id].claimAbleAmount >
            userClaimData[_user][_id].activePercentAmount
        ) {
            uint256 duration = block.timestamp - vesting[_id].vestingStartTime;
            uint256 multiplier = duration / vesting[_id].vestingTime;
            if (multiplier > vesting[_id].totalClaimCycles) {
                multiplier = vesting[_id].totalClaimCycles;
            }
            uint256 _amount = multiplier *
                userClaimData[_user][_id].activePercentAmount;
            transferAmount =
                _amount -
                userClaimData[_user][_id].claimedVestingAmount;
            require(transferAmount > 0, "Please wait till next claim");
            bool status = IERC20(SaleToken).transfer(
                _user,
                transferAmount
            );
            require(status, "Token transfer failed");
            userClaimData[_user][_id].claimAbleAmount -= transferAmount;
            userClaimData[_user][_id]
                .claimedVestingAmount += transferAmount;
            userClaimData[_user][_id].claimedAmount += transferAmount;
            userClaimData[_user][_id].claimCount++;
        } else {
            uint256 duration = block.timestamp - vesting[_id].vestingStartTime;
            uint256 multiplier = duration / vesting[_id].vestingTime;
            if (multiplier > vesting[_id].totalClaimCycles + 1) {
                transferAmount = userClaimData[_user][_id].claimAbleAmount;
                require(transferAmount > 0, "Please wait till next claim");
                bool status = IERC20(SaleToken).transfer(
                    _user,
                    transferAmount
                );
                require(status, "Token transfer failed");
                userClaimData[_user][_id]
                    .claimAbleAmount -= transferAmount;
                userClaimData[_user][_id].claimedAmount += transferAmount;
                userClaimData[_user][_id]
                    .claimedVestingAmount += transferAmount;
                userClaimData[_user][_id].claimCount++;
            } else {
                revert("Wait for next claiim");
            }
        }
        return true;
    }

    function WithdrawTokens(address _token, uint256 amount) external onlyOwner {
        IERC20(_token).transfer(fundReceiver, amount);
    }

    function WithdrawContractFunds(uint256 amount) external onlyOwner {
        sendValue(payable(fundReceiver), amount);
    }

    function ChangeTokenToSell(address _token) public onlyOwner {
        SaleToken = _token;
    }

    function ChangeMinTokenToBuy(uint256 _amount) public onlyOwner {
        MinTokenTobuy = _amount;
    }

    function ChangeOracleAddress(address _oracle) public onlyOwner {
        aggregatorInterface = Aggregator(_oracle);
    }

    function blockTimeStamp() public view returns(uint256) {
        return block.timestamp;
    }

    function bindSolana(bytes32 solanaAddress) external {
        require(solanaBindings[msg.sender] == bytes32(0), "Already bound");
        require(solanaAddress != bytes32(0), "Invalid address");
        solanaBindings[msg.sender] = solanaAddress;
    }

    
    function isSolanaBound(address ethAddress) public view returns (bool) {
        return solanaBindings[ethAddress] != bytes32(0);
    }

    function registerBlockchain(
        string memory _name,
        uint256 _vestingId,
        bool _isEnabled
    ) external onlyOwner {
        require(bytes(_name).length > 0, "Empty blockchain name");
        require(!blockchainRegistry[_name].isRegistered, "Blockchain already registered");
        require(vesting[_vestingId].vestingStartTime > 0, "Invalid vesting ID");

        blockchainCount++;
        blockchainIdByName[_name] = blockchainCount;

        blockchainRegistry[_name] = BlockchainConfig({
            name: _name,
            isEnabled: _isEnabled,
            isRegistered: true,
            vestingId: _vestingId,
            totalUsersImported: 0,
            totalAmountImported: 0
        });

        registeredBlockchains.push(_name);

        emit BlockchainRegistered(_name, _vestingId, block.timestamp);
    }

    function updateBlockchainConfig(
        string memory _name,
        bool _isEnabled,
        uint256 _vestingId
    ) external onlyOwner {
        require(blockchainRegistry[_name].isRegistered, "Blockchain not registered");
        require(vesting[_vestingId].vestingStartTime > 0, "Invalid vesting ID");

        blockchainRegistry[_name].isEnabled = _isEnabled;
        blockchainRegistry[_name].vestingId = _vestingId;

        emit BlockchainUpdated(_name, _isEnabled, block.timestamp);
    }

    function enableBlockchain(string memory _name, bool _status) external onlyOwner {
        require(blockchainRegistry[_name].isRegistered, "Blockchain not registered");
        blockchainRegistry[_name].isEnabled = _status;
        emit BlockchainUpdated(_name, _status, block.timestamp);
    }


function importCrossChainData(
        string memory _blockchain,
        address[] memory _users,
        uint256[] memory _investedAmounts,
        uint256[] memory _claimableAmounts
    ) external onlyOwner {
        require(blockchainRegistry[_blockchain].isRegistered, "Blockchain not registered");
        require(_users.length == _investedAmounts.length, "Length mismatch");
        require(_users.length == _claimableAmounts.length, "Length mismatch");

        BlockchainConfig storage config = blockchainRegistry[_blockchain];

        for (uint256 i = 0; i < _users.length; i++) {
            address user = _users[i];
            require(user != address(0), "Invalid user address");

            CrossChainUserData storage userData = crossChainUserData[user][_blockchain];
            
            if (userData.isImported) {
                continue;
            }

            userData.totalInvestedAmount = _investedAmounts[i];
            userData.totalClaimableAmount = _claimableAmounts[i];
            userData.isImported = true;

            config.totalUsersImported++;
            config.totalAmountImported += _claimableAmounts[i];
            
            if (!isExist[user]) {
                isExist[user] = true;
                uniqueBuyers++;
            }

            emit CrossChainDataImported(
                user,
                _blockchain,
                _investedAmounts[i],
                _claimableAmounts[i],
                block.timestamp
            );
        }
    }

    function batchImportSingleUser(
        string memory _blockchain,
        address _user,
        uint256 _investedAmount,
        uint256 _claimableAmount
    ) external onlyOwner {
        require(blockchainRegistry[_blockchain].isRegistered, "Blockchain not registered");
        require(_user != address(0), "Invalid user address");

        BlockchainConfig storage config = blockchainRegistry[_blockchain];
        CrossChainUserData storage userData = crossChainUserData[_user][_blockchain];

        if (!userData.isImported) {
            config.totalUsersImported++;
            if (!isExist[_user]) {
                isExist[_user] = true;
                uniqueBuyers++;
            }
        }

        userData.totalInvestedAmount += _investedAmount;
        userData.totalClaimableAmount += _claimableAmount;
        userData.isImported = true;

        config.totalAmountImported += _claimableAmount;

        emit CrossChainDataImported(
            _user,
            _blockchain,
            _investedAmount,
            _claimableAmount,
            block.timestamp
        );
    }


    function claimCrossChain(string memory _blockchain) external nonReentrant returns (bool) {
        require(blockchainRegistry[_blockchain].isRegistered, "Blockchain not registered");
        require(blockchainRegistry[_blockchain].isEnabled, "Blockchain not enabled");
        require(!isBlackList[msg.sender], "Account is blacklisted");
        require(SaleToken != address(0), "Sale token not set");

        CrossChainUserData storage userData = crossChainUserData[msg.sender][_blockchain];
        require(userData.isImported, "No data imported for user");
        require(userData.totalClaimableAmount > 0, "Nothing to claim");

        uint256 vestingId = blockchainRegistry[_blockchain].vestingId;
        VestingData memory vestingInfo = vesting[vestingId];

        require(block.timestamp >= vestingInfo.vestingStartTime, "Vesting not started");

        uint256 transferAmount;
        uint256 remainingAmount = userData.totalClaimableAmount - userData.claimedAmount;
        require(remainingAmount > 0, "All tokens claimed");

        if (userData.claimCount == 0) {
            // Initial claim
            transferAmount = (userData.totalClaimableAmount * vestingInfo.initialClaimPercent) / 1000;
            userData.activePercentAmount = (userData.totalClaimableAmount * vestingInfo.vestingPercentage) / 1000;
        } else {
            // Vesting claims
            uint256 duration = block.timestamp - vestingInfo.vestingStartTime;
            uint256 multiplier = duration / vestingInfo.vestingTime;
            
            if (multiplier > vestingInfo.totalClaimCycles) {
                multiplier = vestingInfo.totalClaimCycles;
            }

            uint256 totalVestedAmount = multiplier * userData.activePercentAmount;
            transferAmount = totalVestedAmount - userData.claimedVestingAmount;

            // Handle remaining dust amount after all cycles
            if (multiplier >= vestingInfo.totalClaimCycles && remainingAmount > 0 && transferAmount == 0) {
                transferAmount = remainingAmount;
            }

            require(transferAmount > 0, "No tokens available yet");
        }

        require(
            transferAmount <= IERC20(SaleToken).balanceOf(address(this)),
            "Insufficient contract balance"
        );

        bool success = IERC20(SaleToken).transfer(msg.sender, transferAmount);
        require(success, "Token transfer failed");

        userData.claimedAmount += transferAmount;
        if (userData.claimCount > 0) {
            userData.claimedVestingAmount += transferAmount;
        }
        userData.claimCount++;

        emit CrossChainTokensClaimed(msg.sender, _blockchain, transferAmount, block.timestamp);

        return true;
    }

    function claimAllCrossChain() external nonReentrant {
        for (uint256 i = 0; i < registeredBlockchains.length; i++) {
            string memory blockchain = registeredBlockchains[i];
            
            if (!blockchainRegistry[blockchain].isEnabled) continue;
            
            CrossChainUserData storage userData = crossChainUserData[msg.sender][blockchain];
            if (!userData.isImported) continue;
            if (userData.totalClaimableAmount == 0) continue;
            if (userData.claimedAmount >= userData.totalClaimableAmount) continue;

            uint256 vestingId = blockchainRegistry[blockchain].vestingId;
            if (block.timestamp < vesting[vestingId].vestingStartTime) continue;

            try this.claimCrossChainInternal(blockchain, msg.sender) {
                // Success
            } catch {
                // Skip if claim fails
                continue;
            }
        }
    }

    function claimCrossChainInternal(string memory _blockchain, address _user) external {
        require(msg.sender == address(this), "Internal only");
        
        CrossChainUserData storage userData = crossChainUserData[_user][_blockchain];
        uint256 vestingId = blockchainRegistry[_blockchain].vestingId;
        VestingData memory vestingInfo = vesting[vestingId];

        uint256 transferAmount;
        uint256 remainingAmount = userData.totalClaimableAmount - userData.claimedAmount;

        if (userData.claimCount == 0) {
            transferAmount = (userData.totalClaimableAmount * vestingInfo.initialClaimPercent) / 1000;
            userData.activePercentAmount = (userData.totalClaimableAmount * vestingInfo.vestingPercentage) / 1000;
        } else {
            uint256 duration = block.timestamp - vestingInfo.vestingStartTime;
            uint256 multiplier = duration / vestingInfo.vestingTime;
            
            if (multiplier > vestingInfo.totalClaimCycles) {
                multiplier = vestingInfo.totalClaimCycles;
            }

            uint256 totalVestedAmount = multiplier * userData.activePercentAmount;
            transferAmount = totalVestedAmount - userData.claimedVestingAmount;

            if (multiplier >= vestingInfo.totalClaimCycles && remainingAmount > 0 && transferAmount == 0) {
                transferAmount = remainingAmount;
            }

            require(transferAmount > 0, "No tokens available yet");
        }

        bool success = IERC20(SaleToken).transfer(_user, transferAmount);
        require(success, "Token transfer failed");

        userData.claimedAmount += transferAmount;
        if (userData.claimCount > 0) {
            userData.claimedVestingAmount += transferAmount;
        }
        userData.claimCount++;

        emit CrossChainTokensClaimed(_user, _blockchain, transferAmount, block.timestamp);
    }



    function getCrossChainClaimableAmount(address _user, string memory _blockchain) 
        public 
        view 
        returns (uint256) 
    {
        require(blockchainRegistry[_blockchain].isRegistered, "Blockchain not registered");
        
        CrossChainUserData memory userData = crossChainUserData[_user][_blockchain];
        if (!userData.isImported || userData.totalClaimableAmount == 0) {
            return 0;
        }

        uint256 vestingId = blockchainRegistry[_blockchain].vestingId;
        VestingData memory vestingInfo = vesting[vestingId];

        if (block.timestamp < vestingInfo.vestingStartTime) {
            return 0;
        }

        uint256 remainingAmount = userData.totalClaimableAmount - userData.claimedAmount;
        if (remainingAmount == 0) {
            return 0;
        }

        if (userData.claimCount == 0) {
            return (userData.totalClaimableAmount * vestingInfo.initialClaimPercent) / 1000;
        }

        uint256 duration = block.timestamp - vestingInfo.vestingStartTime;
        uint256 multiplier = duration / vestingInfo.vestingTime;
        
        if (multiplier > vestingInfo.totalClaimCycles) {
            multiplier = vestingInfo.totalClaimCycles;
        }

        uint256 activeAmount = (userData.totalClaimableAmount * vestingInfo.vestingPercentage) / 1000;
        uint256 totalVestedAmount = multiplier * activeAmount;
        uint256 claimable = totalVestedAmount - userData.claimedVestingAmount;

        if (multiplier >= vestingInfo.totalClaimCycles && remainingAmount > claimable) {
            return remainingAmount;
        }

        return claimable;
    }

    function getUserCrossChainData(address _user, string memory _blockchain)
        external
        view
        returns (
            uint256 totalInvested,
            uint256 totalClaimable,
            uint256 claimed,
            uint256 remaining,
            uint256 claimCount,
            bool isImported
        )
    {
        CrossChainUserData memory userData = crossChainUserData[_user][_blockchain];
        return (
            userData.totalInvestedAmount,
            userData.totalClaimableAmount,
            userData.claimedAmount,
            userData.totalClaimableAmount - userData.claimedAmount,
            userData.claimCount,
            userData.isImported
        );
    }

    function getBlockchainInfo(string memory _blockchain)
        external
        view
        returns (
            bool isRegistered,
            bool isEnabled,
            uint256 vestingId,
            uint256 totalUsers,
            uint256 totalAmount
        )
    {
        BlockchainConfig memory config = blockchainRegistry[_blockchain];
        return (
            config.isRegistered,
            config.isEnabled,
            config.vestingId,
            config.totalUsersImported,
            config.totalAmountImported
        );
    }

    function getAllRegisteredBlockchains() external view returns (string[] memory) {
        return registeredBlockchains;
    }
    
}