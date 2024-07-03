import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import { addMovie, editMovie } from '../redux/movieSlice';

const AddMovieForm = () => {
  const dispatch = useDispatch();
  const [editData, setEditData] = useState({});
  const movies = useSelector(state => state.movies.movies);

  useEffect(() => {
    if (editData.id) {
      // If editData has id, update form with editData values
      setTitle(editData.title || '');
      setDescription(editData.description || '');
      setReleaseYear(editData.releaseYear || '');
      setGenre(editData.genre || '');
    } else {
      // If no editData, reset form fields
      setTitle('');
      setDescription('');
      setReleaseYear('');
      setGenre('');
    }
  }, [editData]);

  const handleSubmit = e => {
    e.preventDefault();
    const id = editData.id || uuidv4(); // Generate unique ID if adding new movie
    dispatch(editData.id ? editMovie({ id, ...editData }) : addMovie({
      id,
      title,
      description,
      releaseYear,
      genre,
      watched: false,
      rating: 0,
      review: ''
    }));
    setEditData({}); // Clear edit data
  };

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [releaseYear, setReleaseYear] = useState('');
  const [genre, setGenre] = useState('');
console.log(movies)
  return (
    <div className='container'>
      <form onSubmit={handleSubmit} className='form-data'>
        <div className='title'>{editData.id ? 'Update Movie' : 'Add Movie'}</div>
        <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <input type="number" placeholder="Release Year" value={releaseYear} onChange={e => setReleaseYear(e.target.value)} />
        <input type="text" placeholder="Genre" value={genre} onChange={e => setGenre(e.target.value)} />
        <button type="submit" className='submit-btn'>{editData.id ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};

export default AddMovieForm;