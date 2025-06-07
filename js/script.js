document.addEventListener('DOMContentLoaded', function() {

    /**
     * =============================================
     * General UI & Page Setup
     * =============================================
     */

    // --- Header Background on Scroll ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        const isScrolled = window.scrollY > 50;
        header.classList.toggle('bg-dark-2', isScrolled);
        header.classList.toggle('shadow-lg', isScrolled);
    });
    
    // --- Modern Mobile Menu Logic ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');

    function openMobileMenu() {
        mobileMenuOverlay.classList.add('menu-open');
        mobileMenuIcon.classList.remove('fa-bars');
        mobileMenuIcon.classList.add('fa-times');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenuOverlay.classList.remove('menu-open');
        mobileMenuIcon.classList.add('fa-bars');
        mobileMenuIcon.classList.remove('fa-times');
        document.body.style.overflow = '';
    }
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isMenuOpen = mobileMenuOverlay.classList.contains('menu-open');
        if (isMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });
    
    // --- Smooth Scrolling & Close Mobile Menu ---
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            
            if (mobileMenuOverlay.classList.contains('menu-open')) {
                closeMobileMenu();
            }
        });
    });

    // --- Scroll Animations (Intersection Observer) ---
    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        scrollObserver.observe(el);
    });
    
    // --- Update Footer Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /**
     * =============================================
     * Interactive Portfolio Logic
     * =============================================
     */
    const portfolioItems = document.querySelectorAll('.portfolio-item'); 
    const filterBtns = document.querySelectorAll('#portfolio-filters .filter-btn');
    const modal = document.getElementById('portfolio-modal');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalLink = document.getElementById('modal-link');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalImg = document.getElementById('modal-img');
    const modalNextBtn = document.getElementById('modal-next');
    const modalPrevBtn = document.getElementById('modal-prev');
    
    let currentProjectIndex = 0;
    let visibleProjects = [];

    // --- Filter Projects ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            
            portfolioItems.forEach(item => {
                const isVisible = filter === 'all' || item.dataset.category === filter;
                item.style.display = isVisible ? 'flex' : 'none';
            });
        });
    });

    // --- Open Modal ---
    function openModal(projectElement) {
        if (!projectElement) return;

        modalTitle.textContent = projectElement.dataset.title;
        modalDescription.textContent = projectElement.dataset.description;
        modalImg.src = projectElement.dataset.img;
        
        const projectLink = projectElement.dataset.link;
        if (projectLink && projectLink !== '#') {
            modalLink.href = projectLink;
            modalLink.style.display = 'inline-flex';
        } else {
            modalLink.style.display = 'none';
        }
        
        modal.classList.remove('opacity-0', 'pointer-events-none');
        modalContent.classList.remove('scale-95');
        document.body.style.overflow = 'hidden';
    }

    // --- Close Modal ---
    function closeModal() {
        modal.classList.add('opacity-0', 'pointer-events-none');
        modalContent.classList.add('scale-95');
        document.body.style.overflow = '';
    }

    // --- Attach Event Listeners ---
    portfolioItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            if (e.target.closest('.project-card')) {
                visibleProjects = Array.from(portfolioItems).filter(p => p.style.display !== 'none');
                currentProjectIndex = visibleProjects.indexOf(item);
                openModal(item);
            }
        });
    });

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // --- Modal Navigation ---
    function showProject(index) {
        if (visibleProjects.length > 0) {
            currentProjectIndex = (index + visibleProjects.length) % visibleProjects.length;
            openModal(visibleProjects[currentProjectIndex]);
        }
    }

    modalNextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        showProject(currentProjectIndex + 1);
    });
    modalPrevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showProject(currentProjectIndex - 1);
    });

    // --- Keyboard Navigation for Modal ---
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('pointer-events-none')) return;
        
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowRight') modalNextBtn.click();
        if (e.key === 'ArrowLeft') modalPrevBtn.click();
    });
});
