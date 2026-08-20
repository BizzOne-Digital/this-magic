import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { contentAPI } from '../services/api';

const MainLayout = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    contentAPI.get().then((res) => setContent(res.data.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header logoUrl={content?.logo?.imageUrl} transparent />
      <main className="flex-1">
        <Outlet context={{ content }} />
      </main>
      <Footer content={content} />
    </div>
  );
};

export default MainLayout;
