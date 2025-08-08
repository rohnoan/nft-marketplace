// src/components/AptosWalletConnect.jsx
import React, { useState } from "react";

const AptosWalletConnect = () => {
  const [account, setAccount] = useState(null);

  const connectWallet = async () => {
    try {
      const response = await window.aptos.connect();
      setAccount(response.address);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  return (
    <div>
      <button onClick={connectWallet} className="bg-blue-500 text-white p-2 rounded">
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Aptos Wallet"}
      </button>
    </div>
  );
};

export default AptosWalletConnect;
