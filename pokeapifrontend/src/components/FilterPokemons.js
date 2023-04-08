import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Pagination from './Pagination';
import '../styles/FilterPokemons.css';

function FilterPokemons({typeSelectedArray, pokemonPage}) {

    // const [pokemons, setPokemons] = useState([])
    // const [pageNo, setPageNo] = useState(1);

    // useEffect(() => {
    //     async function fetchPokemons() {
    //         const response = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
    //     setPokemons(response.data)
    //     }
    //     fetchPokemons()

    // }, [])

    // const pokemonUserPage = 10;
    //     const startIndex = (pageNo - 1) * pokemonUserPage;
    //     const endIndex = startIndex + pokemonUserPage;
    //     const sortedPokemons = pokemons
    //     .filter((pokemon) =>
    //     typeSelectedArray.length > 0
    //     ? typeSelectedArray.every((type) => pokemon.type.includes(type))
    //     : true
    //     )
    //     const pokemonPage = sortedPokemons.slice(startIndex, endIndex);

    // const paginate = (pageNumber) => setCurrentPage(pageNumber);

    function setNum(num){
        if (num < 10) {
            return `00${num}`;
        } else if (num < 100) {
            return `0${num}`;
        } else {
            return num;
        }
    }

  return (
<>
<div className='pokemonsContainer'>
    {
        pokemonPage.map((pokemon, index) => {
            if (typeSelectedArray.every(type => pokemon.type.includes(type))) {
                return (
                    <div className="pokemon"  key={index}>
                    <img className='image' src={`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${setNum(pokemon.id)}.png`} alt={pokemon.name.english} />
                    <p>{pokemon.name.english}</p>
                    </div>
                )
            }
        })
    }
        
</div>
{/* <Pagination pokemonUserPage={pokemons} pokemons={sortedPokemons} setPageNo={setPageNo} pageNo={pageNo}/> */}
</>
  )
}

export default FilterPokemons
