// Home Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize testimonial slider
    initTestimonialSlider();
});

// Initialize Testimonial Slider
function initTestimonialSlider() {
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (testimonials.length === 0) return;
    
    let currentSlide = 0;
    
    // Show initial slide
    showSlide(currentSlide);
    
    // Set up automatic slideshow
    const interval = setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }, 5000); // Change slide every 5 seconds
    
    // Add click event to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(interval); // Stop automatic slideshow
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
    
    // Show slide function
    function showSlide(index) {
        // Hide all testimonials
        testimonials.forEach(testimonial => {
            testimonial.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current testimonial
        testimonials[index].style.display = 'block';
        
        // Add active class to current dot
        dots[index].classList.add('active');
    }
}