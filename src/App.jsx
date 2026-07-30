import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider , useAuth} from './context/AuthContext';

import Navbar from './components/Navbar';
import AIAssistant from './components/AIAssistant';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PendingPage from './pages/auth/PendingPage';

// User
import Home from './pages/user/Home';
import Store from './pages/user/Store';
import CarDetail from './pages/user/CarDetail';
import Cart from './pages/user/Cart';
import MyOrders from './pages/user/MyOrders';
import UserProfile from './pages/user/UserProfile';

// Agency
import AgencyDashboard from './pages/agency/AgencyDashboard';
import AgencyCars from './pages/agency/AgencyCars';
import AgencyCarForm from './pages/agency/AgencyCarForm';
import AgencyUpdateCarForm from './pages/agency/AgencyUpdateCarForm';
import AgencyOrders from './pages/agency/AgencyOrders';
import AgencyProfile from './pages/agency/AgencyProfile';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminAccounts from './pages/admin/AdminAccounts';



function ProtectedRoute({ children, allowedRoles }) {
  const { currentRole } = useAuth();
  
  if (!currentRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(currentRole)) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />
      {children}
    </div>
  );
}

function AppRoutes() {
  const { currentRole } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pending" element={<PendingPage />} />
      {/* User Routes */}
      <Route path="/" element={
      currentRole === 'agency' 
        ? <Navigate to="/agency/dashboard" replace />
        : currentRole === 'admin'
        ? <Navigate to="/admin/dashboard" replace />
        : <Layout><Home /></Layout>
      } />
      <Route path="/store" element={<Layout><Store /></Layout>} />
      <Route path="/car/:id" element={<Layout><CarDetail /></Layout>} />
      <Route path="/cart" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout><Cart /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-orders" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout><MyOrders /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/my-profile" element={
        <ProtectedRoute allowedRoles={['user']}>
          <Layout><UserProfile /></Layout>
        </ProtectedRoute>
      } />

      {/* Agency Routes */}
      <Route path="/agency/dashboard" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <Layout><AgencyDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/agency/cars" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <Layout><AgencyCars /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/agency/cars/add" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <Layout><AgencyCarForm /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/agency/cars/edit/:id" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <Layout><AgencyUpdateCarForm /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/agency/orders" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <Layout><AgencyOrders /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/agency/profile" element={
        <ProtectedRoute allowedRoles={['agency']}>
          <Layout><AgencyProfile /></Layout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/cars" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout><AdminCars /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/accounts" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Layout><AdminAccounts /></Layout>
        </ProtectedRoute>
      } />


      {/* Default redirect */}
      <Route path="/" element={
        currentRole === 'user' ? <Navigate to="/home" replace />
          : currentRole === 'agency' ? <Navigate to="/agency/dashboard" replace />
          : currentRole === 'admin' ? <Navigate to="/admin/dashboard" replace />
          : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}



export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
         <AppProvider>
            <AppRoutes />
            <AIAssistant />
         </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
