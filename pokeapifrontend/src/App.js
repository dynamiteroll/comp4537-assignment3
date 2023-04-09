import Search from "./components/Search";
import FilterPokemons from "./components/FilterPokemons";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { useState, useEffect } from 'react'
import Login from "./components/Login";
// import PrivateRoutes from "./components/PrivateRoutes";
import HomePage from "./components/HomePage";
function App() {



    
  return (
    <div className="App">
      <nav className="navbar">
        <h1>Dated Dex.com</h1>
      </nav>
      {/* <Router>
        <Routes> */}
          {/* <Route path="/" element={<HomePage/>} />
          <Route path="/login" element={<Login/>}/> */}
          {/* <Route element={<PrivateRoutes/>}>
                <Route path="/pokedex" element={
                <>
                  <Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}/>
                  <FilterPokemons typeSelectedArray={typeSelectedArray} setPageNo={setPageNo} pageNo={pageNo}/>
                </>
              }/>
          </Route> */}
          {/* <Route path="/pokedex" element={
          <>
            <Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}/>
            <FilterPokemons typeSelectedArray={typeSelectedArray} setPageNo={setPageNo} pageNo={pageNo}/>
          </>
          }/> */}
        {/* </Routes>
      </Router> */}
      <Login></Login>

      
    </div>
  );
}

export default App;
