import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AppContext } from '../App';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function CheckoutPage() {
  const { cart, clearCart, user } = useContext(AppContext);
  const navigate = useNavigate();

  // Address fields
  const [fullName, setFullName] = useState(user?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  
  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('credit');
  
  // Order status
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If cart is empty and order is not complete, redirect to medicines
    if (cart.length === 0 && !orderComplete) {
      navigate('/medicines');
    }
  }, [cart, orderComplete, navigate]);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 30 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setError('');

    if (!fullName || !address || !city || !zipCode || !phone) {
      setError('Please fill out all billing fields.');
      return;
    }

    setLoading(true);

    // Simulate payment API call
    setTimeout(() => {
      setLoading(false);
      setOrderId('ORD-' + Math.floor(100000 + Math.random() * 900000));
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="container">
        <ScrollReveal className="section success-panel-container">
          <div className="card success-card">
            <div className="success-icon">✓</div>
            <h2>Order Placed Successfully!</h2>
            <p className="muted">Your order has been registered and is being prepared.</p>

            <div className="booking-summary-box">
              <div className="summary-row">
                <strong>Order ID:</strong>
                <span>{orderId}</span>
              </div>
              <div className="summary-row">
                <strong>Recipient Name:</strong>
                <span>{fullName}</span>
              </div>
              <div className="summary-row">
                <strong>Shipping Address:</strong>
                <span>{address}, {city}, {zipCode}</span>
              </div>
              <div className="summary-row">
                <strong>Payment Method:</strong>
                <span>{paymentMethod === 'credit' ? 'Credit/Debit Card' : paymentMethod === 'paypal' ? 'PayPal' : 'Cash on Delivery'}</span>
              </div>
            </div>

            <p className="success-footer-note">
              A delivery update has been sent to your email. Expect arrival within 2-3 business days.
            </p>

            <div className="success-actions">
              <Link to="/">
                <RippleButton variant="primary">Return Home</RippleButton>
              </Link>
              <Link to="/medicines">
                <RippleButton variant="secondary">Back to Medicine Store</RippleButton>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="container">
      <ScrollReveal className="section">
        <h1 className="section-title">Secure Checkout</h1>
        <p className="muted">Provide billing address and select your payment method.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="checkout-layout">
          {/* Shipping Form */}
          <form onSubmit={handlePlaceOrder} className="checkout-form card">
            <h3>Billing & Shipping Information</h3>
            <div className="form-group">
              <label htmlFor="checkout-name">Recipient Name</label>
              <input
                type="text"
                id="checkout-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="checkout-address">Delivery Address</label>
              <input
                type="text"
                id="checkout-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street Address, Apt/Suite"
                required
              />
            </div>

            <div className="booking-info-grid">
              <div className="form-group">
                <label htmlFor="checkout-city">City</label>
                <input
                  type="text"
                  id="checkout-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkout-zip">Zip / Postal Code</label>
                <input
                  type="text"
                  id="checkout-zip"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="12345"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="checkout-phone">Contact Phone Number</label>
              <input
                type="tel"
                id="checkout-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>

            <hr />

            <h3>Payment Options</h3>
            <div className="payment-options">
              <label className={`payment-option ${paymentMethod === 'credit' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="credit"
                  checked={paymentMethod === 'credit'}
                  onChange={() => setPaymentMethod('credit')}
                />
                <div className="payment-details">
                  <strong>Credit / Debit Card</strong>
                  <span className="muted">Pay securely using Visa, MasterCard, or Amex</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <div className="payment-details">
                  <strong>PayPal</strong>
                  <span className="muted">Log in to your PayPal account to complete checkout</span>
                </div>
              </label>

              <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <div className="payment-details">
                  <strong>Cash on Delivery (COD)</strong>
                  <span className="muted">Pay in cash directly upon parcel delivery</span>
                </div>
              </label>
            </div>

            <RippleButton type="submit" className="booking-submit-btn w-100" disabled={loading}>
              {loading ? 'Processing transaction...' : `Pay & Place Order ($${total.toFixed(2)})`}
            </RippleButton>
          </form>

          {/* Cart review */}
          <div className="checkout-summary card">
            <h3>Your Order</h3>
            <hr />
            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item.id || item._id} className="checkout-item-row">
                  <div>
                    <strong>{item.name}</strong>
                    <span className="checkout-qty"> x {item.quantity}</span>
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <hr />

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>

            <hr />

            <div className="summary-row total-row">
              <strong>Total Cost:</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default CheckoutPage;
