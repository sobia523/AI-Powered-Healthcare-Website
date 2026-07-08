import React, { createContext, useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// Shared Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatWidget from './components/ChatWidget';
import SplashScreen from './components/SplashScreen';

// Page Views
import HomePage from './pages/HomePage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DoctorsList from './pages/DoctorsList';
import DoctorDetails from './pages/DoctorDetails';
import BookAppointment from './pages/BookAppointment';
import MedicinesPage from './pages/MedicinesPage';
import MedicineDetails from './pages/MedicineDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LabTestsPage from './pages/LabTestsPage';
import EmergencyContacts from './pages/EmergencyContacts';
import ContactPage from './pages/ContactPage';

export const AppContext = createContext();

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('careconnect_splash_shown');
  });

  const [token, setToken] = useState(() => localStorage.getItem('careconnect_token') || '');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Cart State (persistent in localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('careconnect_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('careconnect_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync authentication user info on mount
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          let data;
          try { data = await res.json(); } catch { data = null; }
          if (data && data.user) setUser(data.user);
          else logout();
        } else {
          logout();
        }
      } catch (err) {
        console.error('Error authenticating user session:', err);
      } finally {
        setAuthLoading(false);
      }
    };
    fetchMe();
  }, [token]);

  // Safe JSON parser – prevents crash when backend is unreachable
  const safeJson = async (res) => {
    const text = await res.text();
    if (!text) return null;
    try { return JSON.parse(text); } catch { return null; }
  };

  const SERVER_DOWN_MSG = 'Backend server is not running. Please start it with: npm run dev:full';

  // Auth Operations
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await safeJson(res);
      if (!data) throw new Error(SERVER_DOWN_MSG);
      if (!res.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('careconnect_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await safeJson(res);
      if (!data) throw new Error(SERVER_DOWN_MSG);
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      localStorage.setItem('careconnect_token', data.token);
      setToken(data.token);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const forgotPassword = async (email, newPassword) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword })
      });
      const data = await safeJson(res);
      if (!data) throw new Error(SERVER_DOWN_MSG);
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('careconnect_token');
    setToken('');
    setUser(null);
  };

  // Cart Operations
  const addToCart = (med) => {
    setCart((prev) => {
      const medId = med.id || med._id;
      const existing = prev.find((item) => (item.id === medId || item._id === medId));
      if (existing) {
        return prev.map((item) => 
          (item.id === medId || item._id === medId) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...med, quantity: 1 }];
    });
  };

  const updateCartQuantity = (medId, quantity) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((item) => (item.id === medId || item._id === medId) ? { ...item, quantity } : item)
    );
  };

  const removeFromCart = (medId) => {
    setCart((prev) => prev.filter((item) => !(item.id === medId || item._id === medId)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const finishSplash = () => {
    sessionStorage.setItem('careconnect_splash_shown', 'true');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={finishSplash} />;
  }

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        authLoading,
        cart,
        login,
        signup,
        forgotPassword,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart
      }}
    >
      <BrowserRouter>
        <Navbar />
        <main className="page-shell">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/doctors" element={<DoctorsList />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/book-appointment/:id" element={<BookAppointment />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/:id" element={<MedicineDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/lab-tests" element={<LabTestsPage />} />
            <Route path="/emergency" element={<EmergencyContacts />} />
            <Route path="/contact" element={<ContactPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <ChatWidget />
        <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
