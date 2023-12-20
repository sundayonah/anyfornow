import React, { useContext, useState } from 'react';
import { StakingContext } from '@/Context/StakeContext';
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { Loading } from './Loading';

const MainPage = () => {
   const {
      UnStake,
      Stake,
      stakeAmount,
      handleChange,
      handleMaxButtonClick,
      maxBalance,
      totalStaker,
      totalAmountStake,
      walletBalance,
      calculateReward,
      Claim,
      Approved,
      isApproved,
      ethBalance,
      unStakeLoading,
      claimLoading,
      approvedLoading,
      stakeLoading,
   } = useContext(StakingContext);

   const { address } = useAccount();

   const [stakeButtonState, setStakeButtonState] = useState('Stake'); // Initial state

   const handleButtonAboveClick = (buttonState) => {
      setStakeButtonState(buttonState);
   };

   const handleStakeAndUnStakeChange = async () => {
      if (stakeButtonState === 'Stake') {
         if (isApproved) {
            Stake();
         } else {
            await Approved();
         }
      } else {
         await UnStake();
      }
   };

   return (
      // <main className="w-[70%] md:w-[85%] flex flex-col md:flex-row lg:w-[80%] justify-between items-center space-y-4 md:space-y-0 md:space-x-9 m-auto my-10 ">
      // <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-9 w-[70%] md:w-[85%] lg:w-[80%] m-auto my-10 items-center justify-center">
      <main className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-[80%] md:w-[75%] lg:w-[75%] m-auto my-10">
         <Toaster />
         {/* left side */}
         <div className="w-full md:w-[80%] m-auto">
            <span>Stats</span>
            <div className="p-9 border border-gray-600 rounded-md ">
               <h2>${totalAmountStake} MONIE</h2>
               <h6 className="text-sm text-gray-500">Total Staked MONIE</h6>
               <div className="flex justify-between items-center pt-5">
                  <span>
                     <h2>0.5% Daily</h2>
                     <span className="text-sm  text-gray-500">APR</span>
                  </span>
                  <span className="inline-block h-12 border-r border-solid border-gray-600"></span>
                  <span>
                     <h2>{totalStaker}</h2>
                     <span className="text-sm  text-gray-500">
                        No. of Stakers
                     </span>
                  </span>
               </div>
            </div>
            <div className="mt-10">
               <span className="">Balances</span>
               <div className="p-6  border border-gray-600 rounded-md ">
                  <div className="flex pb-3 justify-between border-b border-gray-600">
                     <div className="flex  ">
                        <img
                           src="/ethereum-eth.svg"
                           // width={30}
                           // height={20}
                           alt="image"
                           className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="pl-1 text-gray-500">ETH</span>
                     </div>
                     <p>{ethBalance}</p>
                  </div>
                  <div className="flex pb-3 pt-3 justify-between border-b border-gray-600">
                     <div className="flex ">
                        <img
                           src="/monie.jpg"
                           // width={30}
                           // height={20}
                           alt="image"
                           className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="pl-1 text-gray-500">MONIE</span>
                     </div>
                     <p>{walletBalance}</p>
                  </div>
                  <div className="flex pt-3 justify-between items-center">
                     <div className=" pb-2 ">
                        <span className="pl-2">{calculateReward} MONIE</span>
                        {/* <p>Research</p> */}
                     </div>
                     <button
                        onClick={() => Claim()}
                        className="bg-gradient-to-b from-blue-500 hover:bg-blue-900 py-1 px-2 rounded-md"
                     >
                        {claimLoading ? <Loading /> : 'Claim Now'}
                     </button>
                  </div>
               </div>
            </div>
         </div>
         {/* right side */}
         <div className="w-full md:w-[80%] m-auto ">
            <div className="flex justify-center items-center py-7">
               <button
                  onClick={() => handleButtonAboveClick('Stake')}
                  className={` border border-gray-600 px-8 md:px-12 p-2 ${
                     stakeButtonState === 'Stake'
                        ? 'bg-blue-700 hover:bg-blue-600 text-white'
                        : ''
                  }`}
               >
                  Stake
               </button>
               <button
                  onClick={() => handleButtonAboveClick('Unstake')}
                  className={` border border-gray-600 px-8 md:px-12 p-2 ${
                     stakeButtonState === 'Unstake'
                        ? 'bg-blue-700 hover:bg-blue-600 text-white'
                        : ''
                  }`}
               >
                  Unstake
               </button>
            </div>
            <div className=" border border-gray-600 rounded-md">
               <div className="flex justify-between items-center px-4 py-5 ">
                  <span>Stake</span>
                  <span>X</span>
               </div>
               <div className="w-[90%] m-auto flex justify-center items-center border border-gray-600 px-4 py-1">
                  <img
                     src="/monie.jpg"
                     // width={30}
                     // height={20}
                     alt="image"
                     className="w-5 h-5 rounded-full object-cover"
                  />
                  <input
                     className="w-full bg-transparent focus:outline-none p-1"
                     placeholder="0.0"
                     value={stakeAmount}
                     onChange={handleChange}
                  />
                  <button
                     onClick={handleMaxButtonClick}
                     // className={
                     //    address
                     //       ? `text-sm py-1 px-2 bg-gradient-to-b from-blue-500 hover:bg-blue-900 rounded-md`
                     //       : `text-sm py-1 px-2 bg-gray-700  rounded-md cursor-not-allowed`
                     // }
                     className="text-sm py-1 px-2 bg-gradient-to-b from-blue-500 hover:bg-blue-900 rounded-md"
                  >
                     MAX
                  </button>
               </div>

               <div className="flex justify-center items-center px-4 py-2">
                  {/* <button
                     onClick={handleStakeAndUnStakeChange}
                     className="w-full bg-gradient-to-b from-blue-500 hover:bg-blue-900 p-2 rounded-md"
                  >
                     {stakeButtonState === 'Stake' && !isApproved
                        ? 'Approve'
                        : stakeButtonState}
                  </button> */}

                  <button
                     onClick={handleStakeAndUnStakeChange}
                     className="w-full bg-gradient-to-b from-blue-500 hover:bg-blue-900 p-2 rounded-md"
                     disabled={stakeLoading || approvedLoading} // Disable button while loading
                  >
                     {stakeButtonState === 'Stake' && !isApproved ? (
                        approvedLoading ? (
                           <Loading />
                        ) : (
                           'Approve'
                        )
                     ) : stakeButtonState === 'Stake' ? (
                        stakeLoading ? (
                           <Loading />
                        ) : (
                           'Stake'
                        )
                     ) : unStakeLoading ? (
                        <Loading />
                     ) : (
                        stakeButtonState
                     )}
                  </button>
               </div>

               <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-sm text-gray-500">
                     You will Recieve
                  </span>
                  <p className="text-sm">{calculateReward} MONIE</p>
               </div>
               {/* <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-sm text-gray-500">Exchange Rate</span>
                  <p className="text-sm">1 ANC = 1500 ANC</p>
               </div> */}
               <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-sm text-gray-500">Staking APR</span>
                  <p className="text-sm">0.5% daily</p>
               </div>
            </div>
         </div>
      </main>
   );
};

export default MainPage;
//
// loading

{
   /* <div class="flex items-center justify-center">
   <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
</div>; */
}
