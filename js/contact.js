// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize contact form
    initContactForm();
});

// Initialize Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form
            if (validateContactForm(contactForm)) {
                // Simulate form submission
                submitContactForm(contactForm);
            }
        });
    }
}

// Validate Contact Form
function validateContactForm(form) {
    const name = form.querySelector('#name');
    const email = form.querySelector('#email');
    const subject = form.querySelector('#subject');
    const message = form.querySelector('#message');
    
    let isValid = true;
    
    // Reset previous error states
    const errorElements = form.querySelectorAll('.error-message');
    errorElements.forEach(element => element.remove());
    
    const inputs = [name, email, subject, message];
    inputs.forEach(input => {
        input.classList.remove('error');
    });
    
    // Name validation
    if (!name.value.trim()) {
        showError(name, 'Please enter your name');
        isValid = false;
    }
    
    // Email validation
    if (!email.value.trim()) {
        showError(email, 'Please enter your email');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Subject validation
    if (!subject.value) {
        showError(subject, 'Please select a subject');
        isValid = false;
    }
    
    // Message validation
    if (!message.value.trim()) {
        showError(message, 'Please enter your message');
        isValid = false;
    }
    
    return isValid;
}

// Show Error Message
function showError(input, message) {
    input.classList.add('error');
    
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    
    // Insert error message after input
    input.parentNode.insertBefore(errorMessage, input.nextSibling);
}

// Validate Email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Submit Contact Form
function submitContactForm(form) {
    // In a real implementation, you would send an AJAX request to your server
    // Here we just simulate a submission delay
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Disable form during submission
    disableForm(form, true);
    submitButton.textContent = 'Sending...';
    
    // Simulate server request
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Re-enable form
        disableForm(form, false);
        submitButton.textContent = originalText;
        
        // Show success modal
        window.MeSnap.openModal('success-modal');
    }, 1500);
}

// Disable/Enable Form
function disableForm(form, disabled) {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
        input.disabled = disabled;
    });
}