import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`/api/doctors/${id}`);
        if (!res.ok) {
          throw new Error('Doctor not found');
        }
        const data = await res.json();
        setDoctor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return <div className="loading-state">Loading doctor profile...</div>;
  }

  if (error || !doctor) {
    return (
      <div className="no-results-state card container">
        <h2>Doctor Profile Not Found</h2>
        <p className="muted">The doctor profile you are trying to view does not exist or has been moved.</p>
        <Link to="/doctors">
          <RippleButton variant="primary">Back to Doctors List</RippleButton>
        </Link>
      </div>
    );
  }

  // Generative reviews for the doctor based on details
  const reviews = [
    { id: 1, user: 'Maria Santos', rating: 5, date: 'June 18, 2026', comment: `Excellent experience with ${doctor.name}. They took time to listen to all my concerns and explained everything clearly.` },
    { id: 2, user: 'Devon King', rating: 4, date: 'May 30, 2026', comment: 'Very professional and knowledgeable. The clinic was tidy and appointments ran right on schedule.' }
  ];

  return (
    <div className="container">
      <ScrollReveal className="section">
        <Link to="/doctors" className="back-link">
          ← Back to Doctors List
        </Link>

        <div className="doc-details-layout">
          {/* Main profile card */}
          <div className="doc-profile-card card">
            <div className="doc-profile-main">
              <div className="avatar doc-large-avatar">
                {doctor.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}
              </div>
              <div>
                <h1 className="doc-name">{doctor.name}</h1>
                <p className="doc-specialty">{doctor.role}</p>
                <div className="doc-rating-badge">★ {doctor.rating} Rating</div>
              </div>
            </div>

            <hr />

            <div className="doc-info-list">
              <div className="doc-info-item">
                <strong>Qualification:</strong>
                <span>{doctor.qualification || 'MD'}</span>
              </div>
              <div className="doc-info-item">
                <strong>Experience:</strong>
                <span>{doctor.experience}</span>
              </div>
              <div className="doc-info-item">
                <strong>Specialty Area:</strong>
                <span>{doctor.role} Treatment & Consultations</span>
              </div>
              <div className="doc-info-item">
                <strong>Languages:</strong>
                <span>English, Spanish</span>
              </div>
            </div>

            <div className="doc-action-btn-container">
              <Link to={`/book-appointment/${doctor.id || doctor._id}`}>
                <RippleButton variant="primary" className="w-100 booking-btn">
                  Book An Appointment
                </RippleButton>
              </Link>
            </div>
          </div>

          {/* Right section - About & Reviews */}
          <div className="doc-about-column">
            <div className="card doc-about-card">
              <h3>About {doctor.name}</h3>
              <p>{doctor.notes}</p>
              <p className="muted">
                Offers comprehensive outpatient check-ups, diagnostic services, and personalized digital prescriptions with patient-centered support routines.
              </p>
            </div>

            <div className="card doc-reviews-card">
              <h3>Patient Reviews ({reviews.length})</h3>
              <div className="reviews-list">
                {reviews.map((rev) => (
                  <div key={rev.id} className="review-item">
                    <div className="review-header">
                      <strong>{rev.user}</strong>
                      <span className="review-rating">★ {rev.rating}</span>
                    </div>
                    <span className="review-date muted">{rev.date}</span>
                    <p className="review-comment">“{rev.comment}”</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default DoctorDetails;
