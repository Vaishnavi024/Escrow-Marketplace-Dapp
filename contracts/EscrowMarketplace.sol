// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowMarketplace {
    struct Item {
        address payable seller; // Address of the seller
        uint256 price;          // Price of the item in Wei
        address payable buyer;  // Address of the buyer
        bool isSold;            // Whether the item is sold
        bool isConfirmed;       // Whether the receipt is confirmed by the buyer
    }

    string[] private itemNames;                     // List of item names
    mapping(string => Item) private items;          // Mapping of item names to Item details
    mapping(address => uint256) private pendingWithdrawals; // Mapping of addresses to their withdrawable balances

    event ItemListed(string itemName, uint256 price, address seller);
    event ItemBought(string itemName, uint256 price, address buyer);
    event ItemConfirmed(string itemName, address buyer);
    event DisputeResolved(string itemName, uint256 refundAmount, address refundedParty);

    modifier onlySeller(string memory itemName) {
        require(items[itemName].seller == msg.sender, "Only the seller can perform this action.");
        _;
    }

    modifier onlyBuyer(string memory itemName) {
        require(items[itemName].buyer == msg.sender, "Only the buyer can perform this action.");
        _;
    }

    // List an item for sale
    function listItem(string memory itemName, uint256 price) external {
        require(items[itemName].seller == address(0), "Item already listed.");
        require(price > 0, "Price must be greater than zero.");

        items[itemName] = Item({
            seller: payable(msg.sender),
            price: price,
            buyer: payable(address(0)),
            isSold: false,
            isConfirmed: false
        });

        itemNames.push(itemName);

        emit ItemListed(itemName, price, msg.sender);
    }

    // Buy an item by sending the correct amount of Ether
    function buyItem(string memory itemName) external payable {
        Item storage item = items[itemName];
        require(item.seller != address(0), "Item not listed.");
        require(!item.isSold, "Item already sold.");
        require(msg.value == item.price, "Incorrect value sent.");

        item.buyer = payable(msg.sender);
        item.isSold = true;

        emit ItemBought(itemName, item.price, msg.sender);
    }

    // Confirm receipt of the item
    function confirmReceipt(string memory itemName) external onlyBuyer(itemName) {
        Item storage item = items[itemName];
        require(item.isSold, "Item not sold.");
        require(!item.isConfirmed, "Receipt already confirmed.");

        item.isConfirmed = true;
        pendingWithdrawals[item.seller] += item.price;

        emit ItemConfirmed(itemName, msg.sender);
    }

    // Withdraw funds that are available for withdrawal
    function withdrawFunds() external {
        uint256 amount = pendingWithdrawals[msg.sender];
        require(amount > 0, "No funds to withdraw.");

        pendingWithdrawals[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    // Resolve a dispute by either refunding the buyer or releasing funds to the seller
    function resolveDispute(string memory itemName, bool refundBuyer) external {
        Item storage item = items[itemName];
        require(item.isSold, "Item not sold.");
        require(!item.isConfirmed, "Receipt already confirmed.");

        uint256 refundAmount = item.price;
        if (refundBuyer) {
            item.buyer.transfer(refundAmount);
            emit DisputeResolved(itemName, refundAmount, item.buyer);
        } else {
            item.seller.transfer(refundAmount);
            emit DisputeResolved(itemName, refundAmount, item.seller);
        }

        item.isSold = false;
        item.buyer = payable(address(0));
        item.isConfirmed = false;
    }

    // Get details of a specific item
    function getItemDetails(string memory itemName) external view returns (address seller, uint256 price, address buyer, bool isSold, bool isConfirmed) {
        Item memory item = items[itemName];
        return (item.seller, item.price, item.buyer, item.isSold, item.isConfirmed);
    }
}
