// FAQ Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    setupNavigation();
    // Initialize FAQ accordion
    initFaqAccordion();

    // Initialize category filters
    initCategoryFilters();

    // Initialize search functionality
    initFaqSearch();
});


function setupNavigation() {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            window.location.href = '/';
        });
    }
}

// Initialize FAQ Accordion
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Get parent FAQ item
            const faqItem = question.parentElement;

            // Toggle active class
            faqItem.classList.toggle('active');

            // Update icon
            const icon = question.querySelector('.faq-icon');
            if (icon) {
                icon.textContent = faqItem.classList.contains('active') ? '−' : '+';
            }
        });
    });
}

// Initialize Category Filters
function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get selected category
            const category = button.getAttribute('data-category');

            // Filter FAQ items
            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Initialize FAQ Search
function initFaqSearch() {
    const searchInput = document.getElementById('faq-search');
    const searchButton = document.getElementById('search-btn');
    const faqItems = document.querySelectorAll('.faq-item');

    // Function to perform search
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();

        if (searchTerm === '') {
            // If search is empty, show all based on current category filter
            const activeCategory = document.querySelector('.category-btn.active');
            const category = activeCategory ? activeCategory.getAttribute('data-category') : 'all';

            faqItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            return;
        }

        // Filter items based on search term
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question h3').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();

            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';

                // Auto expand items that match search
                item.classList.add('active');
                const icon = item.querySelector('.faq-icon');
                if (icon) {
                    icon.textContent = '−';
                }
            } else {
                item.style.display = 'none';
            }
        });

        // Reset category filter buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.category-btn[data-category="all"]').classList.add('active');
    }

    // Search button click event
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // Search input keyup event (search as you type)
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            // Search on Enter key
            if (e.key === 'Enter') {
                performSearch();
            }

            // Search after a short delay while typing
            clearTimeout(searchInput.searchTimeout);
            searchInput.searchTimeout = setTimeout(performSearch, 500);
        });
    }
}