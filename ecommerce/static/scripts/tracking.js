import { setupLogoutButton } from './utils/auth.js';
import { getProduct } from '../data/products.js';
import { getCookie } from '../data/cart.js';
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

setupLogoutButton();

async function loadTrackingData() {
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  if (!orderId || !productId) return;

  try {
    const csrftoken = getCookie("csrftoken");
    const itemsRes = await fetch('/api/v1/order_items/', {
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken }
    });
    if (!itemsRes.ok) throw new Error("Failed to fetch tracking data");
    const items = await itemsRes.json();

    const matchingItem = items.find(i => i.order === orderId && i.product_id === productId);
    if (!matchingItem) return;

    const product = await getProduct(productId);
    if (!product) return;

    const arrivingDate = dayjs(matchingItem.arriving_date).format('dddd, MMMM D');
    
    // Simplistic progress logic based on date
    const today = dayjs();
    const deliveryDate = dayjs(matchingItem.arriving_date);
    // Assuming order date was a few days ago (or you can fetch from order API)
    const percentProgress = today >= deliveryDate ? 100 : 50; 

    const trackingHTML = `
        <a class="back-to-orders-link link-primary" href="/orders/">
          View all orders
        </a>

        <div class="delivery-date">
          Arriving on ${arrivingDate}
        </div>

        <div class="product-info">
          ${product.name}
        </div>

        <div class="product-info">
          Quantity: ${matchingItem.quantity}
        </div>

        <img class="product-image" src="/static/${product.image}">

        <div class="progress-labels-container">
          <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
            Preparing
          </div>
          <div class="progress-label ${percentProgress >= 50 && percentProgress < 100 ? 'current-status' : ''}">
            Shipped
          </div>
          <div class="progress-label ${percentProgress >= 100 ? 'current-status' : ''}">
            Delivered
          </div>
        </div>

        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${percentProgress}%"></div>
        </div>
    `;

    document.querySelector('.js-order-tracking').innerHTML = trackingHTML;

  } catch (error) {
    console.error("Error loading tracking info:", error);
  }
}

loadTrackingData();
