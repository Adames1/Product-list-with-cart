document.addEventListener("DOMContentLoaded", () => {
  const productData = "./products.json";

  // variables
  const productList = document.querySelector(".product-list");
  const cartContainer = document.querySelector(
    ".section-cart--illustrationcart"
  );
  const containerOrderTotal = document.querySelector(".cart-ordertotal");
  const orderTotalValue = document.querySelector(".cart-ordertotal h3");
  const carbonNeutral = document.querySelector(".cart-carbon-neutral");
  const buttonConfirm = document.querySelector(".btn-confirm");

  const overlay = document.querySelector(".overlay");
  const orderConfirmed = document.querySelector(".section-orderconfirmed");

  // array empty
  let inCart = [];

  // get all products of json
  async function getProducts() {
    try {
      const res = await fetch(productData);
      if (!res.ok) {
        throw new Error("No get data product.");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error", error);
    }
  }

  // render list product
  async function productListUi() {
    let products = await getProducts();

    products.map((product) => {
      let productArticle = `<article class="productlist-card" data-id="${
        product.id
      }">
                        <div class="productlist-card--img">
                            <img src=${
                              product.imagemobile
                            } class="img-product img-mobile" alt="Waffle with Berries">
                            <img src=${
                              product.imagetablet
                            } class="img-product img-tablet" alt="Waffle with Berries">
                            <img src=${
                              product.imagedesktop
                            } class="img-product img-desktop" alt="Waffle with Berries">
                            <div class="productlist-actions">
                              ${buttonsUiCart("btn-addcart", product.id)}
                            </div>
                        </div>
                        <div class="productlist-card--info">
                            <p class="productlist-name">${product.name}</p>
                            <h2 class="productlist-description">${
                              product.description
                            }</h2>
                            <span class="productlist-price">$${
                              product.price
                            }</span>
                        </div>
                    </article>`;

      productList.innerHTML += productArticle;
    });

    // actions button add cart
    document.querySelectorAll(".btn-addcart").forEach((button) => {
      button.addEventListener("click", function () {
        const productId = Number(this.dataset.id);
        const product = products.find((p) => p.id === productId);

        if (product) {
          let cartItem = inCart.find((item) => item.id === productId);
          if (!cartItem) {
            inCart.push({ ...product, quantity: 1 });
          } else {
            cartItem.quantity++;
          }

          const parent = this.closest(".productlist-card");
          const images = parent.querySelectorAll(".img-product");
          images.forEach((img) => img.classList.add("select-product"));

          const actionsContainer = this.parentElement;
          actionsContainer.innerHTML = buttonsUiCart(
            "actions-more-less-amount"
          );

          const btnLess = actionsContainer.querySelector(".btn-less");
          const btnMore = actionsContainer.querySelector(".btn-more");
          const counter = actionsContainer.querySelector(".counter-amount");

          let quantity = 1;
          counter.textContent = quantity;

          btnLess.addEventListener("click", () => {
            if (quantity > 0) {
              quantity--;
              counter.textContent = quantity;
              updateCart(productId, quantity);
              sumOrderTotal();
            }
          });

          btnMore.addEventListener("click", () => {
            quantity++;
            counter.textContent = quantity;
            updateCart(productId, quantity);
            sumOrderTotal();
          });

          renderCart();

          containerOrderTotal.style.display = "flex";
          carbonNeutral.style.display = "flex";
          buttonConfirm.style.display = "block";

          sumOrderTotal();
        }
      });
    });
  }

  // cart items in the DOM
  function renderCart() {
    cartContainer.innerHTML = "";

    inCart.forEach((item) => {
      cartContainer.innerHTML += `
      <div class="cart-product" data-id={${item.id}}>
          <div>
              <h2>${item.description}</h2>
              <div class="cart-balance">
                  <span>${item.quantity}x</span>
                  <span>@$${item.price}</span>
                  <span>$${(item.quantity * item.price).toFixed(2)}</span>
              </div>
          </div>
          <button type="button" title="Delete product" class="btn-deleteproduct">
              <img src="./assets/images/icon-remove-item.svg" alt="">
          </button>
      </div>
      `;
    });
  }

  // Update the quantity in the cart
  function updateCart(productId, quantity) {
    const cartItem = inCart.find((item) => item.id === productId);
    if (cartItem) {
      if (quantity === 0) {
        inCart = inCart.filter((item) => item.id !== productId); // Remove item if quantity is 0
      } else {
        cartItem.quantity = quantity; // Update quantity
      }
      renderCart(); // Update cart display
    }
  }

  function sumOrderTotal() {
    const initialValue = 0;
    const sumPriceProduct = inCart.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, initialValue);

    orderTotalValue.textContent = `$${sumPriceProduct.toFixed(2)}`;
  }

  // show button ui with click
  function buttonsUiCart(type, id = "") {
    if (type === "btn-addcart") {
      return `
      <button type="button" class="button btn-addcart" title="Add to cart" data-id="${id}">
          <img src="./assets/images/icon-add-to-cart.svg" class="icon-addcart"  alt="Button Add to Cart">
          <span>Add to Cart</span>
      </button>`;
    } else if (type === "actions-more-less-amount") {
      return `
      <div class="button actions-more-less-amount">
          <button type="button" class="btn-less" title="decrement">
              <img src="./assets/images/icon-decrement-quantity.svg" alt="">
          </button>
          <span class="counter-amount">0</span>
          <button type="button" class="btn-more" title="increment">
              <img src="./assets/images/icon-increment-quantity.svg" alt="">
          </button>
      </div>
      `;
    }
  }

  if (buttonConfirm) {
    buttonConfirm.addEventListener("click", () => {
      overlay.classList.add("is-active");
      orderConfirmed.classList.add("is-active");
    });
  }

  getProducts();
  productListUi();
});
