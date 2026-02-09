document.addEventListener('DOMContentLoaded', () => {
    // --- CODE CHUNG CHO CÁC TRANG ---

    // (ĐÃ THÊM) Xử lý đa ngôn ngữ
    const languageSwitcher = document.querySelector('.language-switcher');
    const langButtons = document.querySelectorAll('.lang-btn');
    const translatableElements = document.querySelectorAll('[data-key]');

    const setLanguage = (lang) => {
        translatableElements.forEach(element => {
            const key = element.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                element.innerHTML = translations[lang][key];
            }
        });
        // Cập nhật trạng thái active cho nút
        languageSwitcher.querySelector('.active').classList.remove('active');
        languageSwitcher.querySelector(`[data-lang=${lang}]`).classList.add('active');
        // Lưu lựa chọn vào localStorage
        localStorage.setItem('language', lang);
    };

    langButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Xử lý Hamburger Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // --- CODE DÀNH RIÊNG CHO TRANG CHỦ (index.html) ---
    const heroSection = document.getElementById('hero');

    if (heroSection) {
        const slides = document.querySelectorAll('.hero-slide');
        const prevButton = document.getElementById('prevSlide');
        const nextButton = document.getElementById('nextSlide');
        let currentSlide = 0;

        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === index);
            });
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }

        if (prevButton && nextButton) {
            prevButton.addEventListener('click', prevSlide);
            nextButton.addEventListener('click', nextSlide);
        }

        let slideInterval = setInterval(nextSlide, 5000);
        heroSection.addEventListener('mouseover', () => clearInterval(slideInterval));
        heroSection.addEventListener('mouseleave', () => {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        });

        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'var(--secondary-color)';
                header.style.borderBottom = '1px solid var(--border-color)';
            } else {
                header.style.backgroundColor = 'transparent';
                header.style.borderBottom = '1px solid transparent';
            }
        });

        showSlide(currentSlide);

        // (ĐÃ THÊM) Hiệu ứng đếm số khi cuộn tới
        const statsSection = document.getElementById('stats');
        if (statsSection) {
            const counters = document.querySelectorAll('.stat-number');
            const speed = 200; // Tốc độ càng lớn, đếm càng chậm

            const animateCounter = (counter) => {
                const target = +counter.getAttribute('data-target');
                const updateCount = () => {
                    const count = +counter.innerText;
                    const increment = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + increment);
                        setTimeout(updateCount, 1);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            };

            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        counters.forEach(counter => {
                            animateCounter(counter);
                        });
                        observer.unobserve(entry.target); // Chạy 1 lần rồi dừng
                    }
                });
            }, {
                threshold: 0.5 // Kích hoạt khi 50% section hiện ra
            });

            observer.observe(statsSection);
        }
    }

    // --- CODE DÀNH RIÊNG CHO TRANG DỰ ÁN (products/product.html) ---
    const filterContainer = document.querySelector('.filter-menu');

    if (filterContainer) {
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        // (ĐÃ SỬA) Chọn các cột (col) thay vì thẻ a để ẩn hiện đúng layout grid
        const portfolioCols = document.querySelectorAll('.portfolio-grid > div');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterContainer.querySelector('.active').classList.remove('active');
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');
                
                portfolioCols.forEach(col => {
                    const actualItem = col.querySelector('.portfolio-item');
                    const shouldShow = filterValue === 'all' || (actualItem && actualItem.classList.contains(filterValue));

                    if (shouldShow) {
                        col.classList.remove('d-none'); // Sử dụng class của Bootstrap để hiện
                        // Thêm animation fade in nếu muốn
                        col.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        col.classList.add('d-none'); // Sử dụng class của Bootstrap để ẩn hoàn toàn
                    }
                });
            });
        });
    }

    // --- (ĐÃ SỬA) CODE CHUNG CHO LIGHTBOX VÀ GALLERY TRANG CHI TIẾT DỰ ÁN ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');

    // (ĐÃ SỬA) Chuyển logic xử lý lightbox vào đây để sử dụng chung
    if (lightbox && lightboxImg && closeBtn) {
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                lightbox.style.display = 'none';
            }
        });
    }

    // (ĐÃ SỬA) Tự động tạo gallery từ data-images
    const galleryContainer = document.getElementById('gallery-grid-container');
    const galleryData = document.getElementById('gallery-data');

    // (ĐÃ SỬA) Gắn sự kiện click ngay khi tạo ảnh
    if (galleryContainer && galleryData && lightbox) {
        const folder = galleryData.getAttribute('data-folder');
        const images = JSON.parse(galleryData.getAttribute('data-images') || '[]');

        images.forEach(imageName => {
            const imgElement = document.createElement('img');
            const imgSrc = folder + imageName;
            imgElement.src = imgSrc;
            imgElement.alt = 'Ảnh chi tiết dự án';
            imgElement.className = 'gallery-img';
            imgElement.loading = 'lazy'; // Tối ưu tải ảnh

            // Gắn sự kiện click ngay tại đây
            imgElement.addEventListener('click', () => {
                lightbox.style.display = 'block';
                lightboxImg.src = imgSrc;
            });

            galleryContainer.appendChild(imgElement);
        });
    }

    // --- CODE DÀNH RIÊNG CHO TRANG LIÊN HỆ (contact.html) ---
    const contactForm = document.querySelector('.contact-form form');
    const popup = document.getElementById('success-popup');
    const closePopupBtn = document.querySelector('.close-popup-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', e => {
            e.preventDefault();
            const scriptURL = 'https://script.google.com/macros/s/AKfycby0a1vjDT9BajcztKeB2e7ErkoduDC0XFxRolPjub-ACFIJdB20NGbkdD4EPyXQYSw/exec'; // <-- PASTE YOUR WEB APP URL HERE
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Đang gửi...';

            fetch(scriptURL, { method: 'POST', body: formData})
                .then(response => {
                    if (response.ok) {
                        if(popup) popup.style.display = 'block';
                        contactForm.reset();
                    } else {
                        alert('Có lỗi xảy ra, vui lòng thử lại.');
                    }
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    alert('Có lỗi xảy ra, vui lòng thử lại.');
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                });
        });
    }

    if (popup && closePopupBtn) {
        closePopupBtn.onclick = function() {
            popup.style.display = "none";
        }
        window.onclick = function(event) {
            if (event.target == popup) {
                popup.style.display = "none";
            }
        }
    }
});