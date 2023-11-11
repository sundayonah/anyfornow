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
   const minningContractAddress = '0xE2113ac80Dde5248E771053FD3c031250E87d777';
   // const minningTestnetContractAddress = '0x72BC9712BEb034977f5A0830CE1F3E6ff9440486';
   // const approveContractAddress = '0x97Df9831BEA07703F72287A90C163726315eB1Fd';

   const { address, isConnected } = useAccount();
   const { connect } = useConnect({
      connector: new InjectedConnector(),
   });
   const { disconnect } = useDisconnect();

   /// state variables
   const [walletBalance, setWalletBalance] = useState();
   const [totalStake, setTotalStake] = useState(); // f(x)
   const [stakeLoading, setStakeLoading] = useState(false);
   const [approvedLoading, setApprovedLoading] = useState(false);
   const [stakeAmount, setStakeAmount] = useState('');
   const [referralReward, setReferralReward] = useState('');
   const [isApproved, setIsApproved] = useState(false);
   const [dailyRoi, setDailyRoi] = useState();
   const [profitPool, setProfitPool] = useState();
   const [withdrawnReferral, setWithdrawnReferral] = useState();
   const [referralLoading, setReferralLoading] = useState(false);
   const [noReferralYet, setNoReferralYet] = useState(false);
   const [noProfitYet, setNoProfitYet] = useState(false);
   const [profitLoading, setProfitLoading] = useState(false);
   const [lessAmount, setLessAmount] = useState(false);
   const [provider, setProvider] = useState(null);
   const [signer, setSigner] = useState(null);

   // console.log(address);
   // console.log(isConnected);

   const handleChange = async (e) => {
      setStakeAmount(e.target.value);
   };
   useEffect(() => {
      async function initializeWeb3() {
         if (typeof window.ethereum !== 'undefined') {
            const web3Provider = new ethers.providers.Web3Provider(
               window.ethereum
            );
            const web3Signer = web3Provider.getSigner();
            setProvider(web3Provider);
            setSigner(web3Signer);
         }
      }

      initializeWeb3();
   }, []);

   ///// WALLET BALANCE ///////////
   useEffect(() => {
      const fetchBalance = async () => {
         try {
            // const provider = new ethers.getDefaultProvider(
            //    'https://data-seed-prebsc-1-s1.binance.org:8545/'
            // );

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const getApproveContractAddress = new ethers.Contract(
               minningContractAddress,
               stakingAbi,
               signer
            );

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
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            // const provider = new ethers.getDefaultProvider(
            //    'https://bsc-dataseed1.binance.org/'
            // );

            // const signer = provider.getSigner();
            const contractInstance = new ethers.Contract(
               minningContractAddress,
               stakingAbi,
               provider
            );

            // total staking
            const max = await contractInstance.totalStaking();
            const totalStake = ethers.utils.formatEther(max.toString());
            setTotalStake(totalStake);

            // daily roi
            const roi = await contractInstance.YEAR_RATE();
            const dailyRoi = roi.toString();
            const dailyRoiInEther = ethers.utils.formatUnits(dailyRoi, 'ether');
            const dailyRoiAmount = (dailyRoiInEther / 60) * 30;
            setDailyRoi(dailyRoiAmount);

            // referral rewards
            const maxReferral = await contractInstance.referralRewards(address);
            const referralReward = maxReferral.toString();
            setReferralReward(referralReward);

            // profit pool
            const profitPool = await contractInstance.calculateRewards(address);
            const profitPoolAmount = ethers.utils.formatEther(
               profitPool.toString()
            );
            const formattedProfitPool =
               parseFloat(profitPoolAmount).toFixed(13);
            setProfitPool(formattedProfitPool);

            // referral bonus gain
            const referralBonusGain = await contractInstance.referralBonusGain(
               address
            );
            const referralBonusWithdrawn = referralBonusGain[1];
            const nextReferralTime = referralBonusWithdrawn;

            const time = new Date(nextReferralTime * 1000);
            const format = time.toLocaleString();

            if (nextReferralTime == '0') {
               setWithdrawnReferral('0');
            } else {
               setWithdrawnReferral(format);
            }

            // const refferTime = new Date(referralTime * 1000);
            // const formattedNextClaimTime1 = ClaimTime.toLocaleString();
         } catch (error) {
            console.error(error);
         }
      };

      viewFunction();
   }, [address]);

   ///// UNSTAKE F(x) ///////////
   const UnStake = async () => {
      const contract = new ethers.Contract(
         minningContractAddress,
         stakingAbi,
         signer
      );

      if (address === undefined) {
         toast.success(`Please Connect Your Wallet.`, {
            duration: 4000,
            position: 'top-right',
            icon: '❌',
            style: {
               background: '#fff',
               border: '1px solid #a16206',
            },
         });
         return;
      }

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
               gasLimit: 200000,
               gasPrice: ethers.utils.parseUnits('10.0', 'gwei'),
            });
            const receipt = await tx.wait();
            if (receipt.status == 1) {
               setProfitLoading(false);
               // Reload the page after a successful transaction
               window.location.reload();
            } else {
               setProfitLoading(false);
            }
         }
      } catch (err) {
         console.error(err);
      }
      // setStakeLoading(false);
   };

   const handleMaxClick = async () => {
      try {
         const balance = await provider.getBalance(address);

         // Convert balance to Ether and set it in the state
         setMaxBalance(ethers.utils.formatEther(balance));
      } catch (error) {
         console.error('Error fetching balance:', error);
      }
   };

   ///// STAKE F(x) ///////////
   const Stake = async () => {
      setStakeLoading(true);
      try {
         const contract = new ethers.Contract(
            minningContractAddress,
            stakingAbi,
            signer
         );

         if (address === undefined) {
            toast.success(`Please Connect Your Wallet.`, {
               duration: 4000,
               position: 'top-right',
               icon: '❌',
               style: {
                  background: '#fff',
                  border: '1px solid #a16206',
               },
            });
            return;
         }
         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');
         console.log(_amount);
         const stringAmount = _amount.toString();
         console.log(stringAmount);

         // if (_amount < 0 || stakeAmount === '') {
         //    toast.success(`Please input Amount `, {
         //       duration: 4000,
         //       position: 'top-right',
         //       icon: '❌',
         //       style: {
         //          background: '#fff',
         //          border: '1px solid #a16206',
         //       },
         //    });
         //    return;
         // }

         const tx = await contract.stake(_amount, {
            gasLimit: 300000,
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
   ///// APPROVE F(x) ///////////
   const Approved = async () => {
      // setIsLoading(true);
      // setLessAmount(false);

      try {
         const getApproveContractAddress = new ethers.Contract(
            minningContractAddress,
            stakingAbi,
            signer
         );

         const approveContractAddress = await getApproveContractAddress.TOKEN();

         const contractInstance = new ethers.Contract(
            approveContractAddress,
            approveAbi,
            signer
         );

         const checkIfApprove = await contractInstance.allowance(
            address,
            minningContractAddress
         );
         // console.log(contractInstance);

         // Fetch the balance before performing the check
         const walletBalance = await provider.getBalance(address);
         const balance = parseFloat(ethers.utils.formatEther(walletBalance));

         const minimumStakingAmount =
            await getApproveContractAddress.getMinimumStakeAmount();
         const minimumToString = parseFloat(minimumStakingAmount.toString());

         // Convert the input stakeAmount to Ether
         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');
         const amountToString = _amount.toString();

         let tx;

         if (
            amountToString < minimumToString
            //  &&
            //   amountToString > walletBalance
         ) {
            // setApprovedLoading(true);
            // setIsLoading(true);

            setLessAmount(true);
            setTimeout(() => {
               setLessAmount(false);
            }, 3000);

            setIsApproved(false);
         } else {
            setApprovedLoading(true);
            // const value = ethers.utils.parseEther(_amount, 'ether');
            tx = await contractInstance.approve(
               minningContractAddress,
               amountToString,
               {
                  gasLimit: 51000,
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
         }

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
            minningContractAddress,
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
            totalStake,
            stakeAmount,
            referralReward,
            isApproved,
            dailyRoi,
            profitPool,
            withdrawnReferral,
            lessAmount,
            approvedLoading,
            stakeLoading,

            // f(x)s
            Stake,
            UnStake,
            handleChange,
            Approved,
            setIsApproved,
            ClaimReferralRewards,
         }}
      >
         {children}
      </StakingContext.Provider>
   );
};
