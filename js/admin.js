const API_URL = "https://6937071cf8dc350aff3320d0.mockapi.io";
let tours = [];
let currentUser = null;
let editingTourId = null;

$(document).ready(function () {
  checkAuth();
  loadTours();

  // Event listeners
  $("#saveTourBtn").on("click", saveTour);
  $("#addTourBtn").on("click", resetForm);
  $("#logoutBtn").on("click", logout);
  $("#searchTour").on("keyup", searchTours);
});

// Kiểm tra đăng nhập
function checkAuth() {
  const user = localStorage.getItem("currentUser");
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  currentUser = JSON.parse(user);
  $("#adminName").text(currentUser.name);
}

// ========== CHỨC NĂNG ĐỌC (READ) ==========
async function loadTours() {
  try {
    // Hiển thị loading
    $("#tourTableBody").html(
      '<tr><td colspan="7" class="text-center py-4"><i class="fas fa-spinner fa-spin fa-2x text-primary"></i><p class="mt-2">Đang tải dữ liệu...</p></td></tr>'
    );

    tours = await $.get(`${API_URL}/tours`);
    renderTours();
    updateStats();
  } catch (error) {
    console.error("Error loading tours:", error);
    showToast("Lỗi khi tải dữ liệu!", "error");
    $("#tourTableBody").html(
      '<tr><td colspan="7" class="text-center py-4 text-danger"><i class="fas fa-exclamation-triangle fa-2x mb-2"></i><p>Không thể tải dữ liệu. Vui lòng thử lại!</p></td></tr>'
    );
  }
}

function renderTours(toursToRender = null) {
  const tourList = toursToRender || tours;
  let html = "";

  if (tourList.length === 0) {
    html =
      '<tr><td colspan="7" class="text-center py-4"><i class="fas fa-inbox fa-3x text-muted mb-3"></i><h5 class="text-muted">Chưa có tour nào</h5><p class="text-muted">Nhấn "Thêm Tour Mới" để bắt đầu</p></td></tr>';
  } else {
    tourList.forEach((tour) => {
      html += `
                <tr data-tour-id="${tour.id}">
                    <td><strong>#${tour.id}</strong></td>
                    <td>
                        <img src="${tour.image}" class="tour-img-small" alt="${
        tour.name
      }" 
                             onerror="this.src='https://via.placeholder.com/50x50?text=No+Image'">
                    </td>
                    <td>
                        <strong>${tour.name}</strong>
                        ${
                          tour.badge
                            ? `<span class="badge bg-danger ms-2">${tour.badge}</span>`
                            : ""
                        }
                    </td>
                    <td><i class="fas fa-map-marker-alt text-primary me-1"></i>${
                      tour.location
                    }</td>
                    <td><i class="fas fa-clock text-info me-1"></i>${
                      tour.duration
                    }</td>
                    <td><span class="price-badge">${formatPrice(
                      tour.price
                    )}</span></td>
                    <td class="text-center">
                        <button class="btn btn-action btn-info btn-view" onclick="viewTour(${
                          tour.id
                        })" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-action btn-edit" onclick="editTour(${
                          tour.id
                        })" title="Chỉnh sửa">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-action btn-delete" onclick="deleteTour(${
                          tour.id
                        })" title="Xóa">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
    });
  }

  $("#tourTableBody").html(html);
}

// ========== CHỨC NĂNG THÊM (CREATE) ==========
function resetForm() {
  editingTourId = null;
  $("#tourForm")[0].reset();
  $("#tourId").val("");
  $("#tourModalTitle").html(
    '<i class="fas fa-plus-circle me-2"></i>Thêm Tour Mới'
  );
  $("#saveTourBtn").html('<i class="fas fa-save me-2"></i>Lưu Tour');

  // Reset validation
  $("#tourForm").removeClass("was-validated");
  $(".form-control, .form-select").removeClass("is-invalid");
}

// ========== CHỨC NĂNG LƯU (CREATE & UPDATE) ==========
async function saveTour() {
  // Validate form
  const form = $("#tourForm")[0];
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    showToast("Vui lòng điền đầy đủ thông tin!", "warning");
    return;
  }

  const id = $("#tourId").val();
  const tourData = {
    name: $("#tourName").val().trim(),
    location: $("#tourLocation").val().trim(),
    region: $("#tourRegion").val(),
    duration: $("#tourDuration").val().trim(),
    price: parseInt($("#tourPrice").val()),
    image: $("#tourImage").val().trim(),
    description: $("#tourDescription").val().trim(),
    badge: $("#tourBadge").val().trim(),
  };

  // Disable button khi đang xử lý
  $("#saveTourBtn")
    .prop("disabled", true)
    .html('<i class="fas fa-spinner fa-spin me-2"></i>Đang xử lý...');

  try {
    if (id) {
      // CẬP NHẬT tour
      await $.ajax({
        url: `${API_URL}/tours/${id}`,
        method: "PUT",
        contentType: "application/json",
        data: JSON.stringify(tourData),
      });
      showToast("✓ Cập nhật tour thành công!", "success");
    } else {
      // THÊM MỚI tour
      await $.ajax({
        url: `${API_URL}/tours`,
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(tourData),
      });
      showToast("✓ Thêm tour mới thành công!", "success");
    }

    await loadTours();
    $("#tourModal").modal("hide");
    resetForm();
  } catch (error) {
    console.error("Error saving tour:", error);
    showToast("✗ Lỗi khi lưu tour! Vui lòng thử lại.", "error");
  } finally {
    $("#saveTourBtn")
      .prop("disabled", false)
      .html('<i class="fas fa-save me-2"></i>Lưu Tour');
  }
}

// ========== CHỨC NĂNG SỬA (UPDATE) ==========
function editTour(id) {
  const tour = tours.find((t) => t.id == id);
  if (!tour) {
    showToast("Không tìm thấy tour!", "error");
    return;
  }

  editingTourId = id;
  $("#tourModalTitle").html('<i class="fas fa-edit me-2"></i>Chỉnh Sửa Tour');
  $("#saveTourBtn").html('<i class="fas fa-save me-2"></i>Cập Nhật Tour');

  // Điền dữ liệu vào form
  $("#tourId").val(tour.id);
  $("#tourName").val(tour.name);
  $("#tourLocation").val(tour.location);
  $("#tourRegion").val(tour.region);
  $("#tourDuration").val(tour.duration);
  $("#tourPrice").val(tour.price);
  $("#tourImage").val(tour.image);
  $("#tourDescription").val(tour.description);
  $("#tourBadge").val(tour.badge || "");

  // Reset validation
  $("#tourForm").removeClass("was-validated");

  // Mở modal
  $("#tourModal").modal("show");
}

// ========== CHỨC NĂNG XEM CHI TIẾT ==========
function viewTour(id) {
  const tour = tours.find((t) => t.id == id);
  if (!tour) return;

  const modalContent = `
        <div class="modal fade" id="viewTourModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-info text-white">
                        <h5 class="modal-title"><i class="fas fa-info-circle me-2"></i>Chi Tiết Tour</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-5">
                                <img src="${
                                  tour.image
                                }" class="img-fluid rounded" alt="${tour.name}" 
                                     onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                            </div>
                            <div class="col-md-7">
                                <h3>${tour.name}</h3>
                                ${
                                  tour.badge
                                    ? `<span class="badge bg-danger mb-3">${tour.badge}</span>`
                                    : ""
                                }
                                <p><i class="fas fa-map-marker-alt text-primary me-2"></i><strong>Địa điểm:</strong> ${
                                  tour.location
                                }</p>
                                <p><i class="fas fa-map text-info me-2"></i><strong>Khu vực:</strong> ${getRegionName(
                                  tour.region
                                )}</p>
                                <p><i class="fas fa-clock text-warning me-2"></i><strong>Thời lượng:</strong> ${
                                  tour.duration
                                }</p>
                                <p><i class="fas fa-dollar-sign text-success me-2"></i><strong>Giá:</strong> <span class="text-danger fw-bold fs-5">${formatPrice(
                                  tour.price
                                )}</span></p>
                                <hr>
                                <p><strong>Mô tả:</strong></p>
                                <p class="text-muted">${tour.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-warning" onclick="$('#viewTourModal').modal('hide'); editTour(${
                          tour.id
                        })">
                            <i class="fas fa-edit me-2"></i>Chỉnh Sửa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

  // Xóa modal cũ nếu có
  $("#viewTourModal").remove();

  // Thêm modal mới và hiển thị
  $("body").append(modalContent);
  $("#viewTourModal").modal("show");
}

// ========== CHỨC NĂNG XÓA (DELETE) ==========
async function deleteTour(id) {
  const tour = tours.find((t) => t.id == id);
  if (!tour) return;

  // Hiển thị confirm modal
  const confirmDelete = confirm(
    `Bạn có chắc muốn xóa tour "${tour.name}"?\n\nHành động này không thể hoàn tác!`
  );

  if (!confirmDelete) return;

  // Thêm hiệu ứng loading cho row đang xóa
  $(`tr[data-tour-id="${id}"]`).css("opacity", "0.5");

  try {
    await $.ajax({
      url: `${API_URL}/tours/${id}`,
      method: "DELETE",
    });

    // Hiệu ứng fade out
    $(`tr[data-tour-id="${id}"]`).fadeOut(300, async function () {
      showToast("✓ Xóa tour thành công!", "success");
      await loadTours();
    });
  } catch (error) {
    console.error("Error deleting tour:", error);
    showToast("✗ Lỗi khi xóa tour! Vui lòng thử lại.", "error");
    $(`tr[data-tour-id="${id}"]`).css("opacity", "1");
  }
}

// ========== CHỨC NĂNG TÌM KIẾM ==========
function searchTours() {
  const keyword = $("#searchTour").val().toLowerCase().trim();

  if (!keyword) {
    renderTours();
    return;
  }

  const filtered = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(keyword) ||
      tour.location.toLowerCase().includes(keyword) ||
      tour.description.toLowerCase().includes(keyword) ||
      tour.region.toLowerCase().includes(keyword)
  );

  renderTours(filtered);

  // Hiển thị kết quả tìm kiếm
  if (filtered.length === 0) {
    $("#tourTableBody").html(`
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h5 class="text-muted">Không tìm thấy tour nào với từ khóa "${keyword}"</h5>
                    <button class="btn btn-primary mt-2" onclick="$('#searchTour').val(''); searchTours();">
                        <i class="fas fa-redo me-2"></i>Xem tất cả
                    </button>
                </td>
            </tr>
        `);
  }
}

// ========== CẬP NHẬT THỐNG KÊ ==========
function updateStats() {
  $("#totalTours").text(tours.length);
  $("#activeTours").text(tours.length);

  // Đếm tổng số lượt yêu thích
  let totalFavs = 0;
  for (let key in localStorage) {
    if (key.startsWith("favorites_")) {
      const favs = JSON.parse(localStorage.getItem(key) || "[]");
      totalFavs += favs.length;
    }
  }
  $("#totalFavorites").text(totalFavs);
}

// ========== HELPER FUNCTIONS ==========
function formatPrice(price) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

function getRegionName(region) {
  const regions = {
    "mien-bac": "Miền Bắc",
    "mien-trung": "Miền Trung",
    "mien-nam": "Miền Nam",
  };
  return regions[region] || region;
}

function showToast(message, type = "success") {
  const iconMap = {
    success: "fa-check-circle text-success",
    error: "fa-exclamation-circle text-danger",
    warning: "fa-exclamation-triangle text-warning",
    info: "fa-info-circle text-info",
  };

  const icon = iconMap[type] || iconMap.success;

  $("#liveToast .toast-header i").attr("class", `fas ${icon} me-2`);
  $("#toastMessage").text(message);

  const toast = new bootstrap.Toast($("#liveToast"));
  toast.show();
}

function logout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  }
}

// Làm cho các hàm có thể truy cập từ HTML
window.editTour = editTour;
window.deleteTour = deleteTour;
window.viewTour = viewTour;
