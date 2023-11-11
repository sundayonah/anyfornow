import Image from 'next/image';
import MainPage from '@/components/main';
import Header from '@/components/header';
import TopBar from '@/components/topBar';

export default function Home() {
   return (
      <div>
         <Header />
         <TopBar />
         <MainPage />
      </div>
   );
}
