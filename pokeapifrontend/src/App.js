import Search from "./components/Search";
import FilterPokemons from "./components/FilterPokemons";
import { useState } from "react";

function App() {

  
  const [typeSelectedArray, setSelectedTypeArray] = useState([]);
  return (
    <div className="App">
      {/* <div>react</div> */}
      <Search 
      setSelectedTypeArray={setSelectedTypeArray}
      typeSelectedArray={typeSelectedArray}
      />
      <FilterPokemons 
      typeSelectedArray={typeSelectedArray}
      />
    </div>
  );
}

export default App;
