import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { usePublicData } from '../context/PublicDataContext';

const MainLayout = () => {
  const { content } = usePublicData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoUrl={content?.logo?.imageUrl} />
      <main className="flex-1">
        <Outlet context={{ content }} />
      </main>
      <Footer content={content} />
    </div>
  );
};

export default MainLayout;
