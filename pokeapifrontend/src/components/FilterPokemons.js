import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'


function FilterPokemons({typeSelectedArray}) {

    
    // const [typeSelectedArray, setTypeSelectedArray] = useState([])
    const [pokemons, setPokemons] = useState([])

    useEffect(() => {
        async function fetchPokemons() {
            const response = await axios.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json")
        setPokemons(response.data)
        }
        fetchPokemons()

    }, [])


  return (
    <div>
        {
            pokemons.map(pokemon => {
                if (typeSelectedArray.every(type => pokemon.type.includes(type))) {
                    return (
                        <div key={pokemon.id}>
                        {pokemon.name.english}
                            <ul>
                                {pokemon.type.map(type => <li key={type}>{type}</li>)}
                            </ul>
                        </div>
                    )
                }
            })
        }
    </div>
  )
}

export default FilterPokemons
