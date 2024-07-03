import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import movieimg from '../assets/movie.jpg';
import ReactStars from 'react-rating-stars-component';
import { fetchMovies, setMovies, rateMovie, reviewMovie, toggleWatched } from '../redux/movieSlice';
import { FaRegHeart, FaHeart } from "react-icons/fa";

const MovieDetail = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies.movies);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  useEffect(() => {
    if (movies.length === 0) {
      axios.get('http://localhost:5000/movies')
        .then(response => {
          dispatch(setMovies(response.data));
        })
        .catch(error => {
          console.error('Error fetching movies:', error);
        });
    }
  }, [dispatch, movies]);

  const movie = movies.find(item => item.id === movieId);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    axios.patch(`http://localhost:5000/movies/${movieId}`, { rating: newRating })
      .then(() => {
        dispatch(rateMovie({ id: movieId, rating: newRating }));
      })
      .catch(error => {
        console.error('Error updating rating:', error);
      });
  };

  const handleReviewChange = (e) => {
    setReview(e.target.value);
  };

  const handleReview = () => {
    axios.patch(`http://localhost:5000/movies/${movieId}`, { review })
      .then(response => {
        const updatedReview = response.data.review;
        dispatch(reviewMovie({ id: movieId, review: updatedReview }));
        setReview(''); // Clear the review input field
      })
      .catch(error => {
        console.error('Error updating review:', error);
      });
  };

  const handleToggleWatched = () => {
    const newWatchedStatus = !movie.watched;
    axios.patch(`http://localhost:5000/movies/${movieId}`, { watched: newWatchedStatus })
      .then(() => {
        dispatch(toggleWatched({ id: movieId, watched: newWatchedStatus }));
      })
      .catch(error => {
        console.error('Error updating watched status:', error);
      });
  };

  if (!movie) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-movie-detail">
      <img src={movieimg} alt="movieimg1" className='movieimg1' />
      <div>
        <h2>{movie.title}</h2>
        <p><strong>Description:</strong> {movie.description}</p>
        <p><strong>Release Year:</strong> {movie.releaseYear}</p>
        <p><strong>Genre:</strong> {movie.genre}</p>
        <div>
          <label>Rating:</label>
          <ReactStars
            count={5}
            onChange={handleRatingChange}
            size={24}
            activeColor="#ffd700"
          />
        </div>  <p>
          <strong>Watched Already:</strong> 
          <button onClick={handleToggleWatched} className='toggle-btn'>
            {movie.watched ? <FaHeart size={20} color="red" /> : <FaRegHeart size={20} />}
          </button>
        </p>
        <p><strong>Reviews:</strong> {movie?.review}</p>
      
        <div className='dc'>
          <textarea
            placeholder='Write a review'
            value={review}
            onChange={handleReviewChange}
            className='review-textarea'
          />
          <button onClick={handleReview} className='review-btn'>Submit Review</button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
