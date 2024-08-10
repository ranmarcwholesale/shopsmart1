import React, { useState } from 'react';
import './Register.css';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !phone || !address) {
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
          address
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
    <div className="login">
      <div className="login__container">
        <h1>Create Your ShopSmart Account</h1>
        <form>
          <h5>Email</h5>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <h5>Password</h5>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <h5>Phone</h5>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />

          <h5>Address</h5>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />

          <button type="button" className="login__registerButton" onClick={handleRegister}>
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
