const API_URL = 'https://6937071cf8dc350aff3320d0.mockapi.io';

// Password strength indicator
$('#registerPassword').on('input', function() {
    const password = $(this).val();
    const strength = $('#passwordStrength');
    
    if (password.length === 0) {
        strength.css({width: '0%', background: ''});
    } else if (password.length < 6) {
        strength.css({width: '33%', background: '#dc3545'});
    } else if (password.length < 10) {
        strength.css({width: '66%', background: '#ffc107'});
    } else {
        strength.css({width: '100%', background: '#28a745'});
    }
});

$('#registerForm').on('submit', async function(e) {
    e.preventDefault();
    
    const name = $('#registerName').val();
    const email = $('#registerEmail').val();
    const password = $('#registerPassword').val();
    const confirmPassword = $('#confirmPassword').val();
    
    // Validate password match
    if (password !== confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp!', 'danger');
        return;
    }
    
    try {
        // Check if email exists
        const users = await $.get(`${API_URL}/users`);
        const existingUser = users.find(u => u.email === email);
        
        if (existingUser) {
            showAlert('Email này đã được đăng ký!', 'danger');
            return;
        }
        
        // Create new user
        await $.ajax({
            url: `${API_URL}/users`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                name: name,
                email: email,
                password: password
            })
        });
        
        showAlert('Đăng ký thành công! Đang chuyển đến trang đăng nhập...', 'success');
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
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
