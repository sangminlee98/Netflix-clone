import React from 'react';
import { useLocation } from 'react-router-dom';

const Search = () => {
  const location = useLocation();
  const url = new URLSearchParams(location.search);
  console.log(url.get('keyword'));
  return (
    <div>
      
    </div>
  );
};

export default Search;