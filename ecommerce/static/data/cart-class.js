class Cart{
    cartItems = undefined;
    #localStorageKey;

    constructor(localStorageKey){
        this.#localStorageKey = localStorageKey;
        this.loadFromStorage();
        }

    // loadFromStorage = function(){
    // this.cartItems = JSON.parse(localStorage.getItem(this.#localStorageKey))|| 
    // [
    // {
    //     productId :'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    //     quantity :2,
    //     deliveryOptionsId  : '1'
    // },
    // {
    //     productId : '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    //     quantity : 1,
    //     deliveryOptionsId : '2'
    // }
    // ];
    // }

    loadFromStorage = function() {
      const cartPromise = fetch('api/products').then((response) =>{return response.json()});     
      this.cartItems = cartPromise||
      [
    {
        productId :'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity :2,
        deliveryOptionsId  : '1'
    },
    {
        productId : '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity : 1,
        deliveryOptionsId : '2'
    }
    ];
    }

    //shortcut to saveToStorage : function()
    saveToStorage(){
    localStorage.setItem(this.#localStorageKey,JSON.stringify(this.cartItems));
    }

    addToCart(productId)
    {
      let matchingItem;
          this.cartItems.forEach((cartItem)=>{
            if(productId === cartItem.productId)
            {
              matchingItem = cartItem;
            }
          });
          if(matchingItem)
          {
            matchingItem.quantity += Number(document.querySelector(`.js-product-quantity-selector-${productId}`).value);
          }
          else
          {
            this.cartItems.push({
              productId :productId,
              quantity : Number(document.querySelector(`.js-product-quantity-selector-${productId}`).value) ,
              deliveryOptionsId : '1'
            })
          }
          console.log(cart);
          this.saveToStorage();

          const fetchPromise = fetch('api/products/',
            {
              method : 'POST' , 
              headers : {'Content-Type' : 'application/json'},
              body : JSON.stringify({
                productId : productId , 
                quantity : quantity,
                deliveryOptionId : deliveryOptionId
              })
            }
          ).then((response) =>{response.json()});


          fetchPromise.then((resolve) =>{
            
          });
    }

      }

    removeFromCart(productId)
    {
      const newCart = [];
      this.cartItems.forEach((cartItem)=>{
        if(cartItem.productId !== productId)
        {
          newCart.push(cartItem);
        }

      });

      this.cartItems = newCart;

      this.saveToStorage();
    }

    updateDeliveryOption(productId, deliveryOptionId){
      
      let matchingItem;
          this.cartItems.forEach((cartItem)=>{
            if(productId === cartItem.productId)
            {
              matchingItem = cartItem;
            }
          });

      matchingItem.deliveryOptionsId = deliveryOptionId;
      this.saveToStorage();
    }

    calculateCartQuantity = function()
      {
        let cartQuantity = 0;
        this.cartItems.forEach((cartItem) => {
          cartQuantity += cartItem.quantity;
         });
         return cartQuantity;
      }
}

const cart = new Cart('cart-oop');
const businessCart =new Cart('cart-business');


console.log(cart);
console.log(businessCart);




 

    


    


