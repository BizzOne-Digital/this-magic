import { Toaster } from 'react-hot-toast';

export default function Notifications() {
  return <Toaster position="top-right" toastOptions={{
    duration: 4000,
    style: { background: '#0A0E1A', color: '#fff' },
    success: { iconTheme: { primary: '#00B7C7', secondary: '#fff' } },
  }} />;
}
