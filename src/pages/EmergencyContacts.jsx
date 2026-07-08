import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

const EMERGENCY_CONTACTS = [
  {
    category: 'Ambulance & Trauma',
    title: 'Paramedic Dispatch',
    number: '911',
    avail: '24/7 National Hotline',
    desc: 'Call for immediate life-threatening physical injuries, heart attacks, strokes, or severe accidents.'
  },
  {
    category: 'Blood Bank Network',
    title: 'Central Blood Bank Registry',
    number: '1-800-555-0199',
    avail: '24 Hours Supply Dispatch',
    desc: 'Emergency request line for blood type matching, platelet orders, and plasma distributions.'
  },
  {
    category: 'Police & Security',
    title: 'Municipal Police Dispatch',
    number: '911',
    avail: '24/7 Local Protection',
    desc: 'For reports on immediate safety concerns, physical security threats, or emergency roadside assistance.'
  },
  {
    category: 'Poison Control Center',
    title: 'Chemical & Toxic Hotline',
    number: '1-800-222-1222',
    avail: '24/7 Expert Triage',
    desc: 'Immediate advice from medical toxicologists on accidental ingestion, chemical burns, or drug dosages.'
  }
];

const NEARBY_HOSPITALS = [
  {
    name: 'Metro General Medical Center',
    address: '100 Medical Plaza Dr, Metropolis',
    distance: '1.2 miles away',
    phone: '(555) 123-4567',
    trauma: 'Level 1 Trauma Center'
  },
  {
    name: 'St. Jude Community Hospital',
    address: '450 Mercy Lane, Northside',
    distance: '3.4 miles away',
    phone: '(555) 987-6543',
    trauma: 'Level 2 Trauma Center'
  },
  {
    name: 'CareConnect Urgent Clinic',
    address: '789 Wellness Boulevard, Suite A',
    distance: '0.5 miles away',
    phone: '(555) 456-7890',
    trauma: 'Urgent Care & Family Practice'
  }
];

function EmergencyContacts() {
  const handleDial = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="container">
      <ScrollReveal className="section">
        <div className="emergency-header card">
          <div className="emergency-alert-icon">⚠️</div>
          <div>
            <h1 className="emergency-title">Emergency Medical Dashboard</h1>
            <p className="emergency-warning">
              If you or someone near you is experiencing a life-threatening medical event, call <strong>911</strong> or go to the nearest emergency room immediately.
            </p>
          </div>
        </div>

        <div className="emergency-grid">
          {/* Main Hotlines */}
          <div className="emergency-column">
            <h2>Instant Dispatch Hotlines</h2>
            <div className="contacts-list">
              {EMERGENCY_CONTACTS.map((contact, idx) => (
                <div key={idx} className="emergency-contact-card card">
                  <div className="contact-meta">
                    <span className="contact-cat-badge">{contact.category}</span>
                    <span className="contact-availability">{contact.avail}</span>
                  </div>
                  <h3>{contact.title}</h3>
                  <p className="contact-desc">{contact.desc}</p>
                  
                  <div className="contact-dial-row">
                    <span className="dial-number">{contact.number}</span>
                    <RippleButton variant="primary" onClick={() => handleDial(contact.number)} className="dial-btn">
                      📞 Dial Now
                    </RippleButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Nearby Hospitals */}
          <div className="emergency-column">
            <h2>Nearest Trauma & Hospital Facilities</h2>
            <div className="hospitals-list">
              {NEARBY_HOSPITALS.map((hosp, idx) => (
                <div key={idx} className="hospital-facility-card card">
                  <div className="hospital-title-row">
                    <h3>{hosp.name}</h3>
                    <span className="hospital-distance-badge">{hosp.distance}</span>
                  </div>
                  <p className="hospital-address">📍 {hosp.address}</p>
                  <div className="hospital-footer-details">
                    <span className="trauma-rating">🛡️ {hosp.trauma}</span>
                    <a href={`tel:${hosp.phone}`} className="facility-phone-link">
                      📞 {hosp.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="card emergency-info-box">
              <h3>What to do while waiting for help:</h3>
              <ul className="first-aid-steps">
                <li>Stay calm and reassure the patient.</li>
                <li>Make sure the path for paramedics is clear.</li>
                <li>Gather the patient's ID, active medications, and medical history.</li>
                <li>Do not give the patient anything to eat or drink.</li>
              </ul>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default EmergencyContacts;
