const API_URL = 'https://6937071cf8dc350aff3320d0.mockapi.io';

$(document).ready(function() {
    initializeDefaultUsers();
});

async function initializeDefaultUsers() {
    try {
        const response = await $.get(`${API_URL}/users`);
        if (response.length === 0) {
            await $.ajax({
                url: `${API_URL}/users`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    name: "Admin User",
                    email: "admin@gmail.com",
                    password: "123456"
                })
            });
        }
    } catch (error) {
        console.error('Error initializing users:', error);
    }
}

$('#loginForm').on('submit', async function(e) {
    e.preventDefault();
    
    const email = $('#loginEmail').val();
    const password = $('#loginPassword').val();
    
    try {
        const users = await $.get(`${API_URL}/users`);
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            showAlert('Đăng nhập thành công! Đang chuyển hướng...', 'success');
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            showAlert('Email hoặc mật khẩu không đúng!', 'danger');
        }
    } catch (error) {
        showAlert('Lỗi kết nối! Vui lòng thử lại.', 'danger');
    }
});

function showAlert(message, type) {
    const alertHtml = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    $('#alertContainer').html(alertHtml);
}
