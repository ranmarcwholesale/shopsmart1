// src/Header.js
import React from 'react';
import './Header.css';
import logo from './Components/images/Logo.png'; 
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Link } from 'react-router-dom';

function Header({ basketCount }) {
  return (
    <div className='header'>
      <div className="header__Menu">
        <MenuIcon />
      </div>
      <Link to='/'>
      <img className="header__logo" src={logo} alt="Logo" />
      </Link>
      <div className="header__search">
        <input className="header__searchInput" type="text" />
        <div className="header__searchIcon">
          <SearchIcon />
        </div>
      </div>
      <div className='header__nav'>
        <div className='header__option'>
          <span className='header__optionlineOne'>Hello Guest</span>
          <span className='header__optionlineTwo'>Sign In</span>
        </div>
        <div className='header__option'>
          <span className='header__optionlineOne'>Your</span>
          <span className='header__optionlineTwo'>Orders</span>
        </div>
        <div className='header__cart'>
        <Link to="/checkout">
          <ShoppingBasketIcon />
          </Link>
          <span className='header__optionlineTwo header__basketCount'>{basketCount}</span>
        </div>
      </div>
    </div>
  );
}

export default Header;