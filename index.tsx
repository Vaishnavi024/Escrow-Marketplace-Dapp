import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import EscrowMarketplace from '../utils/EscrowMarketplace.json';

const contractAddress = "0x99B52141E6351b235005ad87A32A351243893Ec8";

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [fetchedItemName, setFetchedItemName] = useState('');

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      setCurrentAccount(account);
    } catch (error) {
      console.log('Error connecting to wallet:', error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log('Metamask not detected');
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found account', accounts[0]);
      return accounts[0];
    } catch (error) {
      console.log('Error connecting to Metamask', error);
      throw error;
    }
  };

  const listNewItem = async () => {
    if (itemName === '' || itemPrice === '') return;

    const priceInWei = ethers.utils.parseEther(itemPrice);

    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EscrowMarketplace.abi, signer);

        await contract.listItem(itemName, priceInWei);
        alert("Item listed successfully!");
      }
    } catch (error) {
      console.log("Error listing item: ", error);
    }
  };

  const buyItem = async (itemName, priceInWei) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EscrowMarketplace.abi, signer);

        const transaction = await contract.buyItem(itemName, { value: priceInWei });
        await transaction.wait();
        alert("Item bought successfully!");
      }
    } catch (error) {
      console.log("Error buying item: ", error);
      alert(`Error buying item: ${error.message}`);
    }
  };

  const fetchItems = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EscrowMarketplace.abi, signer);

        const itemDetails = await contract.getItemDetails(fetchedItemName);
        const item = {
          name: fetchedItemName,
          price: itemDetails.price,
          isSold: itemDetails.isSold,
          buyer: itemDetails.buyer,
          seller: itemDetails.seller,
          isConfirmed: itemDetails.isConfirmed,
        };
        setItems([item]);
      }
    } catch (error) {
      console.log("Error fetching items: ", error);
    }
  };

  const confirmReceipt = async (itemName) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EscrowMarketplace.abi, signer);

        await contract.confirmReceipt(itemName);
        alert("Receipt confirmed successfully!");
      }
    } catch (error) {
      console.log("Error confirming receipt: ", error);
    }
  };

  const raiseDispute = async (itemName) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EscrowMarketplace.abi, signer);

        await contract.raiseDispute(itemName);
        alert("Dispute raised successfully!");
      }
    } catch (error) {
      console.log("Error raising dispute: ", error);
    }
  };

  const withdrawFunds = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, EscrowMarketplace.abi, signer);

        console.log("Calling withdrawFunds function");
        const transaction = await contract.withdrawFunds();
        await transaction.wait();
        console.log("Funds withdrawn successfully");
        alert("Funds withdrawn successfully!");
      }
    } catch (error) {
      console.error("Error withdrawing funds: ", error);
      alert(`Error withdrawing funds: ${error.message}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center text-[#6a50aa] min-h-screen py-12 bg-gray-100">
      <div className="relative z-10 flex flex-col items-center w-full">
        <header className="w-full flex justify-center py-4 bg-white shadow-md mb-10">
          <h1 className="text-4xl font-bold">Escrow Marketplace</h1>
        </header>
        {currentAccount === '' ? (
          <button
            className="text-2xl font-bold py-3 px-12 bg-purple-600 text-white rounded-full mb-10 hover:bg-purple-700 transition duration-500 ease-in-out shadow-lg"
            onClick={handleConnectWallet}
          >
            Connect Wallet
          </button>
        ) : (
          <h4 className="text-3xl font-bold mb-10">Wallet Connected</h4>
        )}
        <div className="w-1/2 bg-white p-8 rounded-lg shadow-md mb-10">
          <h3 className="text-2xl font-bold mb-4">List a New Item</h3>
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-xl"
            type="text"
            placeholder="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-xl"
            type="text"
            placeholder="Item Price (ETH)"
            value={itemPrice}
            onChange={(e) => setItemPrice(e.target.value)}
          />
          <button
            className="text-xl font-bold py-3 px-12 bg-purple-600 text-white rounded-full mb-10 hover:bg-purple-700 transition duration-500 ease-in-out shadow-lg"
            onClick={listNewItem}
          >
            List Item
          </button>
        </div>
        <div className="w-1/2 bg-white p-8 rounded-lg shadow-md mb-10">
          <h3 className="text-2xl font-bold mb-4">Fetch Item Details</h3>
          <input
            className="w-full p-3 mb-4 border border-gray-300 rounded-md text-xl"
            type="text"
            placeholder="Item Name"
            value={fetchedItemName}
            onChange={(e) => setFetchedItemName(e.target.value)}
          />
          <button
            className="text-xl font-bold py-3 px-12 bg-purple-600 text-white rounded-full mb-10 hover:bg-purple-700 transition duration-500 ease-in-out shadow-lg"
            onClick={fetchItems}
          >
            Fetch Item
          </button>
        </div>
        {items.length > 0 && (
          <div className="w-1/2 bg-white p-8 rounded-lg shadow-md mb-10">
            <h3 className="text-2xl font-bold mb-4">Item Details</h3>
            {items.map((item, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">
                <h3 className="text-xl font-bold mb-2">Item: {item.name}</h3>
                <p className="text-gray-700 mb-1">Price: {ethers.utils.formatEther(item.price)} ETH</p>
                <p className="text-gray-700 mb-1 overflow-hidden text-ellipsis">Seller: {item.seller}</p>
                <p className="text-gray-700 mb-1 overflow-hidden text-ellipsis">Buyer: {item.buyer}</p>
                <p className="text-gray-700 mb-1">Confirmed: {item.isConfirmed ? 'Yes' : 'No'}</p>
                <p className="text-gray-700 mb-3">Status: {item.isSold ? 'Sold' : 'Available'}</p>
                {!item.isSold && (
                  <button
                    className="text-sm font-semibold py-2 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-500 ease-in-out shadow-lg"
                    onClick={() => buyItem(item.name, item.price)}
                  >
                    Buy Item
                  </button>
                )}
                {item.isSold && !item.isConfirmed && (
                  <button
                    className="text-sm font-semibold py-2 px-4 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-500 ease-in-out shadow-lg mt-2"
                    onClick={() => confirmReceipt(item.name)}
                  >
                    Confirm Receipt
                  </button>
                )}
                {item.isSold && item.isConfirmed && (
                  <button
                    className="text-sm font-semibold py-2 px-4 bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-500 ease-in-out shadow-lg mt-2"
                    onClick={() => raiseDispute(item.name)}
                  >
                    Raise Dispute
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {currentAccount && (
          <button
            className="text-xl font-bold py-3 px-12 bg-green-600 text-white rounded-full mb-10 hover:bg-green-700 transition duration-500 ease-in-out shadow-lg"
            onClick={withdrawFunds}
          >
            Withdraw Funds
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
