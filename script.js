document.addEventListener("DOMContentLoaded", () => {
  const productData = "./products.json";

  const productList = document.querySelector(".product-list");

  let inCart = [];

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
          inCart.push(product);

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
            }
          });

          btnMore.addEventListener("click", () => {
            quantity++;
            counter.textContent = quantity;
          });
        }
      });
    });
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

  getProducts();
  productListUi();
});
