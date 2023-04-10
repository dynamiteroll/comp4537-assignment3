import React, { useEffect } from 'react'
import '../styles/Pagination.css';

export default function Pagination({pokemons, setPageNo, pageNo}) {

    const pageSize = 10;
    const pageCount = Math.ceil(pokemons.length / pageSize);

    const maxPageButton = 10;

    const currentPages = []
    for (let i = 1; i <= pageCount; i++) {
      currentPages.push(i)
    }

    const handlePrev = () => {
        setPageNo(pageNo - 1);

    }

    const handleNext = () => {
        setPageNo(pageNo + 1);
    }


  return (

    <div className='pagination'>
        {(pageNo === 1) ? null : <button className='prev' onClick={handlePrev}>prev</button>}
        {         
          Array.from({length: pageCount}, (_, index) => index + 1 )
          .map((page, index) =>(
              (pageNo <= 5 && index + 1 <= maxPageButton) || (index < pageNo + 5 && index > pageNo - 6) || (pageCount - pageNo <= 5 && index >= pageCount - 10) || (pageNo >= 76 && index >= 72 && index <= 81) ?
              <button className={(index === pageNo - 1) ? 'active' : ''} key={index} onClick={() => setPageNo(index + 1)}>{index + 1}</button> : null
          ))  

        }
        {(pageNo === pageCount) ? null : <button className='next' onClick={handleNext}>next</button>}
    </div>

  )
}
