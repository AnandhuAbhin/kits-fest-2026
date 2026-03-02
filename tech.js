// Redirect to home if this specific page is refreshed
const navEntries = window.performance.getEntriesByType('navigation');
if ((navEntries.length > 0 && navEntries[0].type === 'reload') ||
    (window.performance.navigation && window.performance.navigation.type === 1)) {
    window.location.replace('index.html');
}

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lenis for smooth scrolling
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
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Trigger heroic entry animations immediately
    initHeroAnimations();

    // Hero Animations specific to Subpage
    function initHeroAnimations() {
        gsap.from('.hero-badge', { y: 30, opacity: 0, duration: 1, delay: 0.2, ease: "power3.out" });
        gsap.from('.hero-title', { y: 50, opacity: 0, duration: 1, delay: 0.4, ease: "power3.out" });
        gsap.from('.hero-desc', { y: 30, opacity: 0, duration: 1, delay: 0.6, ease: "power3.out" });
        gsap.from('.scroll-indicator', { opacity: 0, duration: 1, delay: 1, ease: "power2.inOut" });

        // Stagger event cards upon scrolling
        gsap.registerPlugin(ScrollTrigger);

        const sections = document.querySelectorAll('.events-section');
        sections.forEach(section => {
            gsap.fromTo(section.querySelectorAll('.event-card'),
                { y: 50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 95%",
                        toggleActions: "play none none none"
                    },
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    clearProps: "all"
                }
            );
        });
    }

    // Custom Cursor logic
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    if (window.matchMedia("(pointer: fine)").matches && cursor && cursorFollower) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = mouseX;
        let followerY = mouseY;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Move original cursor instantly
            gsap.to(cursor, {
                x: mouseX,
                y: mouseY,
                duration: 0
            });
        });

        // Loop for smoothing follower
        gsap.ticker.add(() => {
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;

            gsap.set(cursorFollower, {
                x: followerX,
                y: followerY
            });
        });

        // Hover effects on buttons, links, etc.
        const hoverTargets = document.querySelectorAll('.hover-target, a, button');
        hoverTargets.forEach(target => {
            target.addEventListener('mouseenter', () => cursorFollower.classList.add('active'));
            target.addEventListener('mouseleave', () => cursorFollower.classList.remove('active'));
        });
    }

    // Scroll effect on Navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile specific: Make active nav item pop
    const navItems = document.querySelectorAll('.mobile-bottom-nav .nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

});
