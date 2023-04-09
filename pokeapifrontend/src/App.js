import Search from "./components/Search";
import FilterPokemons from "./components/FilterPokemons";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useState, useEffect } from 'react'
import Login from "./components/Login";
// import PrivateRoutes from "./components/PrivateRoutes";
import HomePage from "./components/HomePage";
function App() {

  const [pageNo, setPageNo] = useState(1);
  const [typeSelectedArray, setSelectedTypeArray] = useState([]);

    
  return (
    <div className="App">
      <nav className="navbar">
        <h1>DateDex.com</h1>
      </nav>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>}/>
          {/* <Route element={<PrivateRoutes/>}>
            <Route path="/pokedex" element={<Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}/>}/>
            <Route path="/pokedex/:pageNo" element={<Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}/>}/>
          </Route> */}
          <Route path="/pokedex" element={
          <>
            <Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}/>
            <FilterPokemons typeSelectedArray={typeSelectedArray} setPageNo={setPageNo} pageNo={pageNo}/>
          </>
        }/>
        </Routes>
      </Router>

      
    </div>
  );
}

export default App;
