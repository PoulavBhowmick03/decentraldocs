import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const handleAccountsChanged = (accounts) => {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
        setAccount(null);
      } else if (accounts[0] !== account) {
        setAccount(accounts[0]);
      }
    };

    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

      web3Provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      });
    } else {
      console.error('MetaMask not detected. Please install MetaMask.');
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, [account]);

  const connect = async () => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
    }
  };

  const disconnect = () => {
    setAccount(null);
  };

  const switchWallet = async () => {
    if (provider) {
      try {
        await window.ethereum.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }]
        });
        const accounts = await provider.listAccounts();
        setAccount(accounts[0]);
      } catch (err) {
        console.error('Failed to switch wallet:', err);
      }
    }
  };

  return { account, provider, connect, disconnect, switchWallet };
};

export default useWallet;
