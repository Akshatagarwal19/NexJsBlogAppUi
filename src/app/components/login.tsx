"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

const Login = () => {
  const router = useRouter(); // Initialize useRouter
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      // Store the token in local storage
      localStorage.setItem("token", response.data.token); // Save the token received from backend

      setSuccess("Login successful!");
      setError('');

      // Redirect to posts page after successful login
      router.push('/posts'); // Assuming your posts page is at this path

    } catch (error) {
      console.error('Login error:', error);

      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data.error || 'Login failed.');
      } else {
        setError('Login failed. Please try again.');
      }

      setSuccess('');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow">
        <h2 className="text-center mb-4">Login</h2>
        {error && <p className="text-danger text-center">{error}</p>} {/* Display error message */}
        {success && <p className="text-success text-center">{success}</p>} {/* Display success message */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default Login;
