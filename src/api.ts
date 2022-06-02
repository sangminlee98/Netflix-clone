import axios from 'axios';

const BASE_PATH='http://api.themoviedb.org';

export const getMovies = async() => {
  const response = await axios.get<INowPlaying>(`${BASE_PATH}/3/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&page=1&region=kr`);
  return response.data;
}

export interface INowPlaying {
  dates:         Dates;
  page:          number;
  results:       Result[];
  total_pages:   number;
  total_results: number;
}

export interface Dates {
  maximum: Date;
  minimum: Date;
}

export interface Result {
  adult:             boolean;
  backdrop_path:     string;
  genre_ids:         number[];
  id:                number;
  original_language: string;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string;
  release_date:      Date;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
}
