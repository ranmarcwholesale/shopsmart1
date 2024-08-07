import React from 'react'
import "./Login.css"
import logo from './Components/images/Logo.png'; 
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className='login'>
       <Link to='/'>
        <img className="login__logo"src={logo} alt='logo'></img>
       </Link>

       <div className='login__container'>
        <h1>Sign-in</h1>

        <form>
            <h5>E-mail</h5>
            <input type='text' />


            <h5>Password</h5>
            <input type='password' />

            <button className='login__signInButton'>Sign In</button>
        </form>

        <p>
            By signing-in you agree to the SHOPSMART
            Conditions of Use & Sale.Please 
            see our Privacy Notice, our Cookies Notice
            and our Interest-Based Ads Notice.
        </p>

        <button className='login__registerButton'>Create your ShopSmart Account</button>
       </div>
    </div>
  )
}

export default Login