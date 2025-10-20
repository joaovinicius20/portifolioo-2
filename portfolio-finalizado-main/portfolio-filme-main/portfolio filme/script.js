document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Back to Top Button
    const backToTop = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });
    
    backToTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Typed Text Animation
    const typedTextSpan = document.querySelector('.typed-text');
    const cursorSpan = document.querySelector('.cursor');
    
    const textArray = ["Cinematográfico", "Tecnológico", "Interativo", "Futurista"];
    const typingDelay = 200;
    const erasingDelay = 100;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;
    
    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } 
        else {
            cursorSpan.classList.remove('typing');
            setTimeout(erase, newTextDelay);
        }
    }
    
    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains('typing')) cursorSpan.classList.add('typing');
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } 
        else {
            cursorSpan.classList.remove('typing');
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }
    
    // Start animation
    if (textArray.length) setTimeout(type, newTextDelay + 250);
    
    // Animate stats numbers
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    current = target;
                }
                
                if (stat.getAttribute('data-count').includes('.')) {
                    stat.textContent = current.toFixed(1);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 10);
        });
    }
    
    // Animate chart bars
    function animateCharts() {
        const chartBars = document.querySelectorAll('.chart-bar');
        
        chartBars.forEach(bar => {
            const percent = bar.getAttribute('data-percent');
            const fill = bar.querySelector('.bar-fill');
            
            fill.style.width = percent + '%';
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('about-stats')) {
                    animateStats();
                }
                
                if (entry.target.classList.contains('chart-container')) {
                    animateCharts();
                }
                
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to observe
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Watchlist functionality
    const watchlistForm = document.getElementById('add-movie-form');
    const watchlistItems = document.querySelector('.watchlist-list');
    const watchlistCount = document.querySelector('.watchlist-count');
    
    // Load watchlist from localStorage
    function loadWatchlist() {
        const movies = JSON.parse(localStorage.getItem('watchlist')) || [];
        
        if (movies.length === 0) {
            watchlistItems.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-film"></i>
                    <p>Sua watchlist está vazia</p>
                    <p>Adicione filmes que você deseja assistir</p>
                </div>
            `;
            watchlistCount.textContent = '0 itens';
            return;
        }
        
        watchlistItems.innerHTML = '';
        movies.forEach((movie, index) => {
            const movieElement = document.createElement('div');
            movieElement.className = 'watchlist-item';
            movieElement.innerHTML = `
                <div class="item-main">
                    <div class="item-priority ${movie.priority.toLowerCase()}">
                        <i class="fas fa-signal"></i>
                    </div>
                    <div class="item-info">
                        <h4>${movie.title}</h4>
                        <div class="item-meta">
                            <span class="item-genre">${movie.genre}</span>
                            ${movie.notes ? `<span class="item-notes">${movie.notes}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="item-actions">
                    <button class="item-btn delete-btn" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            watchlistItems.appendChild(movieElement);
        });
        
        watchlistCount.textContent = `${movies.length} ${movies.length === 1 ? 'item' : 'itens'}`;
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeFromWatchlist(index);
            });
        });
    }
    
    // Add movie to watchlist
    watchlistForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('movie-title').value;
        const genre = document.getElementById('movie-genre').value;
        const priority = document.getElementById('movie-priority').value;
        const notes = document.getElementById('movie-notes').value;
        
        const movie = {
            title,
            genre,
            priority,
            notes
        };
        
        let movies = JSON.parse(localStorage.getItem('watchlist')) || [];
        movies.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(movies));
        
        this.reset();
        loadWatchlist();
        
        // Show success notification
        showNotification('Filme adicionado à watchlist!');
    });
    
    // Remove movie from watchlist
    function removeFromWatchlist(index) {
        let movies = JSON.parse(localStorage.getItem('watchlist')) || [];
        movies.splice(index, 1);
        localStorage.setItem('watchlist', JSON.stringify(movies));
        loadWatchlist();
        
        // Show notification
        showNotification('Filme removido da watchlist!');
    }
    
    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add to watchlist from movie cards
    document.querySelectorAll('.add-watchlist').forEach(btn => {
        btn.addEventListener('click', function() {
            const movieTitle = this.getAttribute('data-movie');
            document.getElementById('movie-title').value = movieTitle;
            
            // Scroll to watchlist form
            document.getElementById('watchlist').scrollIntoView({
                behavior: 'smooth'
            });
            
            // Focus on genre select
            document.getElementById('movie-genre').focus();
        });
    });
    
    // Movie filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const movieCards = document.querySelectorAll('.movie-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter movies
            movieCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For this example, we'll just show a success message
        showNotification('Mensagem enviada com sucesso!');
        this.reset();
    });
    
    // Initialize watchlist
    loadWatchlist();
    
    // GSAP Animations
    gsap.from('.tech-header', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-text', {
        duration: 1,
        x: -50,
        opacity: 0,
        delay: 0.5,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-visual', {
        duration: 1,
        x: 50,
        opacity: 0,
        delay: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from('.section-header', {
        scrollTrigger: {
            trigger: 'section',
            start: 'top 80%'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
});