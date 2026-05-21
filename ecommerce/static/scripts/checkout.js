import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { setupLogoutButton } from "./utils/auth.js";

setupLogoutButton();

export async function getCartData(){
    try{
    const response = await fetch('/api/v1/cart/')
    if(!response.ok){
        throw new Error('Failed to fetch the cart data')
    }
    const cartData = await response.json()
    await renderOrderSummary(cartData)
    renderPaymentSummary(cartData)
    }
    catch(error){
        console.log('Error:', error)
    }
}

await getCartData()
