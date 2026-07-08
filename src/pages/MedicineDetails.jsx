import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../App';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function MedicineDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(AppContext);

  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    const fetchMedicine = async () => {
      try {
        const res = await fetch(`/api/medicines/${id}`);
        if (!res.ok) {
          throw new Error('Medicine not found');
        }
        const data = await res.json();
        setMedicine(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);

  const handleAddToCart = () => {
    if (!medicine) return;
    addToCart(medicine);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  if (loading) {
    return <div className="loading-state">Loading medicine details...</div>;
  }

  if (error || !medicine) {
    return (
      <div className="no-results-state card container">
        <h2>Product Not Found</h2>
        <p className="muted">The medicine you are searching for is not available or has been discontinued.</p>
        <Link to="/medicines">
          <RippleButton variant="primary">Back to Store</RippleButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <ScrollReveal className="section">
        <Link to="/medicines" className="back-link">
          ← Back to Medicine Store
        </Link>

        <div className="med-details-layout">
          {/* Left panel - Image */}
          <div className="med-details-visual card">
            <img src={medicine.image} alt={medicine.name} className="med-details-img" />
            <span className="med-details-badge">{medicine.category}</span>
          </div>

          {/* Right panel - Information */}
          <div className="med-details-content card">
            <h1 className="med-name">{medicine.name}</h1>
            <p className="med-price-large">${medicine.price.toFixed(2)}</p>

            <hr />

            <div className="med-section">
              <h4>Description</h4>
              <p>{medicine.description}</p>
            </div>

            <div className="med-section">
              <h4>Dosage & Administration</h4>
              <p className="dosage-box">{medicine.dosage || 'Take as directed by a healthcare professional.'}</p>
            </div>

            <div className="med-action-container">
              <RippleButton variant="primary" onClick={handleAddToCart} className="w-100 buy-btn">
                Add to Shopping Cart
              </RippleButton>
              {addedMessage && (
                <div className="success-toast">
                  ✓ Added to cart! <Link to="/cart">View Cart</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reviews panel */}
        <div className="card med-reviews-section">
          <h3>Customer Reviews ({medicine.reviews?.length || 0})</h3>
          {(!medicine.reviews || medicine.reviews.length === 0) ? (
            <p className="muted">No reviews for this product yet.</p>
          ) : (
            <div className="reviews-list">
              {medicine.reviews.map((rev, index) => (
                <div key={index} className="review-item">
                  <div className="review-header">
                    <strong>{rev.user}</strong>
                    <span className="review-rating">★ {rev.rating}</span>
                  </div>
                  <p className="review-comment">“{rev.comment}”</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollReveal>
    </div>
  );
}

export default MedicineDetails;
