import React from "react";
import ReactDOM from "react-dom/client";
import RecentlyViewedProducts from "./Components/RecentlyViewed";
// assigning the max limit of the products to 4
const limit = 4;
const upperLimit = limit + 1;

// finding if the viewed products are less than limit
let underLimit = JSON.parse(localStorage.getItem("underLimit")) || true;
//getting the array of products from local storage
let recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

let addProduct = (product) => {
  if (!recentlyViewed.some((item) => item.id === product.id)) {
    if (recentlyViewed.length >= upperLimit) {
      recentlyViewed.pop(); // if exceeds limit, remove the last entry
    }
    recentlyViewed.unshift(product); // adding the viewed product as the first entry
    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed)); //setting the new array of products to local storage
  }
};
if (recentlyViewed.length > limit) {
  // flag for fetching recommendations
  underLimit = false;
  localStorage.setItem("underLimit", underLimit);
}
// function to fetch recommendations if fewer than 4 recently viewed products
const fetchRecommendations = async () => {
  const response = await fetch(
    window.Shopify.routes.root +
      "recommendations/products.json?product_id=" +
      productObject.id +
      "&limit=" +
      (upperLimit - recentlyViewed.length) +
      "&intent=related"
  );
  const recommendedProducts = await response.json();
  return recommendedProducts.products;
};
// function to render the recently viewed products
const renderRecentlyViewed = async () => {
  const container = document.getElementById("recently-viewed-products");
  if (recentlyViewed.length < upperLimit && recentlyViewed.length != 0) {
    const recommendedProducts = await fetchRecommendations();
    recentlyViewed = recentlyViewed.concat(recommendedProducts);
  }
  // ensure we only display up to 4 products
  let productsToDisplay;
  if (underLimit) {
    productsToDisplay = recentlyViewed.slice(1, upperLimit); // for list with recommendations
  } else {
    productsToDisplay = recentlyViewed.slice(0, limit); // for list with only recently viewed
  }
  //the component call
  const root = ReactDOM.createRoot(container);
  if (root) {
    root.render(
      <RecentlyViewedProducts
        products={productsToDisplay}
        currency={currencySymbol}
        sectionTitle={titleText}
        sectionTitleSize={titleTextSize}
        buttonClass={buttonClass}
        productTitleSize={productTitleSize}
      />
    );
  }
};
// initialize the recently viewed products section
renderRecentlyViewed();
// calling the add product function
addProduct(productObject);
