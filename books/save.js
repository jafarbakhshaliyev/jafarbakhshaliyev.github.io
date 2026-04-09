document.querySelectorAll('.bookshelf-row').forEach(shelf => {
    const books = Array.from(shelf.querySelectorAll('.book-item'));
    let currentIndex = 0;
    let isAnimating = false;
    let activeInfoBook = null;
    let autoplayInterval;
    let isUserInteracting = false;

    function updateBooks() {
        books.forEach((book, index) => {
            book.classList.remove('visible', 'center', 'left', 'right', 'show-info');
            
            if (index === currentIndex) {
                book.classList.add('visible', 'center');
            } else if (index === currentIndex - 1) {
                book.classList.add('visible', 'left');
            } else if (index === currentIndex + 1) {
                book.classList.add('visible', 'right');
            }
        });
    }

    function startAutoplay() {
        if (!isUserInteracting) {
            autoplayInterval = setInterval(() => {
                if (currentIndex >= books.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateBooks();
            }, 3000);
        }
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function navigate(direction) {
        if (isAnimating) return;
        
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < books.length) {
            isAnimating = true;
            currentIndex = newIndex;
            clearActiveInfo();
            updateBooks();
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }
    }

    function clearActiveInfo() {
        if (activeInfoBook) {
            activeInfoBook.classList.remove('show-info');
            activeInfoBook = null;
        }
    }

    // Bookshelf hover handlers
    const bookshelfContainer = shelf.closest('.bookshelf-container');
    bookshelfContainer.addEventListener('mouseenter', () => {
        isUserInteracting = true;
        stopAutoplay();
    });

    bookshelfContainer.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startAutoplay();
    });

    // Handle book clicks
    books.forEach((book, index) => {
        book.addEventListener('click', (e) => {
            if (!book.classList.contains('visible')) return;
            
            if (activeInfoBook === book) {
                clearActiveInfo();
            } else {
                clearActiveInfo();
                book.classList.add('show-info');
                activeInfoBook = book;
                
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateBooks();
                }
            }
        });
    });

    // Navigation zones
    const leftZone = shelf.querySelector('.hover-zone-left');
    const rightZone = shelf.querySelector('.hover-zone-right');
    
    let navigationTimeout;
    
    leftZone.addEventListener('mouseenter', () => {
        if (currentIndex > 0) {
            clearTimeout(navigationTimeout);
            navigationTimeout = setTimeout(() => navigate(-1), 300);
        }
    });

    rightZone.addEventListener('mouseenter', () => {
        if (currentIndex < books.length - 1) {
            clearTimeout(navigationTimeout);
            navigationTimeout = setTimeout(() => navigate(1), 300);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    navigate(-1);
                }
                break;
            case 'ArrowRight':
                if (currentIndex < books.length - 1) {
                    navigate(1);
                }
                break;
            case 'Escape':
                clearActiveInfo();
                break;
        }
    });

    // Click outside to close info
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.book-item')) {
            clearActiveInfo();
        }
    });

    // Initial setup
    updateBooks();
    startAutoplay();
});

<!DOCTYPE HTML>
<!--
	Spatial by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
-->
<html>

<head>
    <title>Blogs | Jafar Bakhshaliyev | Universität Hildesheim </title>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
	<meta name="description" content="" />
	<meta name="keywords" content="" />
    <noscript>
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="/css/skel.css" />
        <link rel="stylesheet" href="/css/style-xlarge.css" />
    </noscript>
    <link rel="stylesheet" type="text/css"
    href="https://fonts.googleapis.com/css?family=Raleway:400,700">
    <link rel="stylesheet" type="text/css"
    href="https://fonts.googleapis.com/css?family=Open+Sans">
    <script src="https://kit.fontawesome.com/7c0ff2a316.js" crossorigin="anonymous"></script>
    <!--[if lte IE 8]><script src="../js/html5shiv.js"></script><![endif]-->
    <script src="/js/jquery.min.js"></script>
    <script src="/js/skel.min.js"></script>
    <script src="/js/skel-layers.min.js"></script>
    <script src="/js/init.js"></script> <!-- NOTE: Pulls CSS files from static server -->
    <script src='https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML'></script>
 
</head>
<body class="landing">




<!-- Header -->
<header id="header">
    <ul class="icons">

        <li>
            <a href="https://github.com/jafarbakhshaliyev" class="icon fa-brands fa-github"></a>
        </li>
        <li>
            <a href="https://twitter.com/JafarBakhshali1" class="icon fa-brands fa-twitter"></a>
        </li>
        <li>
            <a href="https://www.linkedin.com/in/jafarbakhshaliyev" class="icon fa-brands fa-linkedin"></a>
        </li>
    </ul>
    <nav id="nav">
        <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/#two">Projects</a></li>
            <li><a href="/blogs">Blogs</a></li>
            <li><a href="/books/" class="active">Books</a></li>
            <li><a href="/books/#footer">Contact</a></li>
        </ul>
    </nav>
</header>

<section class="bookshelf-container">
    <div class="shelf-label">Fiction Favorites</div>
    <div class="bookshelf-row">
        <div class="hover-zone hover-zone-left"></div>
        <div class="hover-zone hover-zone-right"></div>
        <div class="books-wrapper">
            <div class="book-item">
                <img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-02DqG9D_KFiO9mJkOCbghE4Qy_xKn3mI_w&s" alt="Book 1" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71FCbiv0tTL._AC_UF894,1000_QL80_.jpg" alt="Book 2" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71ctoEf31uL.jpg" alt="Book 3" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/81NGPHGrLvL._AC_UF1000,1000_QL80_.jpg" alt="Book 4" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71eN9CfdyQL._AC_UF1000,1000_QL80_.jpg" alt="Book 5" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71t4Lhu+kVL._UF1000,1000_QL80_.jpg" alt="Book 6" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/81bwTmr2tBL._AC_UF1000,1000_QL80_.jpg" alt="Book 7" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div
            <!-- Add more book-items here -->
        </div>
        <button class="nav-button nav-prev">←</button>
        <button class="nav-button nav-next">→</button>
    </div>


    <div class="shelf-label">Philosophy</div>
    <div class="bookshelf-row">
        <div class="hover-zone hover-zone-left"></div>
        <div class="hover-zone hover-zone-right"></div>
        <div class="books-wrapper">
            <div class="book-item">
                <img src=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-02DqG9D_KFiO9mJkOCbghE4Qy_xKn3mI_w&s" alt="Book 1" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71FCbiv0tTL._AC_UF894,1000_QL80_.jpg" alt="Book 2" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71ctoEf31uL.jpg" alt="Book 3" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/81NGPHGrLvL._AC_UF1000,1000_QL80_.jpg" alt="Book 4" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71eN9CfdyQL._AC_UF1000,1000_QL80_.jpg" alt="Book 5" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/71t4Lhu+kVL._UF1000,1000_QL80_.jpg" alt="Book 6" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div>
            <div class="book-item">
                <img src="https://m.media-amazon.com/images/I/81bwTmr2tBL._AC_UF1000,1000_QL80_.jpg" alt="Book 7" class="book-cover">
                <div class="book-info">
                    <div class="book-title">1984</div>
                    <div class="book-description">A dystopian masterpiece that remains relevant today. Highly recommended for its thought-provoking themes.</div>
                </div>
            </div
            <!-- Add more book-items here -->
        </div>
        <button class="nav-button nav-prev">←</button>
        <button class="nav-button nav-next">→</button>
    </div>
</section>

<script>
document.querySelectorAll('.bookshelf-row').forEach(shelf => {
    const books = Array.from(shelf.querySelectorAll('.book-item'));
    let currentIndex = 0;
    let isAnimating = false;
    let activeInfoBook = null;
    // Add these new variables at the top with the other declarations
    let autoplayInterval;
    let isUserInteracting = false;

    // Add this function after updateBooks()
    function startAutoplay() {
        if (!isUserInteracting) {
            autoplayInterval = setInterval(() => {
                // If we're at the last book, go back to the first
                if (currentIndex >= books.length - 1) {
                    currentIndex = 0;
                } else {
                    currentIndex++;
                }
                updateBooks();
            }, 4000); // Change every 3 seconds (adjust this value for faster/slower rotation)
        }
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }


    function updateBooks() {
        books.forEach((book, index) => {
            book.classList.remove('visible', 'center', 'left', 'right', 'show-info');
            
            if (index === currentIndex) {
                book.classList.add('visible', 'center');
            } else if (index === currentIndex - 1) {
                book.classList.add('visible', 'left');
            } else if (index === currentIndex + 1) {
                book.classList.add('visible', 'right');
            }
        });
    }

    // Modify the navigation function to handle autoplay
    function navigate(direction) {
        if (isAnimating) return;
        
        isUserInteracting = true;
        stopAutoplay();
        
        const newIndex = currentIndex + direction;
        if (newIndex >= 0 && newIndex < books.length) {
            isAnimating = true;
            currentIndex = newIndex;
            clearActiveInfo();
            updateBooks();
            setTimeout(() => {
                isAnimating = false;
            }, 800);
        }

        // Restart autoplay after 5 seconds of no interaction
        setTimeout(() => {
            isUserInteracting = false;
            startAutoplay();
        }, 5000);
    }


    // Add interaction handlers for hover zones
    shelf.addEventListener('mouseenter', () => {
        isUserInteracting = true;
        stopAutoplay();
    });

    shelf.addEventListener('mouseleave', () => {
        isUserInteracting = false;
        startAutoplay();
    });

    function clearActiveInfo() {
        if (activeInfoBook) {
            activeInfoBook.classList.remove('show-info');
            activeInfoBook = null;
        }
    }

    // Modify book click handler
    books.forEach((book, index) => {
        book.addEventListener('click', (e) => {
            if (!book.classList.contains('visible')) return;
            
            isUserInteracting = true;
            stopAutoplay();
            
            if (activeInfoBook === book) {
                clearActiveInfo();
            } else {
                clearActiveInfo();
                book.classList.add('show-info');
                activeInfoBook = book;
                
                if (index !== currentIndex) {
                    currentIndex = index;
                    updateBooks();
                }
            }

            // Restart autoplay after 5 seconds
            setTimeout(() => {
                isUserInteracting = false;
                startAutoplay();
            }, 5000);
        });
    });

    // Navigation zones
    const leftZone = shelf.querySelector('.hover-zone-left');
    const rightZone = shelf.querySelector('.hover-zone-right');
    
    let navigationTimeout;
    
    leftZone.addEventListener('mouseenter', () => {
        if (currentIndex > 0) {
            clearTimeout(navigationTimeout);
            navigationTimeout = setTimeout(() => navigate(-1), 300);
        }
    });

    rightZone.addEventListener('mouseenter', () => {
        if (currentIndex < books.length - 1) {
            clearTimeout(navigationTimeout);
            navigationTimeout = setTimeout(() => navigate(1), 300);
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                if (currentIndex > 0) {
                    navigate(-1);
                }
                break;
            case 'ArrowRight':
                if (currentIndex < books.length - 1) {
                    navigate(1);
                }
                break;
            case 'Escape':
                clearActiveInfo();
                break;
        }
    });

    // Click outside to close info
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.book-item')) {
            clearActiveInfo();
        }
    });

    // Initial setup
    startAutoplay();
    updateBooks();
});
   
</script>>
</section>


    

<!-- Footer -->
<footer id="footer">
    <div class="container">
        <h2>Get in touch</h2>
        <ul class="icons">
            <li>
                <a href="https://github.com/jafarbakhshaliyev" class="icon fa-brands fa-github"></a>
            </li>
            <li>
                <a href="https://twitter.com/JafarBakhshali1" class="icon fa-brands fa-twitter"></a>
            </li>
            <li>
                <a href="https://www.linkedin.com/in/jafarbakhshaliyev" class="icon fa-brands fa-linkedin"></a>
            </li>
        </ul>
        <ul class="copyright">
            <li>&copy; 2023 Jafar Bakhshaliyev</li>
        </ul>
    </div>
</footer>

</body>
</html>