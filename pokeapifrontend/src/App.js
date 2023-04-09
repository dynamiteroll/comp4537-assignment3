import Search from "./components/Search";
import FilterPokemons from "./components/FilterPokemons";
import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {

  const [pageNo, setPageNo] = useState(1);
  const [typeSelectedArray, setSelectedTypeArray] = useState([]);

    
  return (
    <div className="App">
      <nav className="navbar">
        <h1>DateDex.com</h1>
        
      </nav>
      <Search setSelectedTypeArray={setSelectedTypeArray} typeSelectedArray={typeSelectedArray} setPageNo={setPageNo}
      />
      <FilterPokemons typeSelectedArray={typeSelectedArray} setPageNo={setPageNo} pageNo={pageNo}/>
      
    </div>
  );
}

export default App;
