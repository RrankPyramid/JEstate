// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract nftContract is ERC721Enumerable {
    struct nftData {
        string name;
        string cid;
        string rarity;
        bool isOnSale;
        uint256 sellPrice;
        bool isBiddable;
        uint256 maxBid;
        address maxBidder;
        bool isOccupied;
    }

    struct userData {
        uint256 property;
        string username;
        uint256 userBalance;
    }

    event nftTransaction(
        uint256 indexed id,
        string transactionType,
        address fromAddress,
        address toAddress,
        uint256 value
    );

    mapping(address => userData) public users;
    mapping(string => bool) isExist;
    nftData[] public nfts;

    address public owner;
    uint256 public maxSupply;

    constructor() ERC721("nftContract", "NFTC") {
        owner = msg.sender;
        maxSupply = 100;
    }

    function setUsername(string memory _username) public {
        users[msg.sender].username = _username;
    }

    function occupyProperty(uint256 _propertyTokenId) public {
        require(
            _propertyTokenId == 0 ||
                (ownerOf(_propertyTokenId) == msg.sender)
        ,"you must be the owner");
        
        require(_propertyTokenId == 0 || nfts[_propertyTokenId - 1].isOnSale == false, "property on sale, you cannot occupy it!");
        require(_propertyTokenId == 0 || nfts[_propertyTokenId - 1].isBiddable == false, "property on bid, you cannot occupy it!");

        if (users[msg.sender].property != 0) {
            nfts[users[msg.sender].property - 1].isOccupied = false;
        }

        if (_propertyTokenId != 0) {
            nfts[_propertyTokenId - 1].isOccupied = true;
        }

        users[msg.sender].property = _propertyTokenId;
    }

    function occupySingleProperty(uint256 _tokenId) public {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this item, so you cannot occupy it.");
        require(nfts[_tokenId - 1].isOnSale == false, "You cannot occupy an item while it is on sale.");
        require(nfts[_tokenId - 1].isBiddable == false, "You cannot occupy an item while it is on auction.");

        if (users[msg.sender].property != 0) {
            nfts[users[msg.sender].property - 1].isOccupied = false;
        }
        users[msg.sender].property = _tokenId;
        nfts[_tokenId - 1].isOccupied = true;
    }

    function vacateProperty() public {
        require(users[msg.sender].property != 0, "You must occupy a property first to vacate.");
        nfts[users[msg.sender].property - 1].isOccupied = false;
        users[msg.sender].property = 0;
    }

    function tokensOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_owner);

        if (tokenCount == 0) {
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            for (uint256 i = 0; i < tokenCount; i++) {
                result[i] = tokenOfOwnerByIndex(_owner, i);
            }
            return result;
        }
    }

    function putOnSale(uint256 _tokenId, uint256 _sellPrice) public {
      
        require(msg.sender == this.ownerOf(_tokenId), "You cannot put this item on sale, because you are not the owner of it.");
        require(nfts[_tokenId - 1].isOnSale == false, "Item is already on sale!");
        require(nfts[_tokenId - 1].isOccupied == false, "You must vacate it first, then you can sell it." );
        
        nfts[_tokenId - 1].isOnSale = true;
        nfts[_tokenId - 1].sellPrice = _sellPrice; 
        approve(address(this), _tokenId);

        emit nftTransaction(
            _tokenId,
            "On Sale",
            msg.sender,
            address(0x0),
            _sellPrice
        ); 
    }

    function cancelSale(uint256 _tokenId) public {
        require(nfts[_tokenId - 1].isOnSale == true, "Item should be on sale first, to be cancelled.");
        require(msg.sender == this.ownerOf(_tokenId), "You cannot cancel the sale of this item, because you are not the owner.");
        
        nfts[_tokenId - 1].isOnSale = false; 
        nfts[_tokenId - 1].sellPrice = 0; 

        emit nftTransaction(
            _tokenId,
            "Sale Cancelled",
            msg.sender,
            address(0x0),
            0
        ); 
    }

    function buyFromSale(uint256 _tokenId) public payable {
       
        require(msg.sender != this.ownerOf(_tokenId), "You cannot buy your own item!");
        
        require(nfts[_tokenId - 1].isOnSale == true, "Item should be on sale for you to buy it.");
       
        require (nfts[_tokenId - 1].sellPrice <= msg.value, "The amount you tried to buy, is less than price.");
       
        require(this.getApproved(_tokenId) == address(this), "Seller did not give the allowance for us to sell this item, contact with seller.");
        address sellerAddress = this.ownerOf(_tokenId);
        this.safeTransferFrom(sellerAddress, msg.sender, _tokenId);
        nfts[_tokenId - 1].isOnSale = false; 
        nfts[_tokenId - 1].sellPrice = 0; 
        users[sellerAddress].userBalance = add256(users[sellerAddress].userBalance, msg.value); 

        
        if (nfts[_tokenId - 1].maxBid > 0) {
            users[nfts[_tokenId - 1].maxBidder].userBalance = add256(users[nfts[_tokenId - 1].maxBidder].userBalance ,  nfts[_tokenId - 1].maxBid); 
        }
        nfts[_tokenId - 1].maxBid = 0;
        nfts[_tokenId - 1].maxBidder = address(0x0);
        nfts[_tokenId - 1].isBiddable = false; 

        emit nftTransaction(
            _tokenId,
            "sold",
            sellerAddress,
            msg.sender,
            msg.value
        );
    }

    function putOnAuction(uint256 _tokenId) public {

        
        require(msg.sender == this.ownerOf(_tokenId), "Only owner of this item can put on sale" );
        require(nfts[_tokenId - 1].isOccupied == false,  "You must vacate it first, then you can put it on auction.");
        require(nfts[_tokenId - 1].isBiddable == false, "This item is already on auction!");
        
        nfts[_tokenId - 1].isBiddable = true; 
        nfts[_tokenId - 1].maxBid = 0; 
        approve(address(this), _tokenId);

        emit nftTransaction(
            _tokenId,
            "Auction Starts",
            msg.sender,
            address(0x0),
            0
        ); 
    }

    function cancelAuction(uint256 _tokenId) public {
        require(msg.sender == this.ownerOf(_tokenId), "You cannot cancel the auction of this item, because you are not the owner.");
        require(nfts[_tokenId - 1].isBiddable == true, "Item must be on auction before it can be canceled, currently it is not!");
        
        if (nfts[_tokenId - 1].maxBid > 0) {
            users[nfts[_tokenId - 1].maxBidder].userBalance = add256(users[nfts[_tokenId - 1].maxBidder].userBalance, nfts[_tokenId - 1].maxBid);
        }
        nfts[_tokenId - 1].isBiddable = false; 
        nfts[_tokenId - 1].maxBid = 0; 
        nfts[_tokenId - 1].maxBidder = address(0x0); 

        emit nftTransaction(
            _tokenId,
            "Auction Cancelled",
            msg.sender,
            address(0x0),
            0
        ); 
    }

    function bid(uint256 _tokenId) public payable {
        require(msg.value > 0, "You did not send any money");
        require(nfts[_tokenId - 1].isBiddable == true,"Item you tried to bid, is not biddable!");
        require(msg.value >= nfts[_tokenId - 1].maxBid, "The amount you tried to bid, is less than current max bid.");
        require(msg.sender != this.ownerOf(_tokenId), "You cannot bid your own item.");
       
        if (nfts[_tokenId - 1].maxBid > 0) {
            users[nfts[_tokenId - 1].maxBidder].userBalance = add256(users[nfts[_tokenId - 1].maxBidder].userBalance, nfts[_tokenId - 1].maxBid); 
        }
        nfts[_tokenId - 1].maxBid = msg.value;
        nfts[_tokenId - 1].maxBidder = msg.sender;

        emit nftTransaction(
            _tokenId,
            "Bidded",
            msg.sender,
            ownerOf(_tokenId),
            msg.value
        ); 
    }

    function acceptHighestBid(uint256 _tokenId) public {
 
        require(msg.sender == this.ownerOf(_tokenId), "You need to be owner of this item, to accept its highest bid.");
        require(nfts[_tokenId - 1].isBiddable == true , "Item should be biddable for you to accept its highest bid.");
        require(nfts[_tokenId - 1].maxBid > 0 ,"Max bid must be more than 0 to accept it, currently it is not!");
        require(nfts[_tokenId - 1].maxBidder != msg.sender, "Max bidder cannot be the same person as seller!");

        address buyer = nfts[_tokenId - 1].maxBidder;
        uint256 soldValue = nfts[_tokenId - 1].maxBid;
        this.safeTransferFrom(
            msg.sender,
            nfts[_tokenId - 1].maxBidder,
            _tokenId
        ); 
        users[msg.sender].userBalance = add256(users[msg.sender].userBalance, nfts[_tokenId - 1].maxBid); 
        nfts[_tokenId - 1].maxBid = 0; 
        nfts[_tokenId - 1].maxBidder = address(0x0); 
        nfts[_tokenId - 1].isBiddable = false; 
        nfts[_tokenId - 1].isOnSale = false; 
        nfts[_tokenId - 1].sellPrice = 0; 

        emit nftTransaction(
            _tokenId,
            "Sold From Auction",
            msg.sender,
            buyer,
            soldValue
        );
    }

    function withdrawBid(uint256 _tokenId) public {

        require(msg.sender == nfts[_tokenId - 1].maxBidder, "You must be the max bidder to withdraw your bid!");
        uint256 withdrawnValue = nfts[_tokenId - 1].maxBid;
        users[nfts[_tokenId - 1].maxBidder].userBalance = add256(users[nfts[_tokenId - 1].maxBidder].userBalance, nfts[_tokenId - 1].maxBid);
        nfts[_tokenId - 1].maxBid = 0; 
        nfts[_tokenId - 1].maxBidder = address(0x0); 

        emit nftTransaction(
            _tokenId,
            "Bid Withdrawn",
            msg.sender,
            address(0x0),
            withdrawnValue
        ); 
    }

    function withdrawMoney(uint256 _amount) public {

        require(users[msg.sender].userBalance >= _amount, "You do not have enough balance to withdraw this amount");

        uint initialBalance = users[msg.sender].userBalance;
        users[msg.sender].userBalance = sub256(initialBalance, _amount);
        address payable recipient = payable(msg.sender);
        recipient.transfer(_amount);
    }


    function createProperty(
        string memory _name,
        string memory _cid,
        string memory _rarity
    ) public {
        // Original function: createCloth
        require(owner == msg.sender, "Only owner can create property.");
        require(isExist[_cid] == false, "This CID is already exist, you cannot create same property twice.");
        require(nfts.length < maxSupply, "You cannot create more properties. Max supply reached.");

        uint256 tokenId = nfts.length + 1;
        _mint(msg.sender, tokenId);
        nftData memory newProperty = nftData({
            name: _name,
            cid: _cid,
            rarity: _rarity,
            isOnSale: true,
            sellPrice: 50,
            isBiddable: false,
            maxBid: 0,
            maxBidder: address(0x0),
            isOccupied: false
        });

        nfts.push(newProperty);
        isExist[_cid] = true;

        emit nftTransaction(
            tokenId,
            "created",
            msg.sender,
            address(0x0),
            0
        );
    }

    function setMaxSupply(uint256 _maxSupply) public {
        // Original function: setMaxSupply
        require(owner == msg.sender, "Only owner can set max supply.");
        require(nfts.length < _maxSupply, "You cannot set max supply less than created properties.");
        maxSupply = _maxSupply;
    }

    function add256(uint256 _a, uint256 _b) private pure returns (uint256) {
        // Original function: add256
        uint256 c = _a + _b;
        assert(c >= _a);
        return c;
    }

    function sub256(uint256 a, uint256 b) internal pure returns (uint) {
        require(b <= a, "subtraction underflow");
        return a - b;
    }
}

