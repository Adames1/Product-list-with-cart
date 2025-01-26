document.addEventListener("DOMContentLoaded", function () {
  const dataJson = "./products.json";

  //   variables
  const productList = document.querySelector(".product-list");
  const cartContainer = document.querySelector(
    ".section-cart--illustrationcart"
  );
  const containerOrderTotal = document.querySelector(".cart-ordertotal");
  const orderTotalValue = document.querySelector(".cart-ordertotal h3");
  const carbonNeutral = document.querySelector(".cart-carbon-neutral");
  const buttonConfirm = document.querySelector(".btn-confirm");
  const buttonNewOrder = document.querySelector(".btn-neworder");
  const counterItemsCart = document.querySelector(".counter");

  const overlay = document.querySelector(".overlay");
  const orderConfirmed = document.querySelector(".section-orderconfirmed");

  let productInCart = [];

  //   get all data json
  async function getProductsJson() {
    try {
      const response = await fetch(dataJson);
      if (!response.ok) {
        throw new Error("The json data could not be loaded.");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error", error);
    }
  }

  //   ui products list
  async function renderProducts() {
    const products = await getProductsJson();

    products.map((product) => {
      let itemProduct = `
        <article class="productlist-card" data-id="${product.id}">
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
                    ${renderButtonProduct("btn-addcart", product.id)}
                </div>
            </div>
            <div class="productlist-card--info">
                <p class="productlist-name">${product.name}</p>
                <h2 class="productlist-description">${product.description}</h2>
                <span class="productlist-price">$${product.price}</span>
            </div>
        </article>
        `;

      productList.innerHTML += itemProduct;
    });

    document.querySelectorAll(".btn-addcart").forEach((button) => {
      button.addEventListener("click", function () {
        const idProduct = Number(this.dataset.id);
        const findProduct = products.find((p) => p.id === idProduct);

        if (findProduct) {
          let itemCart = productInCart.find((item) => item.id === idProduct);
          if (!itemCart) {
            productInCart.push({ ...findProduct, quantity: 1 });
          } else {
            itemCart.quantity++;
          }

          const parent = this.closest(".productlist-card");
          const images = parent.querySelectorAll(".img-product");
          images.forEach((img) => img.classList.add("select-product"));

          const buttonsContainer = this.parentElement;
          buttonsContainer.innerHTML = renderButtonProduct(
            "actions-more-less-amount"
          );

          const btnLess = buttonsContainer.querySelector(".btn-less");
          const btnMore = buttonsContainer.querySelector(".btn-more");
          const counter = buttonsContainer.querySelector(".counter-amount");

          let quantity = 1;
          counter.textContent = quantity;

          btnLess.addEventListener("click", () => {
            if (quantity > 0) {
              quantity--;
              counter.textContent = quantity;
              updateQuantityCart(idProduct, quantity);
              orderTotal();
              updateCartCounter();
            }
          });

          btnMore.addEventListener("click", () => {
            quantity++;
            counter.textContent = quantity;
            updateQuantityCart(idProduct, quantity);
            orderTotal();
            updateCartCounter();
          });

          renderCart();

          containerOrderTotal.style.display = "flex";
          carbonNeutral.style.display = "flex";
          buttonConfirm.style.display = "block";

          orderTotal();
          updateCartCounter();
        }
      });
    });
  }

  //   change state of button
  function renderButtonProduct(type, id = "") {
    if (type === "btn-addcart") {
      return `
        <button type="button" class="button btn-addcart" title="Add to cart" data-id="${id}">
            <img src="./assets/images/icon-add-to-cart.svg" class="icon-addcart"  alt="Button Add to Cart">
            <span>Add to Cart</span>
        </button>
        `;
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

  function renderCart() {
    cartContainer.innerHTML = "";

    productInCart.map((item) => {
      cartContainer.innerHTML += `
        <div class="cart-product" data-id=${item.id}>
          <div>
              <h2>${item.description}</h2>
              <div class="cart-balance">
                  <span>${item.quantity}x</span>
                  <span>@$${item.price}</span>
                  <span>$${(item.quantity * item.price).toFixed(2)}</span>
              </div>
          </div>
          <button type="button" title="Delete product" class="btn-deleteproduct" data-id=${
            item.id
          }>
              <img src="./assets/images/icon-remove-item.svg" alt="">
          </button>
        </div>
        `;
    });

    const buttonRemoveItem = document.querySelectorAll(".btn-deleteproduct");
    buttonRemoveItem.forEach((button) => {
      button.addEventListener("click", function () {
        const itemId = Number(this.dataset.id);
        removeItemOfCart(itemId);
      });
    });
  }

  // remove item product of cart
  function removeItemOfCart(images, id) {
    productInCart = productInCart.filter((item) => item.id !== id);

    renderCart();
    updateCartCounter();
    orderTotal();
  }

  function updateQuantityCart(id, quantity) {
    const itemCart = productInCart.find((item) => item.id === id);
    if (itemCart) {
      if (quantity === 0) {
        inCart = productInCart.filter((item) => item.id !== id);
      } else {
        itemCart.quantity = quantity;
      }
      renderCart();
    }
  }

  function orderTotal() {
    const sumTotalPriceProduct = productInCart.reduce((accumulator, item) => {
      return accumulator + item.price * item.quantity;
    }, 0);

    orderTotalValue.textContent = `${sumTotalPriceProduct.toFixed(2)}`;

    // total balance for product
    document.querySelector(
      ".cart-ordertotalConfirmed h3"
    ).textContent = `${sumTotalPriceProduct.toFixed(2)}`;
  }

  function resumeOrderConfirmed() {
    const listOrderConfirmed = document.querySelector(".list-orderconfirmed");

    productInCart.map((product) => {
      let productResume = `
      <div class="list-cardorderconfirmed">
          <img src="${product.imagethumbnail}" alt="">
          <div class="info">
              <h4>${product.description}</h4>
              <span>${product.quantity}</span>
              <span>@$${product.price}</span>
          </div>
          <h3 class="price">$${(product.price * product.quantity).toFixed(
            2
          )}</h3>
      </div>
      `;

      listOrderConfirmed.insertAdjacentHTML("afterbegin", productResume);
    });
  }

  function updateCartCounter() {
    const totalQuantity = productInCart.reduce(
      (total, product) => total + product.quantity,
      0
    );
    counterItemsCart.textContent = `Your Cart (${totalQuantity})`;
  }

  if (buttonConfirm) {
    buttonConfirm.addEventListener("click", () => {
      overlay.classList.add("is-active");
      orderConfirmed.classList.add("is-active");

      // call function order confirmed
      resumeOrderConfirmed();
    });
  }

  if (buttonNewOrder) {
    buttonNewOrder.addEventListener("click", () => {
      window.location.reload();
    });
  }

  renderProducts();
});
