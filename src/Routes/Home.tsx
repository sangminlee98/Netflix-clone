import { AnimatePresence, motion, useViewportScroll } from 'framer-motion';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useMatch, useNavigate } from 'react-router-dom';
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
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${props => props.theme.black.lighter};
  text-align: center;
  position: absolute;
  width: 100%;
  bottom: 0;
  opacity: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  opacity: 0;
`;
const BigMovie = styled(motion.div)<{scrollY: number}>`
  position: absolute;
  width: 40vw;
  height: 80vh;
  background-color: ${props => props.theme.black.lighter};
  top: ${props => props.scrollY + 100}px;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const BigCover = styled.div<{bgpath: string}>`
  width: 100%;
  height: 50%;
  background-image: linear-gradient(rgba(0,0,0,0), rgba(0,0,0,1)), url(${props => props.bgpath});
  background-position: center center;
  background-size: cover;
`;
const BigTitle = styled.h2`
  position: relative;
  font-size: 36px;
  padding: 20px;
  top: -80px;
`;
const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
`;

const RowVariants = {
  hidden: {
    x: window.outerWidth + 10
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 10,
  },
};

const BoxVariants = {
  normal: {
    scale: 1
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: .5,
      duration: .3,
    }
  }
}

const InfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: .5,
      duration: .3,
    },
  }
}

const Home = () => {
  const offset = 6;
  const bigMovieMatch = useMatch('movies/:movieId');
  console.log(bigMovieMatch);
  const navigate = useNavigate();
  const {scrollY} = useViewportScroll();
  const {data, isLoading} = useQuery<INowPlaying>(['movies','nowPlaying'], getMovies);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const onlyBackdropPath = (movies: INowPlaying) => {
    const copy = {...movies};
    copy.results.map((movie, index) => {
      if(movie.backdrop_path === null) {
        return copy.results.splice(index, 1);
      }
    });
    return copy;
  }
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
  const onBoxClick = (movieId: number) => {
    navigate(`movies/${movieId}`);
  }
  const onBigMovieClick = () => {
    navigate('/');
  }
  const clickedMovie = bigMovieMatch && data?.results.find(movie => movie.id === parseInt(bigMovieMatch.params.movieId!));
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
              <Row variants={RowVariants} initial='hidden' animate='visible' exit='exit' transition={{type:'tween', duration: .8}} key={index}>
                {
                  data && {...onlyBackdropPath(data)}.results.slice(1).slice(offset*index, offset*index+offset).map(movie => 
                    <Box
                      layoutId={movie.id+""}
                      variants={BoxVariants}
                      initial='normal'
                      whileHover='hover'
                      transition={{type:'tween'}}
                      bgpath={makeImagePath(movie.backdrop_path || '', 'w500')}
                      onClick={() => onBoxClick(movie.id)}
                      key={movie.id}>
                        <Info variants={InfoVariants}>
                          <h4>{movie.title}</h4>
                        </Info>
                    </Box>)
                }
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {
              bigMovieMatch ? (
                <>
                  <Overlay animate={{opacity: 1}} exit={{opacity: 0}} onClick={onBigMovieClick}/>
                  <BigMovie
                    layoutId={bigMovieMatch.params.movieId}
                    scrollY={scrollY.get()}
                  >
                    <BigCover bgpath={makeImagePath(clickedMovie?.backdrop_path || '')}/>
                    <BigTitle>{clickedMovie?.title}</BigTitle>
                    <BigOverView>{clickedMovie?.overview}</BigOverView>
                  </BigMovie>
                </>
              ) : null
            }
          </AnimatePresence>
          
        </>
      )}
    </Wrapper>
  );
};

export default Home;