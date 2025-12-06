import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './components/LoginPage'
import { Routes, Route } from "react-router-dom";
import MainPage from './components/MainPage';
import DailyCheckIn from './components/DailyCheckIn';
function App() {
  

  return (
    
    <Routes>
       <Route path="/" element={<LoginPage />} />
       <Route path="/mainpage" element={<MainPage />} />
       <Route path="/checkin" element={<DailyCheckIn />} />
    </Routes>
  )
}

export default App
