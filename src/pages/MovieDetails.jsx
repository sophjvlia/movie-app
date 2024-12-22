import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/Movies.css';
import { jwtDecode } from 'jwt-decode';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserInfo = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        return decodedToken;
      } catch (error) {
        console.error('Token decoding error:', error);
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`https://booking-system-api-git-main-sophjvlias-projects.vercel.app/movies/${id}`);
        setMovie(response.data.movie);
        setAvailableDates(response.data.available_dates);
      } catch (error) {
        setError('Error fetching movies');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);


  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);

    try {
      const response = await axios.get(`https://booking-system-api-sophjvlias-projects.vercel.app/movies/${id}/availability/${selectedDate}`);
      setAvailableTimeslots(response.data);
    } catch (error) {
      setError('Error fetching movies');
    }
  };


  const handleTimeslotClick = async (timeslotId) => {
    const selectedTimeslot = timeslotId
    setSelectedTimeslot(timeslotId);
    
    try {
      const response = await axios.get(`https://booking-system-api-sophjvlias-projects.vercel.app/movies/${id}/${selectedTimeslot}/seats`);
      setAvailableSeats(response.data);
      console.log(availableSeats);
    } catch (error) {
      setError('Error fetching movies');
    }
  };


  const handleSeatClick = (seat) => {
    if (seat.booking_status !== 1) {
      setSelectedSeat(seat.seat_number);
      setSelectedSeatId(seat.seat_id);
    }
  };


  const book = async () => {
    const user = getUserInfo();
    
    try {
      const response = await axios.post('https://booking-system-api-sophjvlias-projects.vercel.app/add-booking', {
        movie_id: movie.movie_id,
        timeslot_id: selectedTimeslot,
        seat_id: selectedSeatId,
        date: selectedDate,
        user_id: user.id,
        email: user.email
      });
      console.log('Booking successful', response.data);
      setMessage("Booking successful!");
      setShowPopup(true);
    } catch (error) {
      console.error('Booking failed', error);
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toDateString();
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <div className="d-flex flex-column align-items-center">
        <h1 className="text-center text-white fw-bold my-4">{movie.title}</h1>
        <div className="d-flex">
          <div className="movie-image">
            <img height="350" src={movie.thumbnail_url} alt={movie.title} />
          </div>
          <div className="movie-description text-white py-1 ps-4">
            <h5 className="fw-bold">Description</h5>
            <p>{movie.description}</p>
          </div>
        </div>
        <div className="d-flex w-100 mt-5">
          <div className="available-dates text-white w-50">
            <h5 className="fw-bold mb-3">Available Dates</h5>
            <select className="w-75 rounded py-2 px-1 bg-white" onChange={handleDateChange}>
              <option value="">Select a date</option>
              {availableDates.map((date, index) => (
                <option key={index} value={date}>{formatDate(date)}</option>
              ))}
            </select>
          </div>
          <div className="available-timeslots text-white w-50">
            <h5 className="fw-bold mb-3">Available Timeslots</h5>
            {availableTimeslots.length === 0 ? (
              <p className="text-white">Select a date to see available timeslots.</p>
            ) : (
              <div className="timeslots-container d-flex justify-content-between">
                {availableTimeslots.map((timeslot) => (
                  <span
                    key={timeslot.timeslot_id}
                    className={`timeslot-box rounded px-2 py-1 text-dark bg-white ${selectedTimeslot === timeslot.timeslot_id ? 'selected' : ''}`}
                    onClick={() => handleTimeslotClick(timeslot.timeslot_id)}
                  >
                    {`${timeslot.start_time}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="seat-selection">
          <h3 className="text-white fw-bold mt-5 mb-4">Select Your Seats</h3>
          {availableSeats.length > 0 && 
            <div>
              <div className="screen bg-dark text-white text-center mb-3 py-2">Screen</div>
              <div className="seats">
                {['A', 'B', 'C'].map((row, rowIndex) => (
                  <div key={rowIndex} className="d-flex justify-content-center mb-2">
                    {[1, 2, 3].map((col, colIndex) => {
                      const seatNumber = `${row}${col}`;
                      const availableSeat = availableSeats.find(s => s.seat_number === seatNumber);
                      return (
                        <button key={colIndex} value={seatNumber} className={`seat mx-1 btn btn-outline-light ${availableSeat.booking_status === 1 ? 'disabled' : 'btn-outline-light'} ${selectedSeat === seatNumber ? 'selected' : ''}`}
                          onClick={() => handleSeatClick(availableSeat)}
                          disabled={availableSeat.booking_status === 1}>
                          {seatNumber}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="mt-3 mb-5 d-flex justify-content-center">
                <button id="book" className="btn btn-primary px-5" onClick={book}>Book Now</button>
              </div>
            </div>
          }
        </div>
      </div>

      {showPopup && (
        <>
          <div className="overlay" onClick={() => setShowPopup(false)}></div>
          <div className="popup">
            <p>{message}</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default MovieDetails;
