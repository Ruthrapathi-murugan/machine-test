// Register.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '', 
  });
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false); 
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (values.password !== values.confirmPassword) {
      setPasswordMismatch(true);
      return;
    }

    setPasswordMismatch(false);

    try {
      await axios.post(`${import.meta.env.VITE_BE_URL}/api/auth/register`, {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      // Set success message and redirect to login page
      setRegistrationSuccess(true);
      setTimeout(() => {
        navigate('/login'); // Redirect to login after 2 seconds
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 border rounded w-25">
        <h2>Register</h2>
        {error && <p className="text-danger">{error}</p>}
        {registrationSuccess ? (
          <p className="text-success">Registration successful! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter Name"
                onChange={handleChange}
                value={values.name}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter Email"
                onChange={handleChange}
                value={values.email}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                name="password"
                placeholder="Enter Password"
                onChange={handleChange}
                value={values.password}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm Password"
                onChange={handleChange}
                value={values.confirmPassword}
                required
              />
              {passwordMismatch && (
                <p className="text-danger mt-1">Passwords do not match!</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Register;
