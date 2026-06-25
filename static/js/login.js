const cardWrapper = document.getElementById('cardWrapper');
const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

// 1. फ्लिप ट्रांजिशन ट्रिगर
toRegister.addEventListener('click', () => {
    cardWrapper.classList.add('flipped');
    getNewCaptcha(); // फ्लिप होते ही नया कैप्चा लोड करो
});

toLogin.addEventListener('click', () => {
    cardWrapper.classList.remove('flipped');
});

// 2. कैप्चा लोड करने का फंक्शन
function getNewCaptcha() {
    fetch('/api/generate-captcha')
        .then(res => res.json())
        .then(data => {
            document.getElementById('captchaQuestion').innerText = data.question;
        });
}

// 3. लॉगिन फॉर्म सबमिशन (इसमें रीडायरेक्ट लॉजिक जुड़ा हुआ है)
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const mobile = document.getElementById('loginMobile').value;
    const password = document.getElementById('loginPassword').value;
    const alertBox = document.getElementById('loginAlert');

    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile, password: password })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            alertBox.className = "alert-box alert-success";
            alertBox.innerText = data.message;
            
            // लॉगिन सफल होने पर 1.5 सेकंड बाद डैशबोर्ड पेज खुल जाएगा
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 1500);
        } else {
            alertBox.className = "alert-box alert-danger";
            alertBox.innerText = data.message;
        }
    });
});

// 4. रजिस्ट्रेशन फॉर्म सबमिशन
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const mobile = document.getElementById('regMobile').value;
    const password = document.getElementById('regPassword').value;
    const captcha = document.getElementById('regCaptcha').value;
    const alertBox = document.getElementById('regAlert');

    fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobile, password: password, captcha: captcha })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            alertBox.className = "alert-box alert-success";
            alertBox.innerText = data.message;
            document.getElementById('registerForm').reset();
            setTimeout(() => {
                cardWrapper.classList.remove('flipped'); // वापस लॉगिन पर भेजें
                alertBox.style.display = 'none';
            }, 2000);
        } else {
            alertBox.className = "alert-box alert-danger";
            alertBox.innerText = data.message;
            getNewCaptcha(); // फेल होने पर कैप्चा बदलें
            document.getElementById('regCaptcha').value = '';
        }
    });
});
