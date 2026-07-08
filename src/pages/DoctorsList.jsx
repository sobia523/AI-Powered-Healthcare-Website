import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [minExperience, setMinExperience] = useState(0);
  const [sortBy, setSortBy] = useState('rating'); // 'rating' or 'experience'

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch('/api/doctors');
        const data = await res.json();
        setDoctors(data);
      } catch (err) {
        console.error('Error fetching doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const getExperienceNumber = (expStr) => {
    return parseInt(expStr) || 0;
  };

  const filteredDoctors = doctors
    .filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) || 
                            doc.role.toLowerCase().includes(search.toLowerCase());
      const matchesSpecialization = specialization === 'All' || doc.role === specialization;
      const matchesExp = getExperienceNumber(doc.experience) >= minExperience;
      return matchesSearch && matchesSpecialization && matchesExp;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else {
        return getExperienceNumber(b.experience) - getExperienceNumber(a.experience);
      }
    });

  // Extract unique roles for filtering
  const specializations = ['All', ...new Set(doctors.map((d) => d.role))];

  return (
    <>
      <ScrollReveal className="section">
        <div className="section-header-row">
          <div>
            <p className="muted">Book consultations with top medical experts</p>
            <h1 className="section-title">Our Medical Specialists</h1>
          </div>
        </div>

        {/* Filter bar */}
        <div className="filter-bar card">
          <div className="filter-item search-field">
            <label htmlFor="doc-search">Search Doctor</label>
            <input
              type="text"
              id="doc-search"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-item">
            <label htmlFor="specialization-select">Specialty</label>
            <select
              id="specialization-select"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              {specializations.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="experience-select">Min Experience</label>
            <select
              id="experience-select"
              value={minExperience}
              onChange={(e) => setMinExperience(parseInt(e.target.value))}
            >
              <option value="0">Any Experience</option>
              <option value="5">5+ Years</option>
              <option value="10">10+ Years</option>
              <option value="15">15+ Years</option>
            </select>
          </div>

          <div className="filter-item">
            <label htmlFor="sort-select">Sort By</label>
            <select id="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="rating">Highest Rating</option>
              <option value="experience">Years of Experience</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading doctors database...</div>
        ) : filteredDoctors.length === 0 ? (
          <div className="no-results-state card">
            <h3>No doctors found matching your criteria.</h3>
            <p className="muted">Try resetting filters or adjusting search queries.</p>
          </div>
        ) : (
          <div className="doctors-grid">
            {filteredDoctors.map((doc) => (
              <article key={doc.id || doc._id} className="doctor-card card zoom-card">
                <div className="doc-card-header">
                  <div className="avatar doc-avatar">
                    {doc.name.split(' ').map((word) => word[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="doc-name">{doc.name}</h2>
                    <span className="doc-specialty">{doc.role}</span>
                  </div>
                </div>

                <div className="doc-stats">
                  <div className="doc-stat-item">
                    <strong>★ {doc.rating}</strong>
                    <span>Rating</span>
                  </div>
                  <div className="doc-stat-item">
                    <strong>{doc.experience}</strong>
                    <span>Experience</span>
                  </div>
                </div>

                <p className="doc-excerpt">{doc.notes}</p>

                <div className="doc-card-actions">
                  <Link to={`/doctors/${doc.id || doc._id}`} style={{ flex: 1 }}>
                    <RippleButton variant="secondary" className="w-100">
                      View Profile
                    </RippleButton>
                  </Link>
                  <Link to={`/book-appointment/${doc.id || doc._id}`} style={{ flex: 1 }}>
                    <RippleButton variant="primary" className="w-100">
                      Book Now
                    </RippleButton>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </ScrollReveal>
    </>
  );
}

export default DoctorsList;
