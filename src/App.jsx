import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import EmployeeList from './components/EmployeeList';
import NavigationBar from './components/NavigationBar';
import Register from './components/Register';
import CreateEmployee from './components/CreateEmployee';
import EditEmployee from './components/EditEmployee';
import Dashboard from './components/Dashboard';
import './app.css';



function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Optionally, you can validate the token on the server here by making an API call
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []); // [] ensures the check runs once, on mount

  return (
    <Router>
      {isAuthenticated && <NavigationBar />} {/* Show navigation bar only if authenticated */}

      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />

        {/* Redirect to dashboard if authenticated, otherwise redirect to login */}
        {/* <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} /> */}

        {/* Protected routes */}
        <Route path="/home" element={isAuthenticated ? <Home /> : <Navigate to="/home" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/employee-list" element={isAuthenticated ? <EmployeeList /> : <Navigate to="/login" />} />
        <Route path="/create-employee" element={isAuthenticated ? <CreateEmployee /> : <Navigate to="/login" />} />
        <Route path="/edit-employee/:id" element={isAuthenticated ? <EditEmployee /> : <Navigate to="/login" />} />

        {/* Redirect all other paths to login if not authenticated */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
