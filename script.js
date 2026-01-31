document.addEventListener('DOMContentLoaded', () => {
    // Category Filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const productCards = document.querySelectorAll('.product-card');

    function filterProducts(category) {
        // Update buttons
        categoryBtns.forEach(btn => {
            if(btn.dataset.category === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update products
        productCards.forEach(card => {
            const cardCategory = card.dataset.category;
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                // Small animation reset
                setTimeout(() => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                }, 10);
            } else {
                card.style.display = 'none';
            }
        });
    }

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterProducts(category);
        });
    });

    // Expose to window for Navbar links
    window.filterCategory = (category) => {
        // Find the section
        const targetSection = document.querySelector('#loja');
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
        // Filter
        filterProducts(category);
    };

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // If it has onclick attribute, let it handle logic (or if it calls function)
            // But we also want to prevent default jump
            if (this.getAttribute('onclick')) return;

            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Reveal Animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select elements to animate
    document.querySelectorAll('.product-card, .feature, .hero h1, .hero p, .section-header').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Add CSS for visible class
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // Login Logic
    let currentUser = JSON.parse(localStorage.getItem('wank_user')) || null;
    const loginBtn = document.getElementById('loginBtn');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginModal = document.getElementById('loginModal');

    function updateAuthUI() {
        if (currentUser) {
            loginBtn.style.display = 'none';
            userProfile.style.display = 'flex';
            userName.innerText = currentUser.username;
        } else {
            loginBtn.style.display = 'flex';
            userProfile.style.display = 'none';
        }
    }

    // Init UI
    updateAuthUI();

    // Login Action
    const discordLoginForm = document.getElementById('discordLoginForm');
    
    if (discordLoginForm) {
        discordLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('discordEmail').value;
            // Not using password for anything secure, just simulation
            
            // Simulação de Login baseada no input
            const mockUser = {
                username: email.split('@')[0] || 'Usuario', // Use part of email as name
                id: '123456789',
                avatar: 'https://assets-global.website-files.com/6257adef93867e56f84d3092/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png'
            };
            
            currentUser = mockUser;
            localStorage.setItem('wank_user', JSON.stringify(currentUser));
            updateAuthUI();
            closeLoginModal();
            alert(`Login realizado com sucesso! Bem-vindo, ${currentUser.username}`);
        });
    }

    window.closeLoginModal = () => {
        loginModal.style.display = 'none';
    };

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex'; // Open modal instead of direct login
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('wank_user');
            updateAuthUI();
        });
    }

    // Modal Logic
    const modal = document.getElementById('purchaseModal');
    const closeModal = document.querySelector('.close-modal');
    const purchaseForm = document.getElementById('purchaseForm');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductPrice = document.getElementById('modalProductPrice');

    // Open Modal
    document.querySelectorAll('.btn-purchase').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Check Login First
            if (!currentUser) {
                loginModal.style.display = 'flex';
                return;
            }

            const card = btn.closest('.product-card');
            const title = card.querySelector('.card-title').innerText;
            const price = card.querySelector('.card-price').innerText.split('/')[0].trim();
            
            modalProductName.innerText = title;
            modalProductPrice.innerText = price;
            
            // Auto-fill player name if available from login (mock)
            if (currentUser && document.getElementById('playerName')) {
                 document.getElementById('playerName').value = currentUser.username;
            }
            
            modal.style.display = 'flex';
        });
    });

    // Reset Modal View
    const resetModal = () => {
        modal.style.display = 'none';
        setTimeout(() => {
            if(document.getElementById('pixPaymentDetails')) {
                document.getElementById('pixPaymentDetails').style.display = 'none';
                document.getElementById('purchaseForm').style.display = 'block';
            }
            if(purchaseForm) purchaseForm.reset();
        }, 300);
    };

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', resetModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            resetModal();
        }
    });

    // Form Submit
    if (purchaseForm) {
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const playerName = document.getElementById('playerName').value;
            const paymentMethod = document.getElementById('paymentMethod').value;
            
            if (paymentMethod === 'pix') {
                // Show PIX details
                document.getElementById('purchaseForm').style.display = 'none';
                document.getElementById('pixPaymentDetails').style.display = 'block';
            } else {
                // Other methods (simulation)
                const product = modalProductName.innerText;
                alert(`Redirecionando para pagamento via Cartão de Crédito...\n\nProduto: ${product}\nJogador: ${playerName}`);
                modal.style.display = 'none';
                purchaseForm.reset();
            }
        });
    }

    // Helper functions exposed to window
    window.copyPixKey = () => {
        const key = document.getElementById('pixKey').innerText;
        navigator.clipboard.writeText(key).then(() => {
            alert('Chave PIX copiada!');
        });
    };

    window.backToForm = () => {
        document.getElementById('pixPaymentDetails').style.display = 'none';
        document.getElementById('purchaseForm').style.display = 'block';
    };

    window.finishOrder = () => {
        alert('Obrigado! Envie o comprovante no nosso Discord para liberar seu produto.');
        modal.style.display = 'none';
        purchaseForm.reset();
        // Reset view for next time
        setTimeout(() => {
            document.getElementById('pixPaymentDetails').style.display = 'none';
            document.getElementById('purchaseForm').style.display = 'block';
        }, 500);
    };
});
