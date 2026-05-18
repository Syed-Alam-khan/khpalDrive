import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainLayout from './MainLayout/MainLayout'
import Home from './pages/Home'
import AllCars from './pages/AllCars'
import SellCar from './pages/SellCar'
import MyListings from './pages/MyListings'
import CarDetail from './pages/CarDetail'
import Profile from './pages/Profile'
import Register from './pages/Register'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import AdminRoute from './components/AdminRoute'
import ProtectedRoute from './components/ProtectedRoute'
import Settings from './pages/Settings'
import { UserProvider } from './context/UserContext'
import { CarProvider } from './context/CarContext'
import { CategoryProvider } from './context/CategoryContext'
import { PartCategoryProvider } from './context/PartCategoryContext'
import { AutoPartProvider } from './context/AutoPartContext'
import SellAutoPart from './pages/SellAutoPart'
import PartDetail from './pages/PartDetail'

function App() {
  return (
    <UserProvider>
      <CarProvider>
        <CategoryProvider>
          <PartCategoryProvider>
            <AutoPartProvider>
              <Router>
            <div className="min-h-screen font-sans selection:bg-purple-100 overflow-x-hidden">
              <Routes>
                {/* Admin Route - No MainLayout */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                
                {/* All Other Routes - With MainLayout */}
                <Route path="*" element={
                  <MainLayout>
                    <Routes>
                      <Route path="/" element={
                        (() => {
                          const info = localStorage.getItem('userInfo');
                          const user = info ? JSON.parse(info).user : null;
                          return user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Home />;
                        })()
                      } />
                      <Route path="/all-cars" element={<AllCars />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/sell" element={<ProtectedRoute><SellCar /></ProtectedRoute>} />
                      <Route path="/sell-part" element={<ProtectedRoute><SellAutoPart /></ProtectedRoute>} />
                      <Route path="/listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                      <Route path="/detail/:id" element={<CarDetail />} />
                      <Route path="/part/:id" element={<PartDetail />} />
                      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                    </Routes>
                  </MainLayout>
                } />
              </Routes>

              <ToastContainer 
                position="bottom-right"
                autoClose={3000}
                theme="light"
              />
            </div>
            </Router>
            </AutoPartProvider>
          </PartCategoryProvider>
        </CategoryProvider>
      </CarProvider>
    </UserProvider>
  )
}

export default App
