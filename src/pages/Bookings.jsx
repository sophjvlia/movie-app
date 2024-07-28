import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import '../styles/Movies.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`https://booking-system-api-sophjvlias-projects.vercel.app/bookings/3`);
        setBookings(response.data);
      } catch (error) {
        setError('Error fetching movies');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1 className="text-center text-white fw-bold my-3">My Bookings</h1>
      {bookings && bookings.bookings.map(booking => (
        <div className="bg-white">
          <div>
            <img height="200" src={booking.thumbnail_url} alt="An image of the movie poster" />
          </div>
          <div>
            <p>{booking.title}</p>
            <p>{booking.date}</p>
            <p>{booking.start_time} - {booking.end_time}</p>
            <p>{booking.seat_number}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookings;
