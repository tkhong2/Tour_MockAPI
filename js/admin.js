const API_URL = 'https://6937071cf8dc350aff3320d0.mockapi.io';
let tours = [];
let currentUser = null;
let editingTourId = null;

$(document).ready(function() {
    checkAuth();
    loadTours();
    
    // Event listeners
    $('#saveTourBtn').on('click', saveTour);
    $('#addTourBtn').on('click', resetForm);
    $('#logoutBtn').on('click', logout);
    $('#searchTour').on('keyup', searchTours);
});

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = JSON.parse(user);
    $('#adminName').text(currentUser.name);
}

async function loadTours() {
    try {
        tours = await $.get(`${API_URL}/tours`);
        renderTours();
        updateStats();
    } catch (error) {
        console.error('Error loading tours:', error);
        showToast('Lỗi khi tải dữ liệu!');
    }
}

function renderTours(toursToRender = null) {
    const tourList = toursToRender || tours;
    let html = '';
    
    tourList.forEach(tour => {
        html += `
            <tr>
                <td><strong>#${tour.id}</strong></td>
                <td>
                    <img src="${tour.image}" class="tour-img-small" alt="${tour.name}">
                </td>
                <td>
                    <strong>${tour.name}</strong>
                    ${tour.badge ? `<span class="badge bg-danger ms-2">${tour.badge}</span>` : ''}
                </td>
                <td><i class="fas fa-map-marker-alt text-primary me-1"></i>${tour.location}</td>
                <td><i class="fas fa-clock text-info me-1"></i>${tour.duration}</td>
                <td><span class="price-badge">${formatPrice(tour.price)}</span></td>
                <td class="text-center">
                    <button class="btn btn-action btn-edit" onclick="editTour(${tour.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-action btn-delete" onclick="deleteTour(${tour.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    $('#tourTableBody').html(html || '<tr><td colspan="7" class="text-center py-4"><i class="fas fa-inbox fa-3x text-muted mb-3"></i><h5>Chưa có tour nào</h5></td></tr>');
}

function resetForm() {
    editingTourId = null;
    $('#tourForm')[0].reset();
    $('#tourId').val('');
    $('#tourModalTitle').html('<i class="fas fa-plus-circle me-2"></i>Thêm Tour Mới');
}

async function saveTour() {
    const id = $('#tourId').val();
    const tourData = {
        name: $('#tourName').val(),
        location: $('#tourLocation').val(),
        region: $('#tourRegion').val(),
        duration: $('#tourDuration').val(),
        price: parseInt($('#tourPrice').val()),
        image: $('#tourImage').val(),
        description: $('#tourDescription').val(),
        badge: $('#tourBadge').val()
    };
    
    try {
        if (id) {
            await $.ajax({
                url: `${API_URL}/tours/${id}`,
                method: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(tourData)
            });
            showToast('Cập nhật tour thành công!');
        } else {
            await $.ajax({
                url: `${API_URL}/tours`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(tourData)
            });
            showToast('Thêm tour mới thành công!');
        }
        
        await loadTours();
        $('#tourModal').modal('hide');
        resetForm();
    } catch (error) {
        showToast('Lỗi khi lưu tour!');
    }
}

function editTour(id) {
    const tour = tours.find(t => t.id === id);
    if (!tour) return;
    
    editingTourId = id;
    $('#tourModalTitle').html('<i class="fas fa-edit me-2"></i>Chỉnh Sửa Tour');
    $('#tourId').val(tour.id);
    $('#tourName').val(tour.name);
    $('#tourLocation').val(tour.location);
    $('#tourRegion').val(tour.region);
    $('#tourDuration').val(tour.duration);
    $('#tourPrice').val(tour.price);
    $('#tourImage').val(tour.image);
    $('#tourDescription').val(tour.description);
    $('#tourBadge').val(tour.badge || '');
    
    $('#tourModal').modal('show');
}

async function deleteTour(id) {
    if (!confirm('Bạn có chắc muốn xóa tour này?')) return;
    
    try {
        await $.ajax({
            url: `${API_URL}/tours/${id}`,
            method: 'DELETE'
        });
        
        showToast('Xóa tour thành công!');
        await loadTours();
    } catch (error) {
        showToast('Lỗi khi xóa tour!');
    }
}

function searchTours() {
    const keyword = $('#searchTour').val().toLowerCase();
    
    if (!keyword) {
        renderTours();
        return;
    }
    
    const filtered = tours.filter(tour => 
        tour.name.toLowerCase().includes(keyword) ||
        tour.location.toLowerCase().includes(keyword) ||
        tour.description.toLowerCase().includes(keyword)
    );
    
    renderTours(filtered);
}

function updateStats() {
    $('#totalTours').text(tours.length);
    $('#activeTours').text(tours.length);
    
    // Count total favorites from all users
    let totalFavs = 0;
    for (let key in localStorage) {
        if (key.startsWith('favorites_')) {
            const favs = JSON.parse(localStorage.getItem(key) || '[]');
            totalFavs += favs.length;
        }
    }
    $('#totalFavorites').text(totalFavs);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(price);
}

function showToast(message) {
    $('#toastMessage').text(message);
    const toast = new bootstrap.Toast($('#liveToast'));
    toast.show();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Make functions global
window.editTour = editTour;
window.deleteTour = deleteTour;
