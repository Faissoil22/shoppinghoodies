let carts = document.querySelectorAll('.add-cart');

let products = [
    { name: "Black Hoodie", tag: "blackhoodie", price: 20, inCart: 0 },
    { name: "Black Tshirt", tag: "blacktshirt", price: 25, inCart: 0 },
    { name: "Grey Hoodie", tag: "greyhoodie", price: 30, inCart: 0 },
    { name: "Grey Tshirt", tag: "greytshirt", price: 35, inCart: 0 }
];

for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
        cartNumbers(products[i]);
        totalCost(products[i]);
    });
}

function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

function cartNumbers(product, action) {
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers);

    let cartItems = localStorage.getItem('poductsInCart');
    cartItems = JSON.parse(cartItems);

    if (action == "decrease") {
        localStorage.setItem('cartNumbers', productNumbers - 1);
        document.querySelector('.cart span').textContent = productNumbers - 1;
    } else if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }

    setItems(product);
}

function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let currentProduct = product.tag;

    if (cartItems != null) {
       

        if (cartItems[currentProduct] == undefined) {
            cartItems = {
                ...cartItems,
                [currentProduct]: product
            };
        }
        cartItems[currentProduct].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [currentProduct]: product
        };
    }

    localStorage.setItem('productsInCart', JSON.stringify(cartItems));

   
}

function totalCost(product, action) {
    let cartCost = localStorage.getItem('totalCost');

    if (action) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost - product.price);
    } else if (cartCost != null) {
        cartCost = parseInt(cartCost);
        localStorage.setItem('totalCost', cartCost + product.price);
    } else {
        localStorage.setItem('totalCost', product.price);
    }


}

function displayCart() {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    let productContainer = document.querySelector('.products');
    let cartCost = localStorage.getItem('totalCost');

    if (cartItems && productContainer) {
        productContainer.innerHTML = ``;
        Object.values(cartItems).map((item, index) => {
            productContainer.innerHTML += `
            <div class="product">
               <ion-icon name="close-circle"></ion-icon>
               <img src="./images/${item.tag}.jpg"/>
               <span>${item.name}</span>
            </div>
            <div class="price">${item.price},00€</div>
            <div class="quantity">
              <ion-icon class="decrease" name="arrow-dropleft-circle"></ion-icon>
              <span>${item.inCart}</span>
              <ion-icon class="increase" name="arrow-dropright-circle"></ion-icon>
            </div>
            <div class="total"> ${item.inCart * item.price},00 €</div>
                                          `;
        });

        productContainer.innerHTML += `
         <div class="basketTotalContainer">
           <h4 class="basketTotalTitle">
           Basket Total
           </h4>
           <h4 class"basketTotal">
             ${cartCost},00 €
           </h4>
         </div>                       `;

        deleteButtons();
        manageQuantity();
    }
}


function manageQuantity() {
    let decreaseButtons = document.querySelectorAll('.decrease');
    let increaseButtons = document.querySelectorAll('.increase');

    let currentQuantity = 0;
    let currentProduct = "";

    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    for (let j = 0; j < decreaseButtons.length; j++) {
        decreaseButtons[j].addEventListener('click', () => {
            currentQuantity = decreaseButtons[j].parentElement.querySelector('span').textContent;
            currentProduct = decreaseButtons[j].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();

            if (cartItems[currentProduct].inCart > 1) {
                cartItems[currentProduct].inCart -= 1;
                cartNumbers(cartItems[currentProduct], 'decrease');
                totalCost(cartItems[currentProduct], 'decrease');
                localStorage.setItem('productsInCart', JSON.stringify(cartItems));
                

                displayCart();
            }
        });
    

    
        increaseButtons[j].addEventListener('click', () => {
            currentQuantity = increaseButtons[j].parentElement.querySelector('span').textContent;
            currentProduct = increaseButtons[j].parentElement.previousElementSibling.previousElementSibling.querySelector('span').textContent.toLocaleLowerCase().replace(/ /g,'').trim();

            cartItems[currentProduct].inCart += 1;
            cartNumbers(cartItems[currentProduct]);
            totalCost(cartItems[currentProduct]);
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            displayCart();
        });
    }

}

function deleteButtons() {
    let deleteButtons = document.querySelectorAll('.product ion-icon');
    let productName;
    let productNumbers = localStorage.getItem('cartNumbers'); 
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let cartCost = localStorage.getItem('totalCost');

    for (let k = 0; k < deleteButtons.length; k++) {
        deleteButtons[k].addEventListener('click', () => {
            productName = deleteButtons[k].parentElement.textContent.toLowerCase().replace(/ /g, '').trim();
            localStorage.setItem('cartNumbers', productNumbers - cartItems[productName].inCart);

            localStorage.setItem('totalCost', cartCost - cartItems[productName].price * cartItems[productName].inCart);
            delete cartItems[productName];
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));

            onLoadCartNumbers();
            displayCart();
        })
    }
}

onLoadCartNumbers();
displayCart();
