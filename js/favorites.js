const API_URL = 'https://6937071cf8dc350aff3320d0.mockapi.io';
let tours = [];
let currentUser = null;
let favorites = [];

$(document).ready(function() {
    checkAuth();
    loadData();
    
    $('#logoutBtn').on('click', logout);
});

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    currentUser = JSON.parse(user);
    $('#userInfo').html(`<i class="fas fa-user me-1"></i>${currentUser.name}`);
}

async function loadData() {
    try {
        tours = await $.get(`${API_URL}/tours`);
        loadFavorites();
        renderFavorites();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

function loadFavorites() {
    const stored = localStorage.getItem(`favorites_${currentUser.id}`);
    favorites = stored ? JSON.parse(stored) : [];
}

function saveFavorites() {
    localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
}

function renderFavorites() {
    if (favorites.length === 0) {
        $('#favoriteList').html(`
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-heart-broken"></i>
                    <h3>Chưa có tour yêu thích</h3>
                    <p class="text-muted mb-4">Hãy khám phá và thêm các tour bạn yêu thích vào danh sách</p>
                    <a href="index.html" class="btn-browse">
                        <i class="fas fa-search me-2"></i>Khám phá tour
                    </a>
                </div>
            </div>
        `);
        return;
    }
    
    const favoriteTours = tours.filter(t => favorites.includes(t.id));
    
    let html = '';
    favoriteTours.forEach(tour => {
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="tour-card">
                    <img src="${tour.image}" class="tour-image" alt="${tour.name}">
                    <div class="tour-body">
                        <h5 class="tour-title">${tour.name}</h5>
                        <p class="tour-location">
                            <i class="fas fa-map-marker-alt me-1"></i>${tour.location}
                        </p>
                        <div class="tour-info">
                            <span class="text-muted">
                                <i class="fas fa-clock me-1"></i>${tour.duration}
                            </span>
                            <span class="tour-price">${formatPrice(tour.price)}</span>
                        </div>
                        <p class="text-muted small mb-3">${tour.description}</p>
                        <div class="d-flex gap-2">
                            <button class="btn btn-remove flex-fill" onclick="removeFavorite('${tour.id}')">
                                <i class="fas fa-trash me-1"></i>Xóa
                            </button>
                            <button class="btn btn-book flex-fill" onclick="bookTour('${tour.id}')">
                                <i class="fas fa-ticket-alt me-1"></i>Đặt tour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    $('#favoriteList').html(html);
}

function removeFavorite(tourId) {
    const index = favorites.indexOf(tourId);
    if (index > -1) {
        favorites.splice(index, 1);
        saveFavorites();
        renderFavorites();
    }
}

function bookTour(tourId) {
    const tour = tours.find(t => t.id === tourId);
    alert(`Đặt tour thành công!\n\nTour: ${tour.name}\nGiá: ${formatPrice(tour.price)}\n\nCảm ơn bạn đã sử dụng dịch vụ!`);
}

function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND' 
    }).format(price);
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

window.removeFavorite = removeFavorite;
window.bookTour = bookTour;
