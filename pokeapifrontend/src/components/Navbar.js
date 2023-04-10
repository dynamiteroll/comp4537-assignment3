import React, { useState, useEffect } from 'react'
import "../styles/Navbar.css"


const handleLogout = async (e) => {
    localStorage.removeItem('auth-token-access');
    localStorage.removeItem('user');
    window.location.href = "/";
}

function Navbar(props) {
  return (
    <nav className="navbar">
        <h1 className='navTitle'>Dated Dex.com</h1>
        
        {
          (localStorage.getItem('auth-token-access')) && 
          <>
            <div className='username'>
              <h3>Welcome {props.user.username}</h3>
            </div>
            <div className='btncontainer'>
              <button onClick={handleLogout}>Log Out</button>
            </div>
          </>
        }
    </nav>
  )
}

export default Navbar