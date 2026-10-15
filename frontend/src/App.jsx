import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import { PageLoader } from './components/LoadingSpinner';
import ProtectedRoute from './admin/components/ProtectedRoute';
import AdminLayout from './admin/layouts/AdminLayout';
import ScrollToTop from './components/ScrollToTop';
import { PublicDataProvider } from './context/PublicDataContext';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Contact = lazy(() => import('./pages/Contact'));
const Guides = lazy(() => import('./pages/Guides'));
const Guide = lazy(() => import('./pages/Guide'));
const NotFound = lazy(() => import('./pages/NotFound'));

const AdminLogin = lazy(() => import('./admin/pages/Login'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminLeads = lazy(() => import('./admin/pages/Leads'));
const AdminServices = lazy(() => import('./admin/pages/Services'));
const AdminTestimonials = lazy(() => import('./admin/pages/Testimonials'));
const AdminPromotions = lazy(() => import('./admin/pages/Promotions'));
const AdminGallery = lazy(() => import('./admin/pages/Gallery'));
const AdminContent = lazy(() => import('./admin/pages/Content'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));

// Admin screens are tools, not search landing pages.
const AdminNoIndex = () => (
  <Helmet>
    <title>Admin | This Magic Moment</title>
    <meta name="robots" content="noindex, nofollow" />
  </Helmet>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <PublicDataProvider>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
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

        {/* Admin Routes */}
        <Route
          path="admin/login"
          element={
            <>
              <AdminNoIndex />
              <AdminLogin />
            </>
          }
        />
        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <AdminNoIndex />
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
      </PublicDataProvider>
    </Suspense>
  );
}

export default App;
