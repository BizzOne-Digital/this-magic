import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import Notifications from './components/Notifications';
import ScrollToTop from './components/ScrollToTop';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import { PublicDataProvider } from './context/PublicDataContext';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Testimonials from './pages/Testimonials';
import Contact from './pages/Contact';
import Guides from './pages/Guides';
import Guide from './pages/Guide';
import NotFound from './pages/NotFound';

export const render = (location) => {
  const context = {};
  const body = renderToString(
    <HelmetProvider context={context}>
      <StaticRouter location={location}>
        <AuthProvider>
          <Suspense>
        <PublicDataProvider>
          <ScrollToTop />
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="services" element={<Services />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="contact" element={<Contact />} />
              <Route path="blog/categories/party-dj" element={<Guides />} />
              <Route path="post/:slug" element={<Guide />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </PublicDataProvider>
          </Suspense>
        <Notifications />
        </AuthProvider>
      </StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = context;
  return { body, head: ['title', 'meta', 'link', 'script'].map((key) => helmet[key].toString()).join('\n') };
};
