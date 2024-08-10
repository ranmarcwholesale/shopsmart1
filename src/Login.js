import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // For alerts
import logo from './Components/images/Logo.png'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post('http://localhost:5000/api/login', { email, password });

      if (response.data.token) {
        // Set token to local storage or context
        localStorage.setItem('token', response.data.token);

        Swal.fire({
          icon: 'success',
          title: 'Logged In',
          text: 'You have successfully logged in.',
        }).then(() => {
          navigate('/');
        });
        
        // Display response message on screen
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response?.data?.msg || 'An error occurred. Please check your credentials and try again.',
      });

    }
  };

  return (
    <div className='login'>
      <img
        onClick={() => navigate('/')}
        src={logo}
        alt='ShopSmart Logo'
        className='login__logo'
      />
      <div className='login__container'>
        <h1>Sign-in</h1>

        <form onSubmit={handleLogin}>
          <h5>E-mail</h5>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Enter your email'
            required
          />

          <h5>Password</h5>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Enter your password'
            required
          />

          <button type='submit' className='login__signInButton'>
            Sign In
          </button>
        </form>

        <p>
          By signing in you agree to the SHOPSMART Conditions of Use & Sale. Please
          see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
        </p>

        <button
          onClick={() => navigate('/Register')}
          className='login__registerButton'
        >
          Create your ShopSmart Account
        </button>

      </div>
    </div>
  );
}

export default Login;
