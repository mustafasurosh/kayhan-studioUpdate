
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_f7798z4',      
    TEMPLATE_ID: 'template_7nw6qdq',    
    PUBLIC_KEY: 'Xcdu2MrycC8iJ8fkZ'      
};

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    
    // Set up form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('.submit-btn');
    const formMessage = document.getElementById('form-message');
    const originalBtnText = submitBtn.innerHTML;

    // Validate form before showing loading state
    if (!validateContactForm(form)) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ارسال...';

    try {
        // Prepare form data
        const formData = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim() || 'لم يتم ارائه ایمیل',
            subject: form.subject.options[form.subject.selectedIndex].text,
            message: form.message.value.trim(),
            submissionDate: new Date().toLocaleDateString('fa-AF'),
            submissionTime: new Date().toLocaleTimeString('fa-AF')
        };
        // Send email using EmailJS
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            formData
        );
        // Show success message
        showFormMessage('success', getLocalizedMessage('formSuccess'));
        form.reset();
    } catch (error) {
        console.error('EmailJS Error:', error);
        showFormMessage('error', getLocalizedMessage('formError'));
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Show form message
function showFormMessage(type, message) {
    const formMessage = document.getElementById('form-message');
    formMessage.className = `form-message ${type}`;
    formMessage.textContent = message;
    formMessage.classList.remove('hidden');
    
    // Auto-hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.add('hidden');
    }, 5000);
    
    // Scroll to message
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Get localized messages
function getLocalizedMessage(key) {
    const messages = {
        en: {
            formSuccess: 'Thank you! Your booking request has been sent successfully. We will contact you soon.',
            formError: 'Sorry, there was an error sending your request. Please try again or contact us directly.'
        },
        dari: {
            formSuccess: 'تشکر! درخواست رزرو شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
            formError: 'متأسفیم، خطایی در ارسال درخواست شما رخ داد. لطفاً دوباره تلاش کنید یا مستقیماً با ما تماس بگیرید.'
        }
    };
    
    // Get current language (currentLang is defined in script.js)
    const lang = typeof currentLang !== 'undefined' ? currentLang : 'dari';
    return messages[lang][key] || messages['dari'][key];
}

// Validate form before submission
function validateContactForm(form) {
    const firstName = form.firstName.value.trim();
    const lastName = form.lastName.value.trim();
    const phone = form.phone.value.trim();
    const subject = form.subject.value;
    const message = form.message.value.trim();
    
    // Basic validation
    if (!firstName || !lastName || !phone || !subject || !message) {
        showFormMessage('error', getLocalizedMessage('formError'));
        return false;
    }
    
    // Phone number validation (Afghan phone number format)
    const phoneRegex = /^(\+93|0093|0)?[7-9][0-9]{8}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showFormMessage('error', currentLang === 'en' ? 
            'Please enter a valid phone number' : 
            'لطفاً یک شماره تلفن معتبر وارد کنید');
        return false;
    }
    
    return true;
}

