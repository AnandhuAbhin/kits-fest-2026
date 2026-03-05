// Force scroll to top on refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Initialize Lenis for Smooth Scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
})

function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor (Only active on desktop)
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');
const hoverTargets = document.querySelectorAll('.hover-target, a, button');

if (window.matchMedia("(pointer: fine)").matches) {
    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0,
            ease: 'none'
        });

        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: 'power2.out'
        });
    });

    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            cursorFollower.classList.add('active');
            cursor.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        target.addEventListener('mouseleave', () => {
            cursorFollower.classList.remove('active');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// Preloader Animation
window.addEventListener('load', () => {
    const preloaderText = document.querySelector('.preloader-text');
    const progressBar = document.querySelector('.progress-bar');
    const progressPercent = document.querySelector('.progress-percent');

    // Animate progress bar from 0 to 100%
    let progress = { value: 0 };
    gsap.to(progress, {
        value: 100,
        duration: 2.5,
        ease: 'power2.inOut',
        onUpdate: () => {
            if (progressBar && progressPercent) {
                progressBar.style.width = `${progress.value}%`;
                progressPercent.textContent = `${Math.round(progress.value)}%`;
            }
        },
        onComplete: () => {
            if (preloaderText) {
                preloaderText.textContent = "SIEGE";
                preloaderText.setAttribute("data-text", "SIEGE ");
            }

            const tl = gsap.timeline({ delay: 0.2 });

            tl.to(['.preloader-content', '.preloader-img'], {
                opacity: 0,
                y: -30,
                duration: 0.6,
                ease: 'power3.inOut'
            })
                .to('.preloader', {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut'
                }, '-=0.2')
                .from('.hero-badge', {
                    opacity: 0,
                    y: 20,
                    duration: 0.6,
                    ease: 'power3.out'
                }, '-=0.4')
                .from('.hero-title', {
                    opacity: 0,
                    y: 80,
                    stagger: 0.15,
                    duration: 1,
                    ease: 'power4.out',
                    clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
                }, '-=0.5')
                .to('.hero-title', {
                    clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
                    duration: 1,
                    ease: 'power4.out',
                    stagger: 0.15
                }, '<')
                .from('.hero-desc', {
                    opacity: 0,
                    y: 20,
                    duration: 0.8
                }, '-=0.4')
                .from('.cta-actions', {
                    opacity: 0,
                    y: 20,
                    duration: 0.8
                }, '-=0.6')
                .add(() => {
                    document.body.classList.remove('loading');
                });
        }
    });
});

// Canvas Background (Upside Down spores effect)
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const isMobile = window.innerWidth <= 768;
const particleCount = isMobile ? 60 : 120; // Fewer particles on mobile for performance

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', initCanvas);
initCanvas();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * (isMobile ? 1.5 : 2);
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4 - 0.3; // Drift upwards
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.8 ? '255, 170, 0' : '255, 0, 60'; // Mix of Theyyam gold and red
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.y < 0) {
            this.y = height;
            this.x = Math.random() * width;
        }
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
    }

    draw() {
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    requestAnimationFrame(animateCanvas);
}

animateCanvas();

// Scroll Animations
gsap.utils.toArray('.section-title').forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

gsap.utils.toArray('.glass-panel').forEach(panel => {
    gsap.from(panel, {
        scrollTrigger: {
            trigger: panel,
            start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

gsap.utils.toArray('.event-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            horizontal: isMobile ? true : false,
            scroller: isMobile ? '.cards-carousel' : window
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: isMobile ? 0 : i * 0.1, // No delay on mobile as it's horizontal
        ease: 'power3.out'
    });
});

// Desktop Navbar Scrolled State
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile Bottom Navbar Active State
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');

window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.scrollY;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});
