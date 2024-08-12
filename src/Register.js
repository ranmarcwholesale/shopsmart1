import React, { useState } from 'react';
import './Register.css';
import logo from './Components/images/Logo.png'; 
import { Link } from 'react-router-dom';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [name, setName] = useState(''); // Add this line
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !phone || !address || !name) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          phone,
          address,
          name // Add this line
        }),
      });

      setLoading(false);

      if (response.ok) {
        const data = await response.json();
        alert(data.msg); // Show success message
        // Optionally redirect or clear form fields
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="register">
         <div className='login__logo'>
        <Link to='/'>
        <img className="header__logo" src={logo} alt="Logo" />
      </Link>
      </div>
      <div className="register__container">
        <h1>Create Your ShopSmart Account</h1>
        <form>
          <h5>Name</h5>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <h5>Email</h5>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h5>Password</h5>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <h5>Phone</h5>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <h5>Address</h5>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

          <button type="button" className="register__button" onClick={handleRegister}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Back to Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
