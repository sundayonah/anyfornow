import React from 'react';

const MainPage = () => {
   return (
      <main className="w-[80%] flex justify-between items-center space-x-9 m-auto mt-10 ">
         <div className="w-[80%] ">
            <span>Stats</span>
            <div className="p-6 border border-gray-500 rounded-md ">
               <h2>12,234 ANC = $10.03M</h2>
               <h6 className="text-sm text-gray-500">Total Staked ANC</h6>
               <div className="flex justify-between items-center pt-5">
                  <span>
                     <h2>23.23%</h2>
                     <span className="text-sm  text-gray-500">APR</span>
                  </span>
                  <span>
                     <h2>4,554</h2>
                     <span className="text-sm  text-gray-500">
                        No of Stakers
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
         <div className="w-[80%] border">
            <div>RIGHT SIDE</div>
         </div>
      </main>
   );
};

export default MainPage;
//
