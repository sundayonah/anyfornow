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
   const stakingContractAddress = '0x72BC9712BEb034977f5A0830CE1F3E6ff9440486';
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
   const [maxBalance, setMaxBalance] = useState(''); // State to store the max balance

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
         const provider = new ethers.providers.Web3Provider(window.ethereum);

         const balance = await provider.getBalance(address);

         const etherBalance = ethers.utils.formatEther(balance);

         setMaxBalance(etherBalance);
         setStakeAmount(etherBalance);
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
            console.log(formattedBalance);
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
            const contractInstance = await getContract();

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
      // const contract = new ethers.Contract(
      //    stakingContractAddress,
      //    stakingAbi,
      //    signer
      // );

      const contract = await getContract();

      console.log(contract);

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
                  background: '#fff',
                  border: '1px solid #a16206',
               },
            });
            return;
         }
         const _amount = ethers.utils.parseEther(stakeAmount, 'ether');
         // console.log(_amount);

         // const stringAmount = _amount.toString();
         // console.log(stringAmount);

         // // Convert back to Ether format for logging or displaying
         // const formattedAmount = ethers.utils.formatEther(_amount);
         // console.log(formattedAmount);

         const tx = await contract.stake(_amount, address, {
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
            stakingContractAddress,
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
            stakingContractAddress
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
               stakingContractAddress,
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
            maxBalance,

            // f(x)s
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
