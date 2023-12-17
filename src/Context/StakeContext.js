import React, { useState, useEffect, useContext, createContext } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { useWeb3Modal, useWeb3ModalTheme } from '@web3modal/wagmi/react';
import { ethers } from 'ethers';
import stakingAbi from '@/Contract/stakingAbi.json';
import approveAbi from '@/Contract/approve.json';
import toast, { Toaster } from 'react-hot-toast';

// import axios from 'axios';

export const StakingContext = createContext({});

export const StakingContextProvider = ({ children }) => {
   // const stakingContractAddress = '0xE2113ac80Dde5248E771053FD3c031250E87d777';
   // const stakingContractAddress = '0x7350dfDdFF2227ba903f8260197E66dBf7939e76';
   const stakingContractAddress = '0xedB8bd7a1866Ac01EDe01CEA7712EBF957a0a9c3';
   // const approveContractAddress = '0x97Df9831BEA07703F72287A90C163726315eB1Fd';

   const { address, isConnected } = useAccount();
   const { connect } = useConnect({
      connector: new InjectedConnector(),
   });
   const { disconnect } = useDisconnect();

   /// state variables
   const [walletBalance, setWalletBalance] = useState();
   const [totalStaker, setTotalStaker] = useState(''); // f(x)
   const [stakeLoading, setStakeLoading] = useState(false);
   const [unStakeLoading, setUnStakeLoading] = useState(false);
   const [approvedLoading, setApprovedLoading] = useState(false);
   const [stakeAmount, setStakeAmount] = useState('');
   const [calculateReward, setCalulateReward] = useState('');
   const [isApproved, setIsApproved] = useState(false);
   const [dailyRoi, setDailyRoi] = useState();
   const [profitPool, setProfitPool] = useState();
   const [withdrawnReferral, setWithdrawnReferral] = useState();
   const [referralLoading, setReferralLoading] = useState(false);
   const [noReferralYet, setNoReferralYet] = useState(false);
   const [noProfitYet, setNoProfitYet] = useState(false);
   const [profitLoading, setProfitLoading] = useState(false);
   const [lessAmount, setLessAmount] = useState(false);
   const [claimLoading, setClaimLoading] = useState(false);
   const [signer, setSigner] = useState(null);
   const [maxBalance, setMaxBalance] = useState('');
   const [totalAmountStake, setTotalAmountStake] = useState();
   const [ethBalance, setEthBalance] = useState('');

   const handleChange = async (e) => {
      setStakeAmount(e.target.value);
   };

   async function getContract() {
      try {
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const contractInstance = new ethers.Contract(
            stakingContractAddress,
            stakingAbi,
            signer
         );

         return contractInstance;
      } catch (error) {
         console.error('Error getting approval contract:', error);
         throw error;
      }
   }

   const handleMaxButtonClick = async () => {
      try {
         if (address === undefined) {
            toast.success(`Please Connect Your Wallet.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
                  // border: '1px solid #a16206',
               },
            });
            return;
         }
         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const getApproveContractAddress = await getContract();

         const approveContractAddress = await getApproveContractAddress.TOKEN();

         const contractInstance = new ethers.Contract(
            approveContractAddress,
            approveAbi,
            signer
         );

         const balance = await contractInstance.balanceOf(address);

         const stringBalance = ethers.utils.formatEther(balance.toString());

         const formattedBalance = parseFloat(stringBalance).toFixed(3);

         setMaxBalance(formattedBalance);
         setStakeAmount(formattedBalance);
      } catch (error) {
         console.error('Error fetching balance:', error);
      }
   };

   ///// WALLET BALANCE ///////////
   useEffect(() => {
      const fetchBalance = async () => {
         try {
            // const provider = new ethers.getDefaultProvider(
            //    'https://data-seed-prebsc-1-s1.binance.org:8545/'
            // );

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const getApproveContractAddress = await getContract();

            const approveContractAddress =
               await getApproveContractAddress.TOKEN();

            const contractInstance = new ethers.Contract(
               approveContractAddress,
               approveAbi,
               signer
            );

            const balance = await contractInstance.balanceOf(address);

            const stringBalance = ethers.utils.formatEther(balance.toString());

            const formattedBalance = parseFloat(stringBalance).toFixed(3);
            setWalletBalance(formattedBalance);

            // getting eth balance
            const getEthBalance = await provider.getBalance(address);
            const balanceEther = ethers.utils.formatEther(getEthBalance);

            setEthBalance(Number(balanceEther).toFixed(4));
         } catch (error) {
            console.error(error);
         }
      };
      if (address) {
         fetchBalance();
      }
   }, [address]);

   useEffect(() => {
      const viewFunction = async () => {
         try {
            const contractInstance = await getContract();

            // total staking
            const max = await contractInstance.totalStaker();
            const totalStake = max.toString();
            setTotalStaker(totalStake);

            // total staking
            const totalAmountStake = await contractInstance.totalStaking();
            const totalStaking = ethers.utils.formatUnits(
               totalAmountStake,
               'ether'
            );

            const totalAmount = Number(totalStaking).toFixed(4);

            setTotalAmountStake(totalAmount);

            // referral rewards
            const maxReward = await contractInstance.calculateRewards(address);

            const reward = ethers.utils.formatUnits(maxReward, 'ether');
            const calculateReward = Number(reward).toFixed(5);

            setCalulateReward(calculateReward);
         } catch (error) {
            console.error(error);
         }
      };

      viewFunction();
   }, [address]);

   // useEffect((
   //    const totalStake = async
   // ))

   ///// UNSTAKE F(x) ///////////
   const UnStake = async () => {
      // const contract = new ethers.Contract(
      //    stakingContractAddress,
      //    stakingAbi,
      //    signer
      // );

      const contract = await getContract();

      if (address === undefined) {
         toast.success(`Please Connect Your Wallet.`, {
            duration: 4000,
            position: 'top-right',
            icon: '❌',
            style: {
               color: '#fff',
               background: `linear-gradient(to right, #000f58, #000624)`,
            },
         });
         return;
      }

      const _amount = ethers.utils.parseEther(stakeAmount, 'ether');

      const stringAmount = _amount.toString();

      setUnStakeLoading(true);
      // setNoProfitYet(false);
      // setStakeLoading(true);
      try {
         let tx;
         // if (profitPool == 0) {
         //    setNoProfitYet(true);
         //    setTimeout(() => {
         //       setNoProfitYet(false);
         //    }, 3000);
         // } else {
         // setNoProfitYet(false);
         // setProfitLoading(true);
         tx = await contract.unStake(stringAmount, {
            gasLimit: 600000,
            gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
         });
         const receipt = await tx.wait();
         if (receipt.status == 1) {
            setUnStakeLoading(false);
            // setProfitLoading(false);
            // Reload the page after a successful transaction
            window.location.reload();
         } else {
            setUnStakeLoading(false);
            // setProfitLoading(false);
         }
         // }
      } catch (err) {
         console.error(err);
         setUnStakeLoading(false);
      }

      // setStakeLoading(false);
   };

   ///// STAKE F(x) ///////////
   const Stake = async () => {
      setStakeLoading(true);
      try {
         const contract = await getContract();

         if (address === undefined) {
            toast.success(`Please Connect Your Wallet.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  color: '#fff',
                  background: `linear-gradient(to right, #000f58, #000624)`,
               },
            });
            return;
         }
         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');

         const stringAmount = _amount.toString();

         // // Convert back to Ether format for logging or displaying
         // const formattedAmount = ethers.utils.formatEther(_amount);
         // console.log(formattedAmount);

         const tx = await contract.stake(stringAmount, {
            gasLimit: 600000,
            gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
         });

         setStakeAmount('');

         const receipt = await tx.wait();

         //   check if the transaction was successful
         if (receipt.status === 1) {
            setStakeLoading(false);
         } else {
            console.log('error');
            setStakeLoading(false);
         }
      } catch (err) {
         console.error(err);
         // error();
         // setStatus('error');
      }
      setStakeLoading(false);
   };

   ///// CLAIM F(x) ///////////
   const Claim = async () => {
      // const contract = new ethers.Contract(
      //    stakingContractAddress,
      //    stakingAbi,
      //    signer
      // );

      const contract = await getContract();

      if (address === undefined) {
         toast.success(`Please Connect Your Wallet.`, {
            duration: 4000,
            position: 'top-right',
            icon: '❌',
            style: {
               color: '#fff',
               background: `linear-gradient(to right, #000f58, #000624)`,
            },
         });
         return;
      }

      setClaimLoading(true);

      setNoProfitYet(false);
      // setStakeLoading(true);
      try {
         let tx;
         if (profitPool == 0) {
            setNoProfitYet(true);
            setTimeout(() => {
               setNoProfitYet(false);
            }, 3000);
         } else {
            setNoProfitYet(false);
            setProfitLoading(true);
            tx = await contract.unStake(0, {
               gasLimit: 600000,
               gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
            });
            const receipt = await tx.wait();
            if (receipt.status == 1) {
               setClaimLoading(false);

               setProfitLoading(false);
               // Reload the page after a successful transaction
               window.location.reload();
            } else {
               setProfitLoading(false);
               setClaimLoading(false);
            }
         }
      } catch (err) {
         console.error(err);
      }
      // setStakeLoading(false);
      setClaimLoading(false);
   };
   ///// APPROVE F(x) ///////////
   const Approved = async () => {
      // setIsLoading(true);
      // setLessAmount(false);

      if (address === undefined) {
         toast.success(`Please Connect Your Wallet.`, {
            duration: 4000,
            position: 'top-right',
            icon: '❌',
            style: {
               color: '#fff',
               background: `linear-gradient(to right, #000f58, #000624)`,
            },
         });
         return;
      }

      try {
         // const getApproveContractAddress = new ethers.Contract(
         //    stakingContractAddress,
         //    stakingAbi,
         //    signer
         // );

         const provider = new ethers.providers.Web3Provider(window.ethereum);
         const signer = provider.getSigner();

         const instanceContract = getContract();

         const contractInstance = new ethers.Contract(
            '0xcff4DC410aAF567831d27Cb168010174f0E58a5F',
            approveAbi,
            signer
         );

         // Convert the input stakeAmount to Ether
         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');
         const amountToString = _amount.toString();

         console.log(amountToString);
         //100000000000000000000
         let tx;

         tx = await contractInstance.approve(
            stakingContractAddress,
            amountToString,
            {
               gasLimit: 600000,
               gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
            }
         );

         // setIsApproved(true);
         const receipt = await tx.wait();
         //   check if the transaction was successful
         if (receipt.status === 1) {
            setIsApproved(true);
            setApprovedLoading(false);
         } else {
         }
         // }

         // setIsApproved(true);
      } catch (error) {
         console.error(error);

         if (error.code === 4001) {
            // User cancelled the transaction, set loading to false
            setApprovedLoading(false);
         } else {
            // Handle other transaction errors
            console.error(error);
         }
         setApprovedLoading(false);
      }

      // setIsLoading(false);
   };

   // ///// claimReferralRewards F(x) ///////////
   const ClaimReferralRewards = async () => {
      setNoReferralYet(false);

      try {
         const contract = new ethers.Contract(
            stakingContractAddress,
            stakingAbi,
            signer
         );
         let tx;
         if (referralReward == 0) {
            setNoReferralYet(true);
            setTimeout(() => {
               setNoReferralYet(false);
            }, 3000);
            // setNoReferralYet(true);
         } else {
            setNoReferralYet(false);
            setReferralLoading(true);

            tx = await contract.claimReferralRewards({
               gasLimit: 100000,
               gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
            });
            const receipt = await tx.wait();

            if (receipt.status == 1) {
               setReferralLoading(false);
            } else {
               setReferralLoading(false);
            }
         }
      } catch (err) {
         console.error(err);
         // error();
         // setStatus('error');
      }
   };

   return (
      <StakingContext.Provider
         value={{
            // state variables
            noProfitYet,
            profitLoading,
            referralLoading,
            noReferralYet,
            walletBalance,
            totalStaker,
            stakeAmount,
            isApproved,
            dailyRoi,
            profitPool,
            withdrawnReferral,
            lessAmount,
            approvedLoading,
            stakeLoading,
            maxBalance,
            totalAmountStake,
            calculateReward,
            ethBalance,
            unStakeLoading,
            claimLoading,

            // f(x)s
            Claim,
            Stake,
            UnStake,
            handleChange,
            Approved,
            setIsApproved,
            ClaimReferralRewards,
            handleMaxButtonClick,
         }}
      >
         {children}
      </StakingContext.Provider>
   );
};
