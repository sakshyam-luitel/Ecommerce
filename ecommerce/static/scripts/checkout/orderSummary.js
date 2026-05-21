import {
  getCart,
  removeFromCart,
  calculateCartQuantity,
  updateDeliveryOption,
  updateCart,
} from "../../data/cart.js";

import { getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";

import { renderPaymentSummary } from "./paymentSummary.js";

export async function renderOrderSummary(cartData) {
  let cartSummaryHTML = "";

  // ✅ FIXED PART (forEach -> for...of)
  for (const cartItem of cartData) {
    const productId = (cartItem.productId || cartItem.product_id);
    const matchingProduct = await getProduct(productId);

    cartSummaryHTML += `<div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${getDateString(cartItem)}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="/static/${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity-link js-update-quantity-link-${matchingProduct.id}" data-product-id = "${matchingProduct.id}">
                    Update
                  </span>
                  <input class = "quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class="save-quantity-link link-primary js-save-link"
              data-product-id="${matchingProduct.id}">
              Save
            </span>

                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id = "${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                
             ${deliveryOptionsHTML(matchingProduct, cartItem)}
              </div>
            </div>
          </div>`;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  function getDateString(cartItem) {
    const deliveryOptionId = (cartItem.deliveryOptionId || cartItem.delivery_option_id);
    const option = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(option.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    return dateString;
  }

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE Shipping"
          : `$${formatCurrency(deliveryOption.priceCents)} - Shipping`;

      const isChecked = deliveryOption.id === (cartItem.deliveryOptionId || cartItem.delivery_option_id);

      html += `
    <div class="delivery-option js-delivery-option" data-product-id = "${matchingProduct.id}" data-delivery-option-id = "${deliveryOption.id}">
      <input type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}">
      <div>
        <div class="delivery-option-date">
          ${dateString}
        </div>
        <div class="delivery-option-price">
          ${priceString}
        </div>
      </div>
    </div>`;
    });
    return html;
  }

  const totalCartQuantity = await calculateCartQuantity();
  document.querySelector(".js-return-to-home").innerHTML =
    `${totalCartQuantity} items`;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();

      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();

      const totalCartQuantity = await calculateCartQuantity();
      document.querySelector(".js-return-to-home").innerHTML =
        `${totalCartQuantity} items`;

      const cartData2 = await getCart();

      renderOrderSummary(cartData2);
      renderPaymentSummary(cartData2);
    });
  });

  document
    .querySelectorAll(".js-update-quantity-link")
    .forEach((updateLink) => {
      updateLink.addEventListener("click", async () => {
        const productId = updateLink.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add("is-editing-input");
      });
    });

  document.querySelectorAll(".js-save-link").forEach((saveLink) => {
    saveLink.addEventListener("click", async () => {
      const productId = saveLink.dataset.productId;

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.remove("is-editing-input");

      const quantityInput = document.querySelector(
        `.js-quantity-input-${productId}`
      );
      const newQuantity = Number(quantityInput.value);
      await updateCart(productId, newQuantity);

      const totalCartQuantity = await calculateCartQuantity();
      document.querySelector(".js-return-to-home").innerHTML =
        `${totalCartQuantity} items`;

      const cartData1 = await getCart();

      renderOrderSummary(cartData1);
      renderPaymentSummary(cartData1);
    });
  });

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", async () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      const cartData = await getCart();

      updateDeliveryOption(productId, deliveryOptionId, cartData);
      renderOrderSummary(cartData);
      renderPaymentSummary(cartData);
    });
  });
}