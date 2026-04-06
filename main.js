
// 구글 앱스 스크립트 웹 앱 URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKEaRAiZVfx_TXBzYHYBKnEJABK1NoZg-SB4PK-gESyLKmDdCYCJ_hKxOrtp1e25BxpQ/exec';

// Navigation Logic
const navItems = document.querySelectorAll('.nav-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('current-page-title');

function showSection(targetId) {
    contentSections.forEach(section => {
        section.classList.remove('active');
        if (section.id === targetId) {
            section.classList.add('active');
        }
    });

    navItems.forEach(nav => {
        nav.classList.remove('active');
        if (nav.getAttribute('href') === `#${targetId}`) {
            nav.classList.add('active');
        }
    });

    const activeNav = document.querySelector(`.nav-item[href="#${targetId}"]`);
    if (activeNav) {
        pageTitle.textContent = activeNav.querySelector('span').textContent;
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = item.getAttribute('href').substring(1);
        showSection(targetId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Auth Toggle Logic
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');

if (showSignup) {
    showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('signup');
    });
}

if (showLogin) {
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showSection('login');
    });
}

// UI State Update
const CURRENT_USER_KEY = 'mungmung_current_user';

function updateAuthStateUI() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    const navLogin = document.getElementById('nav-login');
    const userInfoSidebar = document.getElementById('user-info-sidebar');
    const loggedInUserSpan = document.getElementById('logged-in-user');
    const headerUserText = document.getElementById('header-user-text');

    if (currentUser) {
        if (navLogin) navLogin.style.display = 'none';
        if (userInfoSidebar) userInfoSidebar.style.display = 'block';
        if (loggedInUserSpan) loggedInUserSpan.textContent = currentUser.name;
        if (headerUserText) headerUserText.textContent = `${currentUser.name}님`;
    } else {
        if (navLogin) navLogin.style.display = 'flex';
        if (userInfoSidebar) userInfoSidebar.style.display = 'none';
        if (headerUserText) headerUserText.textContent = '비회원';
    }
}

// Sign Up Form (Google Sheets 연동)
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const name = document.getElementById('signup-name-input').value;
        const password = document.getElementById('signup-password').value;
        const confirmPw = document.getElementById('signup-password-confirm').value;

        if (password !== confirmPw) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        const submitBtn = signupForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = '가입 신청 중...';

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'signup',
                    username,
                    name,
                    password
                })
            });
            const result = await response.json();

            if (result.result === 'success') {
                alert('회원가입 신청이 완료되었습니다! 관리자의 승인 후 로그인이 가능합니다.');
                showSection('login');
            } else {
                alert(result.msg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('가입 신청 중 오류가 발생했습니다. (URL 설정을 확인하세요)');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '회원가입';
        }
    });
}

// Login Form (Google Sheets 연동)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const submitBtn = loginForm.querySelector('button');
        submitBtn.disabled = true;
        submitBtn.textContent = '로그인 중...';

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                body: JSON.stringify({
                    action: 'login',
                    username,
                    password
                })
            });
            const result = await response.json();

            if (result.result === 'success') {
                const userName = result.name || username;
                localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ username, name: userName }));
                alert(`${userName}님, 환영합니다!`);
                updateAuthStateUI();
                showSection('home');
            } else if (result.result === 'pending') {
                alert('아직 관리자의 승인을 기다리는 중입니다. 잠시만 기다려 주세요!');
            } else {
                alert(result.msg || '아이디 또는 비밀번호가 틀렸습니다.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('로그인 중 오류가 발생했습니다.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = '로그인';
        }
    });
}

// Logout Logic
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem(CURRENT_USER_KEY);
        alert('로그아웃 되었습니다.');
        updateAuthStateUI();
        showSection('home');
    });
}

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    if (themeToggle) themeToggle.textContent = '라이트 모드';
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        
        let theme = 'light';
        if (body.classList.contains('dark-mode')) {
            theme = 'dark';
            themeToggle.textContent = '라이트 모드';
        } else {
            themeToggle.textContent = '다크 모드';
        }
        localStorage.setItem('theme', theme);
    });
}

updateAuthStateUI();
