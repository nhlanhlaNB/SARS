// SARS AI Training Website - Interactive Features

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeAnimations();
    initializeQuizzes();
    initializeAssessments();
    initializeTooltips();
    initializeAccordions();
});

// Navigation Active State
function initializeNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Scroll Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .timeline-item').forEach(el => {
        observer.observe(el);
    });
}

// Quiz Functionality
function initializeQuizzes() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove previous selections in this question
            const questionGroup = this.closest('.quiz-question');
            questionGroup.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected', 'correct', 'incorrect');
            });
            
            // Mark this option as selected
            this.classList.add('selected');
            
            // Check if answer is correct (if data-correct attribute exists)
            if (this.hasAttribute('data-correct')) {
                this.classList.add('correct');
                showFeedback(questionGroup, true);
            } else if (this.hasAttribute('data-incorrect')) {
                this.classList.add('incorrect');
                showFeedback(questionGroup, false);
            }
        });
    });
}

// Quiz Feedback
function showFeedback(questionElement, isCorrect) {
    // Remove existing feedback
    const existingFeedback = questionElement.querySelector('.quiz-feedback');
    if (existingFeedback) {
        existingFeedback.remove();
    }
    
    // Create new feedback
    const feedback = document.createElement('div');
    feedback.className = `alert ${isCorrect ? 'alert-success' : 'alert-danger'} quiz-feedback mt-3`;
    feedback.innerHTML = isCorrect 
        ? '<i class="bi bi-check-circle-fill"></i> Correct! Well done.'
        : '<i class="bi bi-x-circle-fill"></i> Not quite. Try again or review the material.';
    
    questionElement.appendChild(feedback);
}

// Assessment Form Handling
function initializeAssessments() {
    const ratingOptions = document.querySelectorAll('.rating-option');
    
    ratingOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Get the rating group
            const group = this.closest('.rating-group');
            const input = group.querySelector('input[type="hidden"]');
            const value = this.dataset.value;
            
            // Update hidden input
            if (input) {
                input.value = value;
            }
            
            // Visual feedback
            group.querySelectorAll('.rating-option').forEach(opt => {
                opt.classList.remove('selected');
                if (parseInt(opt.dataset.value) <= parseInt(value)) {
                    opt.style.background = 'var(--primary-color)';
                    opt.style.color = 'white';
                    opt.style.borderColor = 'var(--primary-color)';
                } else {
                    opt.style.background = 'white';
                    opt.style.color = '#333';
                    opt.style.borderColor = '#dee2e6';
                }
            });
            
            this.classList.add('selected');
        });
    });
    
    // Form submission
    const assessmentForms = document.querySelectorAll('.assessment-form');
    assessmentForms.forEach(form => {
        form.addEventListener('submit', handleAssessmentSubmit);
    });
}

// Handle Assessment Submission
function handleAssessmentSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Store in localStorage (in real app, send to server)
    localStorage.setItem('assessmentData', JSON.stringify(data));
    
    // Show success message
    showSuccessModal('Assessment Submitted', 'Your assessment has been saved successfully!');
}

// Success Modal
function showSuccessModal(title, message) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-success text-white">
                    <h5 class="modal-title"><i class="bi bi-check-circle"></i> ${title}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Remove modal from DOM after hiding
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

// Initialize Bootstrap Tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Initialize Accordions with Animation
function initializeAccordions() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Add smooth transition
            const target = this.getAttribute('data-bs-target');
            const element = document.querySelector(target);
            
            if (element) {
                element.style.transition = 'all 0.3s ease';
            }
        });
    });
}

// Progress Tracking
function updateProgress(day, session) {
    const progressKey = `progress_day${day}_session${session}`;
    localStorage.setItem(progressKey, 'completed');
    updateProgressBar();
}

function updateProgressBar() {
    const totalSessions = 18; // Total sessions across 3 days
    let completedSessions = 0;
    
    for (let day = 1; day <= 3; day++) {
        for (let session = 1; session <= 6; session++) {
            const key = `progress_day${day}_session${session}`;
            if (localStorage.getItem(key) === 'completed') {
                completedSessions++;
            }
        }
    }
    
    const percentage = (completedSessions / totalSessions) * 100;
    const progressBar = document.getElementById('courseProgress');
    
    if (progressBar) {
        progressBar.style.width = percentage + '%';
        progressBar.setAttribute('aria-valuenow', percentage);
        progressBar.textContent = Math.round(percentage) + '% Complete';
    }
}

// Print Function
function printPage() {
    window.print();
}

// Download Certificate
function downloadCertificate() {
    const name = prompt('Enter your name for the certificate:');
    if (name) {
        generateCertificate(name);
    }
}

function generateCertificate(name) {
    // In a real application, this would generate a PDF
    alert(`Certificate for ${name} will be generated. This feature requires backend integration.`);
}

// Bookmark Current Page
function bookmarkPage() {
    const currentPage = window.location.href;
    const pageTitle = document.title;
    
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    bookmarks.push({
        url: currentPage,
        title: pageTitle,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    showSuccessModal('Bookmark Added', 'This page has been bookmarked!');
}

// Search Functionality
function searchCourse(query) {
    query = query.toLowerCase();
    const searchableElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li');
    let results = [];
    
    searchableElements.forEach(element => {
        if (element.textContent.toLowerCase().includes(query)) {
            results.push({
                text: element.textContent,
                element: element
            });
        }
    });
    
    return results;
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Copy Code to Clipboard
function copyCode(button) {
    const codeBlock = button.previousElementSibling;
    const code = codeBlock.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('btn-success');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('btn-success');
        }, 2000);
    });
}

// Toggle Dark Mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Load Dark Mode Preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Export Progress Data
function exportProgress() {
    const progressData = {
        completedSessions: {},
        assessments: localStorage.getItem('assessmentData'),
        bookmarks: localStorage.getItem('bookmarks'),
        exportDate: new Date().toISOString()
    };
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('progress_')) {
            progressData.completedSessions[key] = localStorage.getItem(key);
        }
    }
    
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sars-ai-training-progress.json';
    link.click();
    
    URL.revokeObjectURL(url);
}

// Console Welcome Message
console.log('%cWelcome to SARS AI Training!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cThis platform is designed to help you master AI for revenue services.', 'color: #333; font-size: 14px;');
