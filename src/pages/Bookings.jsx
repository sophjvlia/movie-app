import React, { useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import '../styles/Movies.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [message, setMessage] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const userId = localStorage.getItem('id') !== null ? localStorage.getItem('id') : '';

  useEffect(() => {
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

    fetchBookings();
  }, []);

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
      {bookings && bookings.bookings.map((booking, index) => (
        <div key={index} className="bg-white booking">
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
              <i className="bi bi-pencil-square text-warning me-2" style={{ cursor: "pointer" }}></i>
              <i className="bi bi-trash text-danger" style={{ cursor: "pointer" }} onClick={() => handleDeleteClick(booking)}></i>
            </div>
          </div>
        </div>
      ))}

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
    </div>
  );
};

export default Bookings;
