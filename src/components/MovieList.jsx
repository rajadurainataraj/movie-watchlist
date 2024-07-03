import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, editMovie, deleteMovie } from '../redux/movieSlice';
import { Link } from 'react-router-dom';
import movieimg from '../assets/movie.jpg';
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import AddMovieForm from './AddMovieForm';

const MovieList = () => {
  const dispatch = useDispatch();
  const movies = useSelector(state => state.movies.movies);
  const status = useSelector(state => state.movies.status);
  const [editMode, setEditMode] = useState(null);
  const [editedMovie, setEditedMovie] = useState({ title: '', description: '', releaseYear: '', genre: '' });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchMovies());
    }
  }, [dispatch, status]);

  const handleEditClick = (movie, event) => {
    event.preventDefault();
    event.stopPropagation();
    setEditMode(movie.id);
    setEditedMovie({
      title: movie.title,
      description: movie.description,
      releaseYear: movie.releaseYear,
      genre: movie.genre,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = (id, event) => {
    event.preventDefault();
    dispatch(editMovie({ id, ...editedMovie }));
    setEditMode(null);
  };

  const handleDeleteClick = (id, event) => {
    event.preventDefault();
    const confirmDelete = window.confirm('Are you sure you want to delete this movie?');
    if (confirmDelete) {
      dispatch(deleteMovie(id));
    }
  };

  const handleEditCancel = (event) => {
    event.preventDefault();
    setEditMode(null);
  };

  return (
    <>
      <AddMovieForm />
      <div className='container2'>
        <h2 className='title-list'>Movie List</h2>
        {status === 'loading' && <p>Loading movies...</p>}
        {status === 'failed' && <p>Error fetching movies</p>}
        <ul>
          {movies.map(movie => (
            <li key={movie.id} className='card-container'>
              <div className='card'>
                <Link to={`/movies/${movie.id}`} className='card-link'>
                  <img src={movieimg} alt="movie-img" className='mvimg' />
                </Link>
                <div onClick={(e) => e.stopPropagation()}>
                  {editMode === movie.id ? (
                    <form onSubmit={(event) => handleEditSubmit(movie.id, event)}>
                      <input
                        type="text"
                        name="title"
                        value={editedMovie.title}
                        onChange={handleEditChange}
                        className='input-card'
                      />
                      <textarea
                        name="description"
                        value={editedMovie.description}
                        onChange={handleEditChange}
                          className='input-card'
                      />
                      <input
                        type="text"
                        name="releaseYear"
                        value={editedMovie.releaseYear}
                        onChange={handleEditChange}
                          className='input-card'
                      />
                      <input
                        type="text"
                        name="genre"
                        value={editedMovie.genre}
                        onChange={handleEditChange}
                          className='input-card'
                      />
                      <div className='edit-btns'>
                        <button type="submit" className='btn-edit-save'>Save</button>
                        <button type="button" className='btn-edit-cancel' onClick={handleEditCancel}>Cancel</button>
                      </div>
                    </form>
                  ) : (
                    <Link to={`/movies/${movie.id}`} className='card-link'>
                      <h3>{movie.title}</h3>
                      <p><strong>Description:</strong> {movie.description}</p>
                      <p><strong>Release Year:</strong> {movie.releaseYear}</p>
                      <p><strong>Genre:</strong> {movie.genre}</p>
                    </Link>
                  )}
                  {!editMode && (
                    <div className='flx'>
                      <button className='edit' onClick={(e) => { handleDeleteClick(movie.id, e); e.stopPropagation(); }}>
                        <MdDelete size={20} color="red" />
                      </button>
                      <button  className='delete' onClick={(e) => { handleEditClick(movie, e); e.stopPropagation(); }}>
                        <MdEditSquare size={20} color="light-orange" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default MovieList;
