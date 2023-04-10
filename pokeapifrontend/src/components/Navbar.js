import React from 'react'
import "../styles/Navbar.css"

const handleLogout = async (e) => {
    localStorage.removeItem('auth-token-access');
    localStorage.removeItem('user');
    window.location.href = "/";
}

function Navbar() {
  return (
    <nav className="navbar">
        <h1>Dated Dex.com</h1>
        <div className='btncontainer'>
            <button onClick={handleLogout}>Log Out</button>
        </div>
    </nav>
  )
}

export default Navbar