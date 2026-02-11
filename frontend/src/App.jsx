import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Attendance from './components/Attendance';

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/attendance" element={<Attendance />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;