import { setupLogoutButton } from "./utils/auth.js";
import { getProduct } from "../data/products.js";
import { getCookie } from "../data/cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { formatCurrency } from "./utils/money.js";

setupLogoutButton();

async function loadAndRenderOrders() {
  try {
    const csrftoken = getCookie("csrftoken");
    // Fetch orders
    const ordersRes = await fetch("/api/v1/order/", {
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
    });
    if (!ordersRes.ok) throw new Error("Failed to load orders");
    const orders = await ordersRes.json();

    // Fetch order items
    const itemsRes = await fetch("/api/v1/order_items/", {
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
    });
    if (!itemsRes.ok) throw new Error("Failed to load order items");
    const orderItems = await itemsRes.json();

    console.log("Orders:", orders);
    console.log("OrderItems:", orderItems);

    let ordersGridHTML = "";

    for (const order of orders) {
      const placedDate = dayjs(order.order_placed_date).format("MMMM D");
      const orderId = order.id;
      const total = order.total_price;

      const itemsForOrder = orderItems.filter((item) => item.order === orderId);
      console.log(
        "For orderId:",
        orderId,
        "found items:",
        itemsForOrder,
        "All items:",
        orderItems,
      );

      let itemsHTML = "";

      for (const item of itemsForOrder) {
        const product = await getProduct(item.product_id);
        if (!product) {
          console.warn("Product not found for item:", item);
          continue;
        }

        const arrivingDate = dayjs(item.arriving_date).format("MMMM D");

        itemsHTML += `
          <div class="product-image-container">
            <img src="/static/${product.image}">
          </div>

          <div class="product-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-delivery-date">
              Arriving on: ${arrivingDate}
            </div>
            <div class="product-quantity">
              Quantity: ${item.quantity}
            </div>
            <button class="buy-again-button button-primary">
              <img class="buy-again-icon" src="/static/images/icons/buy-again.png">
              <span class="buy-again-message">Buy it again</span>
            </button>
          </div>

          <div class="product-actions">
            <a href="/tracking/?orderId=${orderId}&productId=${product.id}">
              <button class="track-package-button button-secondary">
                Track package
              </button>
            </a>
          </div>
        `;
      }

      ordersGridHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${placedDate}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${total}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${orderId}</div>
              <button class="button-secondary js-delete-order" data-order-id="${orderId}" style="margin-left: 15px; padding: 4px 8px;">Delete</button>
            </div>
          </div>

          <div class="order-details-grid">
            ${itemsHTML}
          </div>
        </div>
      `;
    }

    document.querySelector(".js-orders-grid").innerHTML = ordersGridHTML;

    // Attach event listeners to delete buttons
    document.querySelectorAll(".js-delete-order").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const orderIdToDelete = event.target.dataset.orderId;
        if (!confirm("Are you sure you want to delete this order?")) return;

        try {
          const deleteRes = await fetch(`/api/v1/order/${orderIdToDelete}/`, {
            method: "DELETE",
            headers: {
              "X-CSRFToken": csrftoken,
            },
          });
          if (deleteRes.ok) {
            loadAndRenderOrders(); // re-render list
          } else {
            alert("Failed to delete order.");
          }
        } catch (err) {
          console.error(err);
        }
      });
    });
  } catch (error) {
    console.error("Error rendering orders:", error);
    document.querySelector(".js-orders-grid").innerHTML =
      `<p>Failure loading orders.</p>`;
  }
}

loadAndRenderOrders();
