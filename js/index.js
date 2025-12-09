const API_URL = 'https://6937071cf8dc350aff3320d0.mockapi.io';
let tours = [];
let currentUser = null;
let favorites = [];
let currentFilter = 'all';

$(document).ready(function() {
    checkAuth();
    loadTours();
    loadFavorites();
    
    $('#logoutBtn').on('click', logout);
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        currentFilter = $(this).data('region');
        renderTours();
    });
    
    $('#searchInput').on('keyup', function(e) {
        if (e.key === 'Enter') {
            searchTours();
        }
    });
});

function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        // Hiển thị menu khi đã đăng nhập
        $('#userInfo').html(`<i class="fas fa-user me-1"></i>${currentUser.name}`);
        $('#userMenu').show();
        $('#logoutMenu').show();
        $('#adminMenu').show();
        $('#loginMenu').hide();
        $('#registerMenu').hide();
    } else {
        // Hiển thị menu khi chưa đăng nhập
        $('#userMenu').hide();
        $('#logoutMenu').hide();
        $('#adminMenu').hide();
        $('#loginMenu').show();
        $('#registerMenu').show();
    }
}

async function loadTours() {
    try {
        tours = await $.get(`${API_URL}/tours`);
        if (tours.length === 0) {
            await initializeDefaultTours();
            tours = await $.get(`${API_URL}/tours`);
        }
        renderTours();
    } catch (error) {
        console.error('Error loading tours:', error);
    }
}

async function initializeDefaultTours() {
    for (const tour of defaultTours) {
        await $.ajax({
            url: `${API_URL}/tours`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(tour)
        });
    }
}

function loadFavorites() {
    if (currentUser) {
        const stored = localStorage.getItem(`favorites_${currentUser.id}`);
        favorites = stored ? JSON.parse(stored) : [];
    } else {
        favorites = [];
    }
    updateFavCount();
}

function saveFavorites() {
    if (currentUser) {
        localStorage.setItem(`favorites_${currentUser.id}`, JSON.stringify(favorites));
    }
    updateFavCount();
}

function updateFavCount() {
    $('#favCount').text(favorites.length);
}

function renderTours() {
    let filtered = tours;
    
    if (currentFilter !== 'all') {
        filtered = tours.filter(t => t.region === currentFilter);
    }
    
    const keyword = $('#searchInput').val().toLowerCase();
    if (keyword) {
        filtered = filtered.filter(t => 
            t.name.toLowerCase().includes(keyword) ||
            t.location.toLowerCase().includes(keyword) ||
            t.description.toLowerCase().includes(keyword)
        );
    }
    
    if (filtered.length === 0) {
        $('#tourList').html(`
            <div class="col-12">
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h4>Không tìm thấy tour nào</h4>
                    <p class="text-muted">Vui lòng thử tìm kiếm với từ khóa khác</p>
                </div>
            </div>
        `);
        return;
    }
    
    let html = '';
    filtered.forEach(tour => {
        const isFavorite = favorites.includes(tour.id);
        html += `
            <div class="col-md-6 col-lg-4">
                <div class="tour-card">
                    <div style="position: relative;">
                        <img src="${tour.image}" class="tour-image" alt="${tour.name}">
                        ${tour.badge ? `<span class="tour-badge">${tour.badge}</span>` : ''}
                    </div>
                    <div class="tour-body">
                        <h5 class="tour-title">${tour.name}</h5>
                        <p class="tour-location">
                            <i class="fas fa-map-marker-alt me-1"></i>${tour.location}
                        </p>
                        <div class="tour-info">
                            <span class="tour-duration">
                                <i class="fas fa-clock me-1"></i>${tour.duration}
                            </span>
                            <span class="tour-price">${formatPrice(tour.price)}</span>
                        </div>
                        <p class="text-muted small">${tour.description}</p>
                        <div class="tour-actions">
                            <button class="btn btn-favorite ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${tour.id}')">
                                <i class="fas fa-heart"></i> ${isFavorite ? 'Đã thích' : 'Yêu thích'}
                            </button>
                            <button class="btn btn-book" onclick="bookTour('${tour.id}')">
                                <i class="fas fa-ticket-alt"></i> Đặt tour
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    $('#tourList').html(html);
}

function searchTours() {
    renderTours();
}

function toggleFavorite(tourId) {
    if (!currentUser) {
        alert('Vui lòng đăng nhập để sử dụng chức năng yêu thích!');
        window.location.href = 'login.html';
        return;
    }
    
    const index = favorites.indexOf(tourId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(tourId);
    }
    saveFavorites();
    renderTours();
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

window.toggleFavorite = toggleFavorite;
window.bookTour = bookTour;
window.searchTours = searchTours;
