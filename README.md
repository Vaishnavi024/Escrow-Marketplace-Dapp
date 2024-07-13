# Escrow-Marketplace-Dapp
Welcome to the Escrow Marketplace DApp! This decentralized application is built using Solidity for the smart contract and React.js for the front-end, deployed on the Sepolia test network using Hardhat. The DApp facilitates secure transactions between buyers and sellers, ensuring that funds are held in escrow until the buyer confirms receipt of goods.

## Demo Videos

- **[DApp Interaction](#)**: Demo of the full-fledged DApp interacting with the smart contract.
  
  https://github.com/user-attachments/assets/9e16b1dd-a64b-4169-b49e-9b67edd9898e
  
- **[Contract Deployment and Usage](#)**: Demo of the contract deployment and usage on Remix.

  https://github.com/user-attachments/assets/5a61f083-397b-45c4-82d2-3eeeebec506c
  



## Table of Contents
- [Features](#features)
- [Using the Contract](#using-the-contract)
  - [List an Item](#list-an-item)
  - [Get Listed Items](#get-listed-items)
  - [Buy an Item](#buy-an-item)
  - [Confirm Receipt](#confirm-receipt)
  - [Withdraw Funds](#withdraw-funds)
  - [Resolve Dispute](#resolve-dispute)
- [Front-end Interaction](#front-end-interaction)
- [Files and Directories](#files-and-directories)
- [Conclusion](#conclusion)

## Features

- **List Items**: Sellers can list items for sale by specifying the item name and price.
- **Get Item Details**: Users can fetch details of the listed items.
- **Buy Items**: Buyers can purchase items, with the payment held in escrow.
- **Confirm Receipt**: Buyers can confirm receipt of items, releasing funds to the seller.
- **Withdraw Funds**: Sellers can withdraw their funds once the buyer confirms receipt.
- **Raise Dispute**: Buyers can raise disputes if there is an issue with the item.
- **Resolve Dispute**: Disputes can be resolved, ensuring fair transactions.

## Using the Contract

### List an Item

- Use the `listItem` function to list an item with its name and price.

### Get Listed Items

- Use the `getItemDetails` function to retrieve details of the listed item.

### Buy an Item

1. Switch to the buyer account in MetaMask.
2. Enter the item price in the "Value" field.
3. Use the `buyItem` function with the item name.

### Confirm Receipt

- Use the `confirmReceipt` function to confirm receipt of the item.

### Withdraw Funds

- Use the `withdrawFunds` function to withdraw funds as the seller.

### Resolve Dispute

- Use the `raiseDispute` function to raise a dispute if there are issues with the item.

## Front-end Interaction

### Steps to Interact with the DApp

1. **Connect Wallet**: Click the "Connect Wallet" button to connect your MetaMask wallet.
2. **List a New Item**: Enter the item name and price (in ETH) and click "List Item" to list the item on the marketplace.
3. **Fetch Item Details**: Enter the item name and click "Fetch Item" to get the details of the item from the marketplace.
4. **Buy Item**: If the item is available, click the "Buy Item" button to purchase it. This will send the specified amount of Ether to the contract.
5. **Confirm Receipt**: If the item is sold but not confirmed, click "Confirm Receipt" to confirm receipt of the item.
6. **Withdraw Funds**: Click the "Withdraw Funds" button (visible only to the seller) to withdraw all available funds for confirmed items.
7. **Raise Dispute**: If there is an issue with the item, click "Raise Dispute" to raise a dispute.

## Files and Directories

- **contracts/**: Contains the Solidity smart contract (`EscrowMarketplace.sol`).
- **scripts/**: Contains the deployment script (`deploy.js`).
- **test/**: Contains the unit tests for the smart contract (`escrow.js`).
- **client/**: Contains the React front-end code.
- **.env**: Environment variables for Alchemy API key and MetaMask private key.
- **hardhat.config.js**: Hardhat configuration file.

## Conclusion

Thank you for checking out this repo! 


