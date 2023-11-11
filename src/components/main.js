import React from 'react';

const MainPage = () => {
   return (
      <main className="w-[85%] flex justify-between items-center m-auto mt-10 ">
         <div>
            <span>Stats</span>
            <h2>12,234 ANC = $10.03M</h2>
            <span>Total Staked ANC</span>
            <div className="flex justify-between items-center">
               <span>
                  <h2>23.23%</h2>
                  <span>APR</span>
               </span>
               <span>
                  <h2>4,554</h2>
                  <span>No of Stakers</span>
               </span>
            </div>

            <span>Balance</span>
            <div></div>
         </div>
         <div>RIGHT SIDE</div>
      </main>
   );
};

export default MainPage;
