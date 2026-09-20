import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import LoginPage from './components/LoginPage/LoginPage';
import './App.css';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<LandingPage />} />
            <Route path="/app/register" element={<RegisterPage />} />
            <Route path="/app/login" element={<LoginPage />} />
        </Routes>
    );
}

export default App;