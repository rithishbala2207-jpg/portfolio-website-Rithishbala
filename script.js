// Typing Animation
const texts = [
    "Software Developer",
    "AI Enthusiast",
    "Data Science Student",
    "Problem Solver"
];

let count = 0;
let index = 0;
let currentText = "";
let letter = "";
let isDeleting = false;

function type() {
    if (count === texts.length) {
        count = 0;
    }

    currentText = texts[count];

    if (isDeleting) {
        letter = currentText.slice(0, --index);
    } else {
        letter = currentText.slice(0, ++index);
    }

    document.getElementById('typewriter').textContent = letter;

    let typeSpeed = 100;

    if (isDeleting) {
        typeSpeed /= 2;
    }

    if (!isDeleting && letter.length === currentText.length) {
        typeSpeed = 2000; // Wait before deleting
        isDeleting = true;
    } else if (isDeleting && letter.length === 0) {
        isDeleting = false;
        count++;
        typeSpeed = 500; // Wait before typing new word
    }

    setTimeout(type, typeSpeed);
}

// Particle Background
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 10000;

    // adjust for mobile
    if (window.innerWidth < 768) {
        numberOfParticles = numberOfParticles / 2;
    }

    const colors = ['#00f0ff', '#0088ff', '#ff00e6', '#ffffff'];

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 2) + 0.5;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 1) - 0.5;
        let directionY = (Math.random() * 1) - 0.5;
        let color = colors[Math.floor(Math.random() * colors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    connect();
}

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 15000);
                // line properties
                ctx.strokeStyle = `rgba(255, 255, 255, ${opacityValue * 0.1})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('resize', function () {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    init();
});

// Navigation scroll effect
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active link highlighting
    let current = '';
    const sections = document.querySelectorAll('section');

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    const navLinks = document.querySelectorAll('.nav-links li a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li a');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
});

navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navLinks.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
});

// Form Submission via EmailJS
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent page reload
    const btn = this.querySelector('.submit-btn');
    const originalText = btn.innerHTML;

    // Check if EmailJS is loaded
    if (typeof emailjs === 'undefined') {
        alert("Email service isn't loaded properly. Please try again later.");
        return;
    }

    btn.innerHTML = 'Sending... <i class="fas fa-circle-notch fa-spin"></i>';
    btn.disabled = true;

    // Send using EmailJS sendForm
    // Service ID: service_6rz9ycn, Template ID: template_c6tlx1q
    // 'this' refers to the form element where the event listener is attached
    emailjs.sendForm('service_6rz9ycn', 'template_c6tlx1q', this)
        .then(function (response) {
            console.log('SUCCESS!', response.status, response.text);

            // Success feedback
            btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            btn.style.background = 'linear-gradient(45deg, #00b09b, #96c93d)';
            alert('Thank you! Your message has been sent successfully.');

            // Reset form
            document.getElementById('contactForm').reset();

            // Restore button after 3 seconds
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);

        }, function (error) {
            console.error('FAILED...', error); // Exact error logged here
            
            // Error feedback
            btn.innerHTML = 'Failed to Send <i class="fas fa-times"></i>';
            btn.style.background = 'linear-gradient(45deg, #ff416c, #ff4b2b)';
            
            // Show more specific error in alert for debugging
            alert('Oops! Something went wrong while sending the message.\nError: ' + (error.text || JSON.stringify(error)));

            // Restore button
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        });
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    init();
    animate();
    setTimeout(type, 1000);
});
