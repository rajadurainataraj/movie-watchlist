import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MovieList from './components/MovieList';
import MovieDetail from './components/MovieDetail';


const App = () => {
  return (
    <Router>
      <Routes>

        <Route exact path="/movies" element={<MovieList/>} />
        <Route path="/movies/:movieId" element={<MovieDetail/>} />
      </Routes>
    </Router>
  );
};

export default App;
