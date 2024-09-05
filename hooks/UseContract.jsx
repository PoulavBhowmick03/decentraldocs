import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { ABI } from '@/utils/ethereum';

const useContract = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contractInstance = new ethers.Contract(ABI.address, ABI.abi, signer);
          
          console.log("Contract instance:", contractInstance);
          
          setContract(contractInstance);
        } catch (error) {
          console.error("Failed to initialize contract:", error);
        }
      }
    };

    initContract();
  }, []);

  return contract;
}

export default useContract;

