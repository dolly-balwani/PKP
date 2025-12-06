// Frontend/src/App.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';
import DailyCheckIn from './components/DailyCheckIn';
import BookCounselor from './components/BookCounselor';
import CounsellorDashboard from './components/CounsellorDashboard';
import PsychoeducationalHub from './components/PsychoeducationalHub';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/register-user" element={<SignupPage />} />
      <Route path="/register-counsellor" element={<SignupPage />} />

      {/* Protected User Routes */}
      <Route
        path="/mainpage"
        element={
          <ProtectedRoute requiredUserType="user">
            <MainPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute requiredUserType="user">
            <DailyCheckIn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute requiredUserType="user">
            <BookCounselor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resources"
        element={
          <ProtectedRoute requiredUserType="user">
            <PsychoeducationalHub />
          </ProtectedRoute>
        }
      />

      {/* Protected Counsellor Routes */}
      <Route
        path="/counsellor"
        element={
          <ProtectedRoute requiredUserType="counsellor">
            <CounsellorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;