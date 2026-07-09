import { Link } from 'react-router-dom'
import './ProductHeader.css'

function ProductHeader() {
  return (
    <>
      <div className="amazon-header">
        <div className="amazon-header-left-section">
          <Link
            to='/product'
            className="header-link"
            style={{ textDecoration: 'none' }}
          >
            <h2 style={{ color: 'white', margin: 0 }}>Ecommerce</h2>
          </Link>
        </div>

        <div className="amazon-header-middle-section"></div>

        <div className="amazon-header-right-section">
          <div className="header-link js-user-container user-container">
            <span className="js-username-greeting username-greeting"></span>
            <button className="js-logout-button logout-button">
              <i className="fa-solid fa-right-from-bracket"></i>{" "}
              <span className="logout-text">Log out</span>
            </button>
          </div>
          <Link className="orders-link header-link" to="orders">
            <span className="orders-text">Orders</span>
          </Link>

          <a className="cart-link header-link" href="/checkout">
            <img
              className="cart-icon"
              src="images/icons/cart-icon.png"
            />
            <div className="cart-quantity js-cart-quantity"></div>
            <div className="cart-text">Cart</div>
          </a>
        </div>
      </div>
    </>
  );
}

export default ProductHeader;
