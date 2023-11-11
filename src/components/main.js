import React from 'react';

const MainPage = () => {
   return (
      <main className="w-[80%] flex justify-between items-center space-x-9 m-auto mt-10 ">
         <div className="w-[80%] ">
            <span>Stats</span>
            <div className="p-9 border border-gray-500 rounded-md ">
               <h2>12,234 ANC = $10.03M</h2>
               <h6 className="text-sm text-gray-500">Total Staked ANC</h6>
               <div className="flex justify-between items-center pt-5">
                  <span>
                     <h2>23.23%</h2>
                     <span className="text-sm  text-gray-500">APR</span>
                  </span>
                  <span className="inline-block h-8 border-r border-solid border-gray-400"></span>
                  <span>
                     <h2>4,554</h2>
                     <span className="text-sm  text-gray-500">
                        No. of Stakers
                     </span>
                  </span>
               </div>
            </div>
            <div className="mt-10">
               <span className="">Balances</span>
               <div className="p-6  border border-gray-500 rounded-md ">
                  <div className="flex pb-5 justify-between border-b-[1px]">
                     <div className="flex  ">
                        <img
                           src="/stake.jpg"
                           width={20}
                           height={20}
                           alt="image"
                           className="rounded-full "
                        />
                        <span className="pl-2 text-gray-500">ANC</span>
                     </div>
                     <p>0</p>
                  </div>
                  <div className="flex pb-5 pt-3 justify-between border-b-[1px]">
                     <div className="flex pb-5 ">
                        <img
                           src="/stake.jpg"
                           width={20}
                           height={20}
                           alt="image"
                           className="rounded-full "
                        />
                        <span className="pl-2 text-gray-500">ANC</span>
                     </div>
                     <p>0</p>
                  </div>
                  <div className="flex pt-3 justify-between items-center">
                     <div className=" pb-2 ">
                        <span className="pl-2">0 ANC</span>
                        {/* <p>Research</p> */}
                     </div>
                     <button>Claim Now</button>
                  </div>
               </div>
            </div>
         </div>
         <div className="w-[80%] px-8">
            <div className="flex justify-center items-center py-7 ">
               <button className="bg-transparent border border-gray-600 px-1 p-2">
                  Stake
               </button>
               <button className="bg-gray-500 border border-gray-600 px-1 p-2">
                  unStake
               </button>
            </div>
            <div className=" border border-gray-500 rounded-md">
               <div className="flex justify-between items-center px-4 py-5 ">
                  <span>Stake</span>
                  <span>X</span>
               </div>
               <div className="w-[90%] m-auto flex justify-center border border-gray-500 px-4 py-1">
                  <img
                     src="/stake.jpg"
                     width={20}
                     height={20}
                     alt="image"
                     className="rounded-full"
                  />
                  <input
                     className="w-full bg-transparent focus:outline-none p-1"
                     placeholder="0.0"
                  />
                  <button className="text-sm px-1 bg-gray-600 rounded-md">
                     MAX
                  </button>
               </div>

               <div className="flex  justify-center items-center   px-4 py-2">
                  <button className="w-full bg-gray-600 p-1">Stake</button>
               </div>

               <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-sm text-gray-500">
                     You will Recieve
                  </span>
                  <p className="text-sm">0 ANC</p>
               </div>
               <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-sm text-gray-500">Exchange Rate</span>
                  <p className="text-sm">1 ANC = 1500 ANC</p>
               </div>
               <div className="flex justify-between items-center py-2 px-4">
                  <span className="text-sm text-gray-500">Staking APR</span>
                  <p className="text-sm">17%</p>
               </div>
            </div>
         </div>
      </main>
   );
};

export default MainPage;
//
