import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/movies';

export const fetchMovies = createAsyncThunk('movies/fetchMovies', async () => {
  const response = await axios.get(API_URL);
  return response.data;
});

export const addMovie = createAsyncThunk('movies/addMovie', async (movieData) => {
  const response = await axios.post(API_URL, movieData);
  return response.data;
});

export const editMovie = createAsyncThunk('movies/editMovie', async (movieData) => {
  const { id, ...rest } = movieData;
  const response = await axios.put(`${API_URL}/${id}`, rest);
  return response.data;
});

export const deleteMovie = createAsyncThunk('movies/deleteMovie', async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
});

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    editData: {},
    status: 'idle',
    error: null,
  },
  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
    toggleWatched: (state, action) => {
      const { id, watched } = action.payload;
      const existingMovie = state.movies.find(movie => movie.id === id);
      if (existingMovie) {
        existingMovie.watched = watched;
      }
    },
    rateMovie: (state, action) => {
      const { id, rating } = action.payload;
      const existingMovie = state.movies.find(movie => movie.id === id);
      if (existingMovie) {
        existingMovie.rating = rating;
      }
    },
    reviewMovie: (state, action) => {
      const { id, review } = action.payload;
      const existingMovie = state.movies.find(movie => movie.id === id);
      if (existingMovie) {
        existingMovie.review = review;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addMovie.fulfilled, (state, action) => {
        state.movies.push(action.payload);
      })
      .addCase(editMovie.fulfilled, (state, action) => {
        const { id, ...rest } = action.payload;
        const existingMovieIndex = state.movies.findIndex(movie => movie.id === id);
        if (existingMovieIndex !== -1) {
          state.movies[existingMovieIndex] = { id, ...rest };
        }
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter(movie => movie.id !== action.payload);
      });
  },
});

export const { setMovies, toggleWatched, rateMovie, reviewMovie } = movieSlice.actions;

export const selectMovies = state => state.movies.movies;
export const selectEditData = state => state.movies.editData;

export default movieSlice.reducer;
