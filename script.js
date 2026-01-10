document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItemsList = document.querySelectorAll('.nav-links a');

    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    // Close menu when clicking a link
    navItemsList.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // Smooth Scroll Active Link Update
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Contact Form Submission (Mock)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'جاري الإرسال...';
            btn.disabled = true;

            const name = contactForm.querySelector('input[type="text"]').value;
            const phone = contactForm.querySelector('input[type="tel"]').value;
            const message = contactForm.querySelector('textarea').value;
            const file = document.getElementById('contactImage').files[0];

            const saveMessage = (imgData = null) => {
                const msgObj = {
                    id: Date.now(),
                    date: new Date().toLocaleString('ar-EG'),
                    name,
                    phone,
                    message,
                    image: imgData
                };
                let messages = JSON.parse(localStorage.getItem('messages')) || [];
                messages.push(msgObj);
                localStorage.setItem('messages', JSON.stringify(messages));

                setTimeout(() => {
                    btn.innerText = 'تم الإرسال بنجاح!';
                    btn.style.background = '#25D366';
                    contactForm.reset();
                    document.getElementById('contactImagePreview').innerHTML = '';

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                }, 1000);
            };

            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => saveMessage(event.target.result);
                reader.readAsDataURL(file);
            } else {
                saveMessage();
            }
        });
    }

    // Order Modal Logic
    const modal = document.getElementById('orderModal');
    const closeBtn = document.querySelector('.close-modal');
    const orderForm = document.getElementById('orderForm');
    const buyButtons = document.querySelectorAll('.btn-buy');

    let currentProduct = null;

    buyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentProduct = {
                name: btn.getAttribute('data-product'),
                price: btn.getAttribute('data-price')
            };

            document.getElementById('modalProductName').innerText = currentProduct.name;
            document.getElementById('modalProductPrice').innerText = currentProduct.price;

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('custName').value;
            const phone = document.getElementById('custPhone').value;
            const address = document.getElementById('custAddress').value;

            const order = {
                id: Date.now(),
                date: new Date().toLocaleString('ar-EG'),
                product: currentProduct.name,
                price: currentProduct.price,
                customer: name,
                phone: phone,
                address: address
            };

            // Save order to localStorage
            let orders = JSON.parse(localStorage.getItem('orders')) || [];

            const imageInput = document.getElementById('custImage');
            const file = imageInput.files[0];

            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64Image = event.target.result;
                    order.image = base64Image;
                    saveAndFinish(orders, order);
                };
                reader.readAsDataURL(file);
            } else {
                saveAndFinish(orders, order);
            }

            function saveAndFinish(orders, order) {
                orders.push(order);
                localStorage.setItem('orders', JSON.stringify(orders));

                // Success message or feedback
                alert('تم تأكيد طلبك بنجاح! شكراً لتعاملك معنا.');

                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                orderForm.reset();
                document.getElementById('orderImagePreview').innerHTML = '';
            }
        });
    }

    // Image Previews
    const setupImagePreview = (inputId, previewId) => {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        if (input && preview) {
            input.addEventListener('change', () => {
                preview.innerHTML = '';
                if (input.files && input.files[0]) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        preview.appendChild(img);
                    };
                    reader.readAsDataURL(input.files[0]);
                }
            });
        }
    };

    setupImagePreview('custImage', 'orderImagePreview');
    setupImagePreview('contactImage', 'contactImagePreview');

    // Admin Page Logic 
    if (window.location.href.toLowerCase().includes('admin.html')) {
        const ordersList = document.getElementById('ordersList');
        if (ordersList) {
            const orders = JSON.parse(localStorage.getItem('orders')) || [];

            if (orders.length === 0) {
                ordersList.innerHTML = '<div class="no-orders"><i class="fas fa-box-open fa-3x"></i><p>لا توجد طلبات حتى الآن</p></div>';
            } else {
                ordersList.innerHTML = orders.reverse().map(order => `
                    <div class="order-card" data-aos="fade-up">
                        <div class="order-info">
                            <h3>طلب #${order.id.toString().slice(-5)}</h3>
                            <div class="cust-details">
                                <p>العميل: <span>${order.customer}</span></p>
                                <p>الهاتف: <span>${order.phone}</span></p>
                                <p>العنوان: <span>${order.address}</span></p>
                            </div>
                            <div class="product-summary" style="margin-top: 1rem;">
                                <p>المنتج: ${order.product}</p>
                                <p>السعر: ${order.price}</p>
                            </div>
                            ${order.image ? `
                                <div class="order-attachment">
                                    <p style="margin-top: 10px; font-weight: bold;">الصورة المرفقة:</p>
                                    <img src="${order.image}" class="admin-order-img" onclick="window.open(this.src)">
                                </div>
                            ` : ''}
                        </div>
                        <div class="order-meta">
                            <span class="order-date">${order.date}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        const messagesList = document.getElementById('messagesList');
        if (messagesList) {
            const messages = JSON.parse(localStorage.getItem('messages')) || [];

            if (messages.length === 0) {
                messagesList.innerHTML = '<div class="no-orders"><i class="fas fa-comment-slash fa-3x"></i><p>لا توجد رسائل حتى الآن</p></div>';
            } else {
                messagesList.innerHTML = messages.reverse().map(msg => `
                    <div class="order-card" data-aos="fade-up">
                        <div class="order-info">
                            <h3>رسالة من: ${msg.name}</h3>
                            <div class="cust-details">
                                <p>الهاتف: <span>${msg.phone}</span></p>
                                <p>الرسالة: <span style="display: block; margin-top: 5px; font-weight: 400; color: #555;">${msg.message}</span></p>
                            </div>
                            ${msg.image ? `
                                <div class="order-attachment">
                                    <p style="margin-top: 10px; font-weight: bold;">الصورة المرفقة:</p>
                                    <img src="${msg.image}" class="admin-order-img" onclick="window.open(this.src)">
                                </div>
                            ` : ''}
                        </div>
                        <div class="order-meta">
                            <span class="order-date">${msg.date}</span>
                        </div>
                    </div>
                `).join('');
            }
        }

        window.clearOrders = () => {
            if (confirm('هل أنت متأكد من مسح جميع البيانات؟')) {
                localStorage.removeItem('orders');
                localStorage.removeItem('messages');
                location.reload();
            }
        };
    }
});
