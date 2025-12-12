const API_URL = "https://6937071cf8dc350aff3320d0.mockapi.io";
let tours = [];

$(document).ready(function () {
  checkAuth();
  loadTours();

  $("#saveTourBtn").on("click", saveTour);
  $("#addTourBtn").on("click", resetForm);
  $("#logoutBtn").on("click", logout);
  $("#searchTour").on("keyup", searchTours);
});

function checkAuth() {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  $("#adminName").text(JSON.parse(user).name);
}

// ĐỌC - Tải danh sách tour
async function loadTours() {
  try {
    tours = await $.get(`${API_URL}/tours`);
    renderTours();
    updateStats();
  } catch (error) {
    showToast("Lỗi khi tải dữ liệu!");
  }
}

function renderTours(list = tours) {
  let html = "";

  list.forEach((tour) => {
    html += `
            <tr>
                <td>#${tour.id}</td>
                <td><img src="${tour.image}" class="tour-img-small" alt="${
      tour.name
    }"></td>
                <td>${tour.name} ${
      tour.badge ? `<span class="badge bg-danger">${tour.badge}</span>` : ""
    }</td>
                <td>${tour.location}</td>
                <td>${tour.duration}</td>
                <td>${formatPrice(tour.price)}</td>
                <td class="text-center">
                    <button class="btn btn-action btn-edit" onclick="editTour(${
                      tour.id
                    })">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteTour(${
                      tour.id
                    })">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
  });

  $("#tourTableBody").html(
    html || '<tr><td colspan="7" class="text-center">Chưa có tour nào</td></tr>'
  );
}

// THÊM / SỬA - Lưu tour
async function saveTour() {
  const id = $("#tourId").val();
  const data = {
    name: $("#tourName").val(),
    location: $("#tourLocation").val(),
    region: $("#tourRegion").val(),
    duration: $("#tourDuration").val(),
    price: parseInt($("#tourPrice").val()),
    image: $("#tourImage").val(),
    description: $("#tourDescription").val(),
    badge: $("#tourBadge").val(),
  };

  try {
    if (id) {
      // SỬA
      await $.ajax({
        url: `${API_URL}/tours/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(data),
      });
      showToast("Cập nhật thành công!");
    } else {
      // THÊM
      await $.ajax({
        url: `${API_URL}/tours`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(data),
      });
      showToast("Thêm tour thành công!");
    }

    $("#tourModal").modal("hide");
    loadTours();
  } catch (error) {
    showToast("Lỗi khi lưu!");
  }
}

// SỬA - Mở form chỉnh sửa
function editTour(id) {
  const tour = tours.find((t) => t.id == id);
  if (!tour) return;

  $("#tourId").val(tour.id);
  $("#tourName").val(tour.name);
  $("#tourLocation").val(tour.location);
  $("#tourRegion").val(tour.region);
  $("#tourDuration").val(tour.duration);
  $("#tourPrice").val(tour.price);
  $("#tourImage").val(tour.image);
  $("#tourDescription").val(tour.description);
  $("#tourBadge").val(tour.badge || "");
  $("#tourModalTitle").html('<i class="fas fa-edit me-2"></i>Sửa Tour');

  $("#tourModal").modal("show");
}

// XÓA - Xóa tour
async function deleteTour(id) {
  if (!confirm("Bạn có chắc muốn xóa?")) return;

  try {
    await $.ajax({
      url: `${API_URL}/tours/${id}`,
      method: "DELETE",
    });
    showToast("Xóa thành công!");
    loadTours();
  } catch (error) {
    showToast("Lỗi khi xóa!");
  }
}

// Reset form
function resetForm() {
  $("#tourForm")[0].reset();
  $("#tourId").val("");
  $("#tourModalTitle").html(
    '<i class="fas fa-plus-circle me-2"></i>Thêm Tour Mới'
  );
}

// Tìm kiếm
function searchTours() {
  const keyword = $("#searchTour").val().toLowerCase();
  const filtered = tours.filter(
    (t) =>
      t.name.toLowerCase().includes(keyword) ||
      t.location.toLowerCase().includes(keyword)
  );
  renderTours(filtered);
}

// Cập nhật thống kê
function updateStats() {
  $("#totalTours").text(tours.length);
  $("#activeTours").text(tours.length);

  let totalFavs = 0;
  for (let key in localStorage) {
    if (key.startsWith("favorites_")) {
      totalFavs += JSON.parse(localStorage.getItem(key) || "[]").length;
    }
  }
  $("#totalFavorites").text(totalFavs);
}

// Helper functions
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function showToast(message) {
  $("#toastMessage").text(message);
  new bootstrap.Toast($("#liveToast")).show();
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

window.editTour = editTour;
window.deleteTour = deleteTour;
