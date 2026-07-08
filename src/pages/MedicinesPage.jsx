import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function MedicinesPage() {
  const { addToCart } = useContext(AppContext);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(50);
  const [addedItemMessage, setAddedItemMessage] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await fetch('/api/medicines');
        let data;
        try { data = await res.json(); } catch { data = null; }
        if (Array.isArray(data)) setMedicines(data);
      } catch (err) {
        console.error('Error fetching medicines:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedicines();
  }, []);

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase()) ||
                          med.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || med.category === category;
    const matchesPrice = med.price <= maxPrice;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['All', ...new Set(medicines.map((m) => m.category))];

  const handleAddToCartClick = (e, med) => {
    e.preventDefault(); // Prevent navigating to details if card is clicked
    addToCart(med);
    setAddedItemMessage(`${med.name} added to cart!`);
    setTimeout(() => {
      setAddedItemMessage(null);
    }, 2000);
  };

  return (
    <>
      <ScrollReveal className="section">
        <div className="section-header-row">
          <div>
            <p className="muted">Order prescription & over-the-counter essentials</p>
            <h1 className="section-title">Online Medicine Store</h1>
          </div>
          {addedItemMessage && <div className="cart-toast-alert">{addedItemMessage}</div>}
        </div>

        {/* Filters */}
        <div className="filter-bar card">
          <div className="filter-item search-field">
            <label htmlFor="med-search">Search Medicine</label>
            <input
              type="text"
              id="med-search"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item price-slider-container">
            <label htmlFor="price-range">Max Price: ${maxPrice}</label>
            <input
              type="range"
              id="price-range"
              min="2"
              max="50"
              step="1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading inventory database...</div>
        ) : filteredMedicines.length === 0 ? (
          <div className="no-results-state card">
            <h3>No medicines match your search.</h3>
            <p className="muted">Try expanding your price range or changing keywords.</p>
          </div>
        ) : (
          <div className="medicines-grid">
            {filteredMedicines.map((med) => (
              <Link to={`/medicines/${med.id || med._id}`} key={med.id || med._id} className="medicine-card card zoom-card">
                <div className="med-image-container">
                  <img src={med.image} alt={med.name} className="med-card-img" />
                  <span className="med-category-badge">{med.category}</span>
                </div>

                <div className="med-info">
                  <h3 className="med-title">{med.name}</h3>
                  <p className="med-desc">{med.description.substring(0, 75)}...</p>
                  
                  <div className="med-footer">
                    <span className="med-price">${med.price.toFixed(2)}</span>
                    <RippleButton
                      variant="primary"
                      onClick={(e) => handleAddToCartClick(e, med)}
                      className="add-to-cart-btn"
                    >
                      Add +
                    </RippleButton>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>
    </>
  );
}

export default MedicinesPage;
