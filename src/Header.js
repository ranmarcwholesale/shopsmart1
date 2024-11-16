import React from 'react';
import './Header.css'; 
import logo from './Components/images/Logo.png'; 
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { Link } from 'react-router-dom';

function Header({ basketCount, onMenuClick }) {
  return (
    <div className='header'>
      <div className="header__menu" onClick={onMenuClick}>
        <MenuIcon />
      </div>
      <Link to='/'>
        <img className="header__logo" src="https://res.cloudinary.com/dm2dii2gk/image/upload/v1731689461/Logo_ibmoks.png" alt="Logo" />
      </Link>
      <div className="header__search">
        <input className="header__searchInput" type="text" placeholder="Search..." />
        <SearchIcon className="header__searchIcon" />
      </div>
      <div className='header__cart'>
        <Link to="/checkout">
          <ShoppingBasketIcon />
          {basketCount > 0 && (
            <span className='header__basketCount'>{basketCount}</span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Header;
