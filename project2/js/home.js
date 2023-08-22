const btn = document.getElementById("button-toggle");
btn.addEventListener("click", function () {
  const sidebar = document.querySelector(".sidebar");
  const content = document.getElementById("content");

  sidebar.classList.toggle("d-none"); // Hiển thị/ẩn sidebar
  content.classList.toggle("col-12"); // Điều chỉnh kích thước nội dung chính
});

const cartItems = []; // Mảng chứa các sản phẩm trong giỏ hàng

const updateCart = () => {
  const cartList = document.querySelector(".cart-items");
  cartList.innerHTML = "";
  let totalPrice = 0;

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="cart-item-name">${item.name}</span>
      <span class="cart-item-price">${item.price.toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })}</span>
      <div class="quantity-controls">
        <button class="quantity-button minus">-</button>
        <span class="quantity">${item.quantity}</span>
        <button class="quantity-button plus">+</button>
      </div>
    `;
    cartList.appendChild(li);
    totalPrice += item.price * item.quantity;
  });

  const totalPriceElement = document.querySelector(".total-price");
  totalPriceElement.textContent = `Tổng giá: ${totalPrice.toLocaleString(
    "vi-VN",
    {
      style: "currency",
      currency: "VND",
    }
  )}`;
};

// Thêm sự kiện cho nút cộng và trừ
document.addEventListener("click", (event) => {
  const target = event.target;

  if (target.classList.contains("quantity-button")) {
    const li = target.closest("li");
    const itemName = li.querySelector(".cart-item-name").textContent;
    const item = cartItems.find((item) => item.name === itemName);

    if (target.classList.contains("plus")) {
      item.quantity++;
    } else if (target.classList.contains("minus")) {
      item.quantity--;
      if (item.quantity <= 0) {
        cartItems.splice(cartItems.indexOf(item), 1);
      }
    }

    updateCart();
  }
});

// Hàm thêm sản phẩm vào giỏ hàng
const addProductToCart = (productName, productPrice) => {
  const existingItem = cartItems.find((item) => item.name === productName);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ name: productName, price: productPrice, quantity: 1 });
  }
  updateCart();
};

// Gọi hàm addProductToCart khi nhấn nút Mua trên mỗi sản phẩm
const buyButtons = document.querySelectorAll(".buy-button");
buyButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    const productName =
      document.querySelectorAll(".product-title")[index].textContent;
    const productPrice = parseFloat(
      document
        .querySelectorAll(".product-price")
        [index].textContent.replace("₫", "")
        .replace(/\./g, "")
        .replace(",", "")
    );
    addProductToCart(productName, productPrice);
  });
});
const cartContainer = document.querySelector(".cart-container");
const threshold = 200; // Vị trí cuộn đủ lớn để kích hoạt hành động của bạn

cartContainer.addEventListener("scroll", () => {
  if (cartContainer.scrollTop > threshold) {
    // Thực hiện hành động của bạn ở đây
    console.log("Đã cuộn đủ lớn để thực hiện hành động");
  }
});
