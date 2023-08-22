const btn = document.getElementById("button-toggle");
btn.addEventListener("click", function () {
  const sidebar = document.querySelector(".sidebar");
  const content = document.getElementById("content");

  sidebar.classList.toggle("d-none"); // Hiển thị/ẩn sidebar
  content.classList.toggle("col-12"); // Điều chỉnh kích thước nội dung chính
});

document.addEventListener("DOMContentLoaded", function () {
  loadUsers();
});

function loadUsers() {
  // localStorage.clear();
  const usersData = localStorage.getItem("users");
  if (usersData) {
    const users = JSON.parse(usersData);
    const tbody = document.querySelector("#userTable tbody");

    tbody.innerHTML = ""; // Xóa dữ liệu cũ trong tbody
    let index = 1;
    users.forEach(function (user, index) {
      const row = `
        <tr>
          <td>${index + 1}</td>
          <td>${user.fullname}</td>
          <td>${user.email}</td>
          <td><img src="${user.avatar}" width="30" height="30" alt=""></td>
          <td><button type="button" class="btn btn-warning">Edit</button></td>
          <td><button type="button" class="btn btn-danger"
          onclick="deleteUser('${user.email}')">Delete</button>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
  }
}

function deleteUser(email) {
  const userData = JSON.parse(localStorage.getItem("users")) || [];

  // Lọc ra dữ liệu mới sau khi xóa người dùng có email tương ứng
  const updatedUserData = userData.filter(function (user) {
    return user.email !== email;
  });

  // Cập nhật dữ liệu mới vào local storage
  localStorage.setItem("users", JSON.stringify(updatedUserData));

  // Load lại dữ liệu lên bảng
  loadUsers();
}
document.addEventListener("DOMContentLoaded", function () {
  loadUsers();

  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm === "") {
      loadUsers(); // Nếu ô tìm kiếm trống, hiển thị lại tất cả người dùng
      return;
    }

    const usersData = localStorage.getItem("users");
    if (usersData) {
      const users = JSON.parse(usersData);
      const filteredUsers = users.filter(function (user) {
        return (
          user.fullname.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)
        );
      });

      const tbody = document.querySelector("#userTable tbody");
      tbody.innerHTML = ""; // Xóa dữ liệu cũ trong tbody

      filteredUsers.forEach(function (user, index) {
        const row = `
          <tr>
            <td>${index + 1}</td>
            <td>${user.fullname}</td>
            <td>${user.email}</td>
            <td><img src="${user.avatar}" width="30" height="30" alt=""></td>
            <td><button type="button" class="btn btn-warning">Edit</button></td>
            <td> <button type="button" class="btn btn-danger" onclick="deleteUser('${
              user.email
            }')">Delete</button></td>
          </tr>
        `;
        tbody.insertAdjacentHTML("beforeend", row);
      });
    }
  });
});
