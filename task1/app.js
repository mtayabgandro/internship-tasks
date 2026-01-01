document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const filterButtons = document.querySelectorAll('.filter-btn');
    const imageBoxes = document.querySelectorAll('.image-box');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const imageTitle = document.querySelector('.image-title');
    const imageCategory = document.querySelector('.image-category');
    
    let currentImageIndex = 0;
    const images = Array.from(imageBoxes);
    
    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter images
            imageBoxes.forEach(box => {
                if (filter === 'all' || box.getAttribute('data-category') === filter) {
                    box.style.display = 'block';
                    setTimeout(() => {
                        box.style.opacity = '1';
                        box.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    box.style.opacity = '0';
                    box.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        box.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Open lightbox when image is clicked
    imageBoxes.forEach((box, index) => {
        box.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightbox();
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close lightbox
    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Navigation buttons
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
    
    // Functions
    function updateLightbox() {
        const currentImage = images[currentImageIndex];
        const imgSrc = currentImage.querySelector('img').src;
        const imgAlt = currentImage.querySelector('img').alt;
        const category = currentImage.getAttribute('data-category');
        
        lightboxImg.src = imgSrc;
        lightboxImg.alt = imgAlt;
        imageTitle.textContent = currentImage.querySelector('.overlay p').textContent;
        imageCategory.textContent = `Category: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    }
    
    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Add initial fade-in animation
    setTimeout(() => {
        imageBoxes.forEach(box => {
            box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }, 100);
});

// Add these elements at the top with other elements
const prevBtnBottom = document.getElementById('prev-btn-bottom');
const nextBtnBottom = document.getElementById('next-btn-bottom');

// Add these event listeners with others
prevBtnBottom.addEventListener('click', showPrevImage);
nextBtnBottom.addEventListener('click', showNextImage);