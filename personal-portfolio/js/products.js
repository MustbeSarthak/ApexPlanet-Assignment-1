// Product data and filtering behaviour for the listing page.
(function () {
  "use strict";

  var products = [
    { id: 1, name: "Focus Notebook", category: "Stationery", price: 12, rating: 4.8, image: "📓", color: "#dce9ff" },
    { id: 2, name: "Desk Lamp", category: "Workspace", price: 38, rating: 4.6, image: "💡", color: "#fff0c7" },
    { id: 3, name: "Daily Planner", category: "Stationery", price: 18, rating: 4.7, image: "🗓️", color: "#e5dcff" },
    { id: 4, name: "Wireless Headphones", category: "Tech", price: 79, rating: 4.5, image: "🎧", color: "#d9f4ed" },
    { id: 5, name: "Travel Mug", category: "Lifestyle", price: 24, rating: 4.4, image: "☕", color: "#ffe0dc" },
    { id: 6, name: "Mechanical Keyboard", category: "Tech", price: 95, rating: 4.9, image: "⌨️", color: "#dce9ff" },
    { id: 7, name: "Canvas Backpack", category: "Lifestyle", price: 52, rating: 4.3, image: "🎒", color: "#e8e4d6" },
    { id: 8, name: "Cable Organiser", category: "Workspace", price: 9, rating: 4.2, image: "🔌", color: "#d9f4ed" },
    { id: 9, name: "Reading Light", category: "Workspace", price: 28, rating: 4.6, image: "🔦", color: "#fff0c7" },
    { id: 10, name: "Sketch Pad", category: "Stationery", price: 15, rating: 4.5, image: "🎨", color: "#ffe0dc" },
    { id: 11, name: "Smart Watch", category: "Tech", price: 120, rating: 4.1, image: "⌚", color: "#e5dcff" },
    { id: 12, name: "Plant Pot", category: "Lifestyle", price: 21, rating: 4.8, image: "🪴", color: "#d9f4ed" }
  ];

  var categoryFilter = document.getElementById("categoryFilter");
  var searchInput = document.getElementById("searchInput");
  var minPrice = document.getElementById("minPrice");
  var maxPrice = document.getElementById("maxPrice");
  var sortFilter = document.getElementById("sortFilter");
  var productGrid = document.getElementById("productGrid");
  var resultCount = document.getElementById("resultCount");
  var noProducts = document.getElementById("noProducts");

  Array.from(new Set(products.map(function (product) { return product.category; })))
    .sort()
    .forEach(function (category) {
      var option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });

  function getFilteredProducts() {
    var searchTerm = searchInput.value.trim().toLowerCase();
    var minimum = minPrice.value === "" ? 0 : Number(minPrice.value);
    var maximum = maxPrice.value === "" ? Infinity : Number(maxPrice.value);
    var filtered = products.filter(function (product) {
      return (categoryFilter.value === "all" || product.category === categoryFilter.value) &&
        product.price >= minimum &&
        product.price <= maximum &&
        product.name.toLowerCase().includes(searchTerm);
    });

    return filtered.sort(function (first, second) {
      if (sortFilter.value === "price-low") return first.price - second.price;
      if (sortFilter.value === "price-high") return second.price - first.price;
      if (sortFilter.value === "rating") return second.rating - first.rating;
      if (sortFilter.value === "name") return first.name.localeCompare(second.name);
      return first.id - second.id;
    });
  }

  function renderProducts() {
    var visibleProducts = getFilteredProducts();
    productGrid.textContent = "";
    resultCount.textContent = "Showing " + visibleProducts.length + " " +
      (visibleProducts.length === 1 ? "product" : "products");
    noProducts.hidden = visibleProducts.length !== 0;

    visibleProducts.forEach(function (product) {
      var card = document.createElement("article");
      card.className = "product-card";

      var image = document.createElement("div");
      image.className = "product-image";
      image.style.backgroundColor = product.color;
      image.setAttribute("role", "img");
      image.setAttribute("aria-label", product.name + " placeholder image");
      image.textContent = product.image;

      var content = document.createElement("div");
      content.className = "product-content";
      content.innerHTML = "<span class=\"product-category\">" + product.category +
        "</span><h2></h2><div class=\"product-meta\"><span class=\"product-price\">$" +
        product.price.toFixed(2) + "</span><span class=\"product-rating\" aria-label=\"" +
        product.rating + " out of 5 stars\">★ " + product.rating + "</span></div>";
      content.querySelector("h2").textContent = product.name;

      var button = document.createElement("button");
      button.className = "button button-primary product-button";
      button.type = "button";
      button.textContent = "View Details";
      button.addEventListener("click", function () {
        window.alert(product.name + " - $" + product.price.toFixed(2));
      });
      content.appendChild(button);
      card.appendChild(image);
      card.appendChild(content);
      productGrid.appendChild(card);
    });
  }

  [categoryFilter, searchInput, minPrice, maxPrice, sortFilter].forEach(function (control) {
    control.addEventListener("input", renderProducts);
    control.addEventListener("change", renderProducts);
  });

  document.getElementById("resetFilters").addEventListener("click", function () {
    categoryFilter.value = "all";
    searchInput.value = "";
    minPrice.value = "";
    maxPrice.value = "";
    sortFilter.value = "default";
    renderProducts();
  });

  document.getElementById("currentYear").textContent = new Date().getFullYear();
  renderProducts();
}());
