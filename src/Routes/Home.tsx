import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { getMovies, INowPlaying } from '../api';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
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
const Banner = styled.div<{bgPath: string}>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgPath});
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
  grid-gap: 10px;
  width: 100%;
`;
const Box = styled(motion.div)`
  height: 200px;
  background-color: white;
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
  const [index, setIndex] = useState(0);
  const increaseIndex = () => setIndex(prev => prev+1);
  const {data, isLoading} = useQuery<INowPlaying>(['movies','nowPlaying'], getMovies);
  console.log(data, isLoading);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader> 
      ) : (
        <>
          <Banner onClick={increaseIndex} bgPath={makeImagePath(data?.results[0].backdrop_path || '')}>
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence>
              <Row variants={rowVariants} initial='hidden' animate='visible' exit='exit' transition={{type:'tween', duration: .8}} key={index}>
                {
                  [1,2,3,4,5,6].map(i => <Box key={i}>{i}</Box>)
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