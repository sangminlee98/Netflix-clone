import React from 'react';
import { useQuery } from 'react-query';
import { getMovies } from '../api';

const Home = () => {
  const {data, isLoading} = useQuery(['movies','now_playing'], getMovies);
  console.log(data, isLoading);
  return (
    <div style={{height: '200vh'}}>
      
    </div>
  );
};

export default Home;