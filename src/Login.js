import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // For alerts
import logo from './Components/images/Logo.png'; 
import { Link } from 'react-router-dom';


function Login({ setUser }) { // Add setUser prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userName', response.data.customer.name); // Save name in local storage
      setUser(response.data.customer); // Set user state
      Swal.fire({
        icon: 'success',
        title: 'Logged In',
        text: 'You have successfully logged in.',
      }).then(() => {
        navigate('/');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: err.response.data.msg || 'An error occurred.',
      });
    }
  };

  return (
    <div className='login'>
        <div className='login__logo'>
        <Link to='/'>
        <img className="header__logo" src={logo} alt="Logo" />
      </Link>
      </div>
      <div className='login__container'>
        <h1>Sign-in</h1>

        <form onSubmit={handleLogin}>
          <h5>E-mail</h5>
          <input
            type='text'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h5>Password</h5>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type='submit' className='login__signInButton'>Sign In</button>
        </form>

        <p>
          By signing-in you agree to the SHOPSMART Conditions of Use & Sale. Please
          see our Privacy Notice, our Cookies Notice and our Interest-Based Ads Notice.
        </p>

        <button
          onClick={() => navigate('/register')}
          className='login__registerButton'
        >
          Create your ShopSmart Account
        </button>
      </div>
    </div>
  );
}

export default Login;
