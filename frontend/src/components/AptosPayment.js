import React, { useState } from 'react';
import { useAptos } from '../contexts/AptosContext';

const AptosPayment = ({ amount, recipientAddress, onSuccess, onError }) => {
  const { connected, connect, handlePayment, balance } = useAptos();
  const [loading, setLoading] = useState(false);

  const handlePaymentClick = async () => {
    try {
      if (!connected) {
        await connect();
        return;
      }

      setLoading(true);
      const response = await handlePayment(amount, recipientAddress);
      
      // Show success message
      alert('Payment successful!');
      onSuccess?.(response);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Aptos Payment</h3>
      <div className="mb-4">
        <p className="text-gray-600">Amount: {amount / 100000000} APT</p>
        <p className="text-gray-600">Balance: {balance / 100000000} APT</p>
      </div>
      <button
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          loading || (connected && balance < amount)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
        onClick={handlePaymentClick}
        disabled={loading || (connected && balance < amount)}
      >
        {loading ? 'Processing...' : !connected ? 'Connect Wallet' : 'Pay with Aptos'}
      </button>
    </div>
  );
};

export default AptosPayment;