import Search from "./components/Search";
import FilterPokemons from "./components/FilterPokemons";
import { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from "./components/Pagination";

function App() {
  
  // const [pokemon, setPokemon] = useState([]);
  // const [pageNo, setPageNo] = useState(1);
  const [typeSelectedArray, setSelectedTypeArray] = useState([]);

  const [pokemons, setPokemons] = useState([])
    const [pageNo, setPageNo] = useState(1);

    useEffect(() => {
        async function fetchPokemons() {
            const response = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
        setPokemons(response.data)
        }
        fetchPokemons()

    }, [])

    const pokemonUserPage = 10;
    const startIndex = (pageNo - 1) * pokemonUserPage;
    const endIndex = startIndex + pokemonUserPage;
    const sortedPokemons = pokemons
    .filter((pokemon) =>
    typeSelectedArray.length > 0
    ? typeSelectedArray.every((type) => pokemon.type.includes(type))
    : true
    )
    const pokemonPage = sortedPokemons.slice(startIndex, endIndex);

    function handleNoPokemons() {
      if (pokemonPage.length === 0) {
        return <h1>No Pokemons</h1>
      } else {
        return (
          <>
            <FilterPokemons typeSelectedArray={typeSelectedArray} pokemonPage={pokemonPage}/>
            <Pagination pokemonUserPage={pokemons} pokemons={sortedPokemons} setPageNo={setPageNo} pageNo={pageNo}/>
          </>
        )
      }
        

    }
    
  return (
    <div className="App">
      {/* <div>react</div> */}
      <Search 
      setSelectedTypeArray={setSelectedTypeArray}
      typeSelectedArray={typeSelectedArray}
      setPageNo={setPageNo}
      />
      {handleNoPokemons()}
      
    </div>
  );
}

export default App;
