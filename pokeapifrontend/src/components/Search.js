import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react';

export default function Search({setSelectedTypeArray, typeSelectedArray, setPageNo}) {

    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function fetchTypes() {
            const response = await axios.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json');
            setTypes(response.data.map(type => type.english));
        }
        fetchTypes();
    }, []);


    function handleClick(e) {
        const {value, checked} = e.target;
        if (checked) {
            setPageNo(1);
            setSelectedTypeArray(typeSelectedArray => [...typeSelectedArray, value]);
        }
        else {
            setSelectedTypeArray(typeSelectedArray => typeSelectedArray.filter(type => type !== value));
        }   
    }

  return (
    <div className="searchContainer">
       {
         types.map(type => <div key={type}>
            <input 
            type="checkbox" 
            value={type} 
            id={type}

            onChange={handleClick} 
            />
            <label htmlFor={type}>{type}</label>
            </div>)
       }
    </div>
  )
}