import React from "react";

export default function RecentlyViewedProducts(props) {
  const products = props.products;
  const currency = props.currency;
  const titleSize = props.sectionTitleSize;
  const productTitleSize = props.productTitleSize;
  const titleClass =
    titleDisplay(products) + " recently-viewed-heading " + titleSize;
  const btnClasses = "button button--full-width " + props.buttonClass;
  return (
    <div className="recently-viewed-section-container">
      <div className={titleClass}>{props.sectionTitle}</div>
      <div className="recently-viewed-container">
        {products.map((product) => (
          <div key={product.id} className="recently-viewed-item">
            <a href={"/products/" + product.handle} className="no-a-style">
              <img src={product.featured_image} alt={product.title} />
              <h3 className={productTitleSize}>{product.title}</h3>
              <p className={"recently-viewed-price"}>
                {currency} {(Math.round(product.price) / 100).toFixed(2)}
              </p>
            </a>
            <button onClick={() => addToCart(product)} className={btnClasses}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

//function for add to cart button
const addToCart = (product) => {
  let productId = product.variants[0].id;
  // Add to cart functionality
  fetch("/cart/add.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items: [{ id: productId, quantity: 1 }] }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Product added to cart:", data);
      window.location.href = "/cart"; // Redirect to cart page
    })
    .catch((error) => console.error("Error adding product to cart:", error));
};

// function to hide title when list is empty, first product view
const titleDisplay = (products) => {
  let count = Object.keys(products).length;
  if (count > 0) {
    return "title-display";
  } else {
    return "title-not-display";
  }
};
