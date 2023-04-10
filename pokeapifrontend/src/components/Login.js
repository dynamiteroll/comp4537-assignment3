
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Dashboard from './Dashboard';


import Search from "./Search";
import FilterPokemons from "./FilterPokemons";

function Login() {

    const [pageNo, setPageNo] = useState(1);
    const [typeSelectedArray, setSelectedTypeArray] = useState([]);


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');


  useEffect(() => {
    const savedToken = localStorage.getItem('auth-token-access');
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(savedUser);
    }
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", { username, password });
      setUser(res.data);
      setAccessToken(res.headers['auth-token-access']);
      setRefreshToken(res.headers['auth-token-refresh']);
      localStorage.setItem('auth-token-access', res.headers['auth-token-access']);
      localStorage.setItem('user', JSON.stringify(res.data));


    } catch (err) {
      console.log(err);
    }
  }

  return (


    <div>
        {
        (accessToken && user?.role === "admin") && 
            <Dashboard accessToken={accessToken} setAccessToken={setAccessToken} refreshToken={refreshToken} />
        }
        {
            (accessToken && user?.role === "user") && 
            
            <>
                <Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}/>
                <FilterPokemons typeSelectedArray={typeSelectedArray} setPageNo={setPageNo} pageNo={pageNo}/>
            </>
        }
        {
        (!accessToken) && 

        <form onSubmit={handleSubmit}>
            <span> Admin Login </span>
            <br />
            <input
            type="text"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            />
            <br />
            <input
            type="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button type="submit">
            Login
            </button>
        </form>
        }
    </div>
  )
}

export default Login

