import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, INowPlaying } from '../api';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
  margin-top: 80px;
  height: 200vh;
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{bgpath: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgpath});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled(motion.div)`
  position: relative;
  top: -100px;
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 5px;
  width: 100%;
`;
const Box = styled(motion.div)<{bgpath: string}>`
  height: 200px;
  background-image: url(${props => props.bgpath});
  background-size: cover;
  background-position: center center;
  color: black;
`;

const rowVariants = {
  hidden: {
    x: window.outerWidth + 10
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10
  },
};

const Home = () => {
  const offset = 6;
  const {data, isLoading} = useQuery<INowPlaying>(['movies','nowPlaying'], getMovies);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if(data){
      if(leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length-1;
      const maxIndex = Math.floor(totalMovies/offset)-1;
      setIndex(prev => prev===maxIndex ? 0 : prev+1);
    }
  };
  const toggleLeaving = () => setLeaving(prev => !prev);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader> 
      ) : (
        <>
          <Banner onClick={increaseIndex} bgpath={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row variants={rowVariants} initial='hidden' animate='visible' exit='exit' transition={{type:'tween', duration: .8}} key={index}>
                {
                  data?.results.slice(1).slice(offset*index, offset*index+offset).map(movie => <Box bgpath={makeImagePath(movie.backdrop_path, 'w500')} key={movie.id}>{movie.title}</Box>)
                }
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
};

export default Home;