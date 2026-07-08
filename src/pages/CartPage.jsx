import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import ScrollReveal from '../components/ScrollReveal';
import RippleButton from '../components/RippleButton';

function CartPage() {
  const { cart, updateCartQuantity, removeFromCart } = useContext(AppContext);

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 30 || subtotal === 0 ? 0 : 5.99;
  const total = subtotal + shipping;

  if (cart.length === 0) {
    return (
      <div className="container">
        <ScrollReveal className="section empty-cart-container">
          <div className="card empty-cart-card">
            <h2>Your Shopping Cart is Empty</h2>
            <p className="muted">You haven't added any medicines or wellness supplies yet.</p>
            <Link to="/medicines">
              <RippleButton variant="primary">Browse Medicine Store</RippleButton>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="container">
      <ScrollReveal className="section">
        <h1 className="section-title">Shopping Cart</h1>
        <p className="muted">Review your items before proceeding to checkout.</p>

        <div className="cart-layout">
          {/* Cart items list */}
          <div className="cart-items-list card">
            {cart.map((item) => (
              <div key={item.id || item._id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-img" />
                
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <span className="cart-item-cat">{item.category}</span>
                  <span className="cart-item-price-unit">${item.price.toFixed(2)} each</span>
                </div>

                <div className="cart-item-quantity-controls">
                  <button
                    onClick={() => updateCartQuantity(item.id || item._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="quantity-btn"
                  >
                    -
                  </button>
                  <span className="quantity-value">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.id || item._id, item.quantity + 1)}
                    className="quantity-btn"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-subtotal">
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>

                <button
                  onClick={() => removeFromCart(item.id || item._id)}
                  className="cart-remove-btn"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Cart summary card */}
          <div className="cart-summary-card card">
            <h3>Order Summary</h3>
            <hr />

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping Fee:</span>
              <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            {shipping > 0 && (
              <p className="shipping-hint muted">Add ${(30 - subtotal).toFixed(2)} more to get FREE shipping!</p>
            )}

            <hr />

            <div className="summary-row total-row">
              <strong>Grand Total:</strong>
              <strong>${total.toFixed(2)}</strong>
            </div>

            <div className="cart-summary-actions">
              <Link to="/checkout">
                <RippleButton variant="primary" className="w-100 checkout-btn">
                  Proceed to Checkout
                </RippleButton>
              </Link>
              <Link to="/medicines" className="continue-shopping">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

export default CartPage;
