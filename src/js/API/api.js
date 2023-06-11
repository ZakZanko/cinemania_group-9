import axios from 'axios';
import { KEY, BASE_URL } from './api-key';

export const getSecondMovieById = async id => {
  try {
    const { data } = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}`
    );
    const result = {
      ...data,
    };
    return result;
  } catch (error) {
    console.error('Smth wrong with api ID fetch' + error);
  }
};
