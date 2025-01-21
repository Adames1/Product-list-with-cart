document.addEventListener("DOMContentLoaded", () => {
  const productData = "./products.json";

  const productList = document.querySelector(".product-list");

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
      let productArticle = `<article class="productlist-card">
                        <div class="productlist-card--img">
                            <img src=${product.imagemobile} class="img-product img-mobile" alt="Waffle with Berries">
                            <img src=${product.imagetablet} class="img-product img-tablet" alt="Waffle with Berries">
                            <img src=${product.imagedesktop} class="img-product img-desktop" alt="Waffle with Berries">
                            <button type="button" class="btn-addcart" title="Add to cart">
                                <img src="./assets/images/icon-add-to-cart.svg" class="icon-addcart" alt="Button Add to Cart">
                                <span>Add to Cart</span>
                            </button>
                        </div>
                        <div class="productlist-card--info">
                            <p class="productlist-name">${product.name}</p>
                            <h2 class="productlist-description">${product.description}</h2>
                            <span class="productlist-price">$${product.price}</span>
                        </div>
                    </article>`;

      productList.innerHTML += productArticle;
    });
  }

  getProducts();
  productListUi();
});
