import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import '../styles/Movies.css';
import { jwtDecode } from 'jwt-decode';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableTimeslots, setAvailableTimeslots] = useState([]);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [movieId, setMovieId] = useState(null);
  const userId = localStorage.getItem('id') !== null ? localStorage.getItem('id') : '';

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`https://booking-system-api-git-main-sophjvlias-projects.vercel.app/bookings/${userId}`);
      setBookings(response.data);
    } catch (error) {
      setError('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const handleDeleteClick = (booking) => {
    setSelectedBooking(booking);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(`https://booking-system-api-git-main-sophjvlias-projects.vercel.app/delete-booking/${selectedBooking.booking_id}`);

      setShowDeleteModal(false);
      fetchBookings();
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEditClick = (booking) => {
    fetchMovieDetails(booking.movie_id);
    setSelectedBooking(booking);
    setShowEditModal(true);
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
  };

  const handleEditConfirm = async () => {
    try {
      const user = getUserInfo();

      try {
        const response = await axios.post(`https://booking-system-api-sophjvlias-projects.vercel.app/edit-booking/${selectedBooking.booking_id}`, {
          movie_id: movieId,
          timeslot_id: selectedTimeslot,
          seat_id: selectedSeatId,
          date: selectedDate,
          user_id: user.id,
          email: user.email
        });
        console.log('Booking successful', response.data);
        setShowEditModal(false);
        setMessage(response.data.message);
        setShowPopup(true);
      } catch (error) {
        console.error('Booking failed', error);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const fetchMovieDetails = async (id) => {
    try {
      const response = await axios.get(`https://booking-system-api-git-main-sophjvlias-projects.vercel.app/movies/${id}`);
      setMovieId(id);
      setAvailableDates(response.data.available_dates);
    } catch (error) {
      setError('Error fetching movies');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = async (event) => {
    const selectedDate = event.target.value;
    setSelectedDate(selectedDate);

    try {
      const response = await axios.get(`https://booking-system-api-sophjvlias-projects.vercel.app/movies/${movieId}/availability/${selectedDate}`);
      setAvailableTimeslots(response.data);
    } catch (error) {
      setError('Error fetching movies');
    }
  };

  const handleTimeslotClick = async (timeslotId) => {
    const selectedTimeslot = timeslotId
    setSelectedTimeslot(timeslotId);

    try {
      const response = await axios.get(`https://booking-system-api-sophjvlias-projects.vercel.app/movies/${movieId}/${selectedTimeslot}/seats`);
      setAvailableSeats(response.data);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  };

  const formatTime = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "pm" : "am";
    const adjustedHour = hour % 12 || 12; 
    return `${adjustedHour}${period}`;
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1 className="text-center text-white fw-bold my-3">My Bookings</h1>
      <div className="container">
        <div className="row">
          {bookings && bookings.bookings.length > 0 ? (
            bookings.bookings.map((booking) => (
              <div key={booking.booking_id} className="col-4 mb-3">
                <div className="bg-white booking">
                  <div>
                    <img height="150" src={booking.thumbnail_url} alt="An image of the movie poster" />
                  </div>
                  <div className="ms-2">
                    <p className="mb-2 fw-bold lh-sm">{booking.title}</p>
                    <p className="m-0">
                      <span className="fw-bold">Date:</span> {formatDate(booking.date)}
                    </p>
                    <p className="m-0">
                      <span className="fw-bold">Time:</span> {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                    </p>
                    <p className="m-0"><span className="fw-bold">Seat:</span> {booking.seat_number}</p>
                    <div className="d-flex justify-content-end pe-2">
                      <i
                        className="bi bi-pencil-square text-warning me-2"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleEditClick(booking)}
                      ></i>
                      <i
                        className="bi bi-trash text-danger"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteClick(booking)}
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center mt-5">
              <h4 className="text-white">You have no bookings.</h4>
            </div>
          )}
        </div>
      </div>

      <Modal show={showDeleteModal} onHide={handleDeleteCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to cancel this booking?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteCancel}>
            No
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            Yes, Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={handleEditCancel}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex w-100 mb-2">
            <div className="available-dates text-dark w-100">
              <h5 className="fw-bold mb-4">Available Dates</h5>
              <select className="w-75 rounded py-2 px-1 bg-white" onChange={handleDateChange}>
                <option value="">Select a date</option>
                {availableDates.map((date, index) => (
                  <option key={index} value={date}>{formatDate(date)}</option>
                ))}
              </select>
            </div>
            <div className="available-timeslots text-dark w-100">
              <h5 className="fw-bold mb-4">Available Timeslots</h5>
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
          <div className="seat-selection px-0">
            <h4 className="text-dark fw-bold mb-4">Select Your Seats</h4>
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
                          <button
                            key={colIndex}
                            value={seatNumber}
                            className={`seat mx-1 btn btn-outline-light ${availableSeat.booking_status === 1 ? 'disabled' : 'btn-outline-light'} ${selectedSeat === seatNumber ? 'selected' : ''}`}
                            onClick={() => handleSeatClick(availableSeat)}
                            disabled={availableSeat.booking_status === 1}
                          >
                            {seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {/* <div className="mt-3 mb-5 d-flex justify-content-center">
                  <button id="book" className="btn btn-primary px-5" onClick={handleEditConfirm}>Book Now</button>
                </div> */}
              </div>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleEditConfirm}>
            Book
          </Button>
          <Button variant="danger" onClick={handleEditCancel}>
            Cancel
          </Button>
        </Modal.Footer> 
      </Modal>

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

export default Bookings;
