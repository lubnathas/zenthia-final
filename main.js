/* ==========================================================================
   ZENTHIA EXPORTS - COMPREHENSIVE INTERACTIVE JAVASCRIPT
   Modern Animations, Physics particle canvas, 3D Page flip, and Smart form toggles
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. CUSTOM CURSOR WITH INTERPOLATED TRAILING RING
     ========================================================================== */
  const cursorDot = document.getElementById('custom-cursor-dot');
  const cursorRing = document.getElementById('custom-cursor-ring');

  let mouseX = 0;
  let mouseY = 0;
  let ringX = 0;
  let ringY = 0;

  let sparkleCounter = 0;
  // Track pointer movements
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Position dot immediately
    if (cursorDot) {
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    }

    // Sparkle trail trigger
    sparkleCounter++;
    if (sparkleCounter % 3 === 0) {
      createSparkle(e.clientX, e.clientY);
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.classList.add('cursor-sparkle');
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    
    const dx = (Math.random() - 0.5) * 50;
    const dy = (Math.random() - 0.5) * 50;
    sparkle.style.setProperty('--dx', `${dx}px`);
    sparkle.style.setProperty('--dy', `${dy}px`);
    
    const size = Math.random() * 3 + 2; // 2px to 5px
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    
    document.body.appendChild(sparkle);
    setTimeout(() => {
      sparkle.remove();
    }, 700);
  }

  // Smooth lerp (linear interpolation) for the trailing ring
  function animateCursor() {
    const ease = 0.15; // Delay multiplier
    
    ringX += (mouseX - ringX) * ease;
    ringY += (mouseY - ringY) * ease;

    if (cursorRing) {
      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Add scale animation on clickable elements
  const clickables = document.querySelectorAll('a, button, select, input, textarea, .step-column, .btn-explore-grades, .form-toggle-btn');
  clickables.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (cursorRing) {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorRing.style.borderColor = 'rgba(201, 168, 76, 0.9)';
      }
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.6)';
        cursorDot.style.backgroundColor = '#F5F0E8';
      }
    });

    el.addEventListener('mouseleave', () => {
      if (cursorRing) {
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.borderColor = 'rgba(201, 168, 76, 0.45)';
      }
      if (cursorDot) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.backgroundColor = '#C9A84C';
      }
    });
  });

  // Hide custom cursor when pointer leaves document window
  document.addEventListener('mouseleave', () => {
    if (cursorDot) cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    if (cursorDot) cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });


  /* ==========================================================================
     2. HERO CANVAS: FLOATING GOLD PARTICLE NETWORK
     ========================================================================== */
  const canvas = document.getElementById('hero-particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 120;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.35; // Very slow drift speeds
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.5; // Small premium dots
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce back gently
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 168, 76, ${this.alpha})`;
        ctx.fill();
      }
    }

    function initCanvas() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.12; // Thin transparent gold lines
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawLines();
      requestAnimationFrame(animateParticles);
    }

    // Set up particles on resize
    initCanvas();
    animateParticles();
    window.addEventListener('resize', initCanvas);
  }


  /* ==========================================================================
     3. SCROLL REVEALS & NAVBAR SOLIDIFYING SCROLL TRIGGERS
     ========================================================================== */
  const navbar = document.getElementById('main-header');
  
  // Solidify navbar background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Intersection Observer scroll reveals
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Unobserve once revealed for optimized performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  revealElements.forEach((el) => {
    revealObserver.observe(el);
  });


  /* ==========================================================================
     4. MOBILE MENU ACCORDION TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close mobile menu on click nav links
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle), .dropdown-content a');
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }


  /* ==========================================================================
     5. ABOUT US PHILOSOPHY PARALLAX ENGINE
     ========================================================================== */
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  
  window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    parallaxBgs.forEach((bg) => {
      const parent = bg.closest('.parallax-container');
      if (parent) {
        const parentTop = parent.offsetTop;
        const parentHeight = parent.offsetHeight;
        
        // Check if container is in viewport
        if (scrollPosition + window.innerHeight > parentTop && scrollPosition < parentTop + parentHeight) {
          const relativeScroll = scrollPosition - parentTop;
          // Apply slow movement factor
          bg.style.transform = `translateY(${relativeScroll * 0.16}px)`;
        }
      }
    });
  });


  /* ==========================================================================
     6. OUR STORY INTERACTIVE BOOK UI (3D FLIP)
     ========================================================================== */
  const bookSpreads = [
    {
      left: {
        chapter: "Chapter I",
        title: "The Beginning",
        body: "Zenthia Exports was born from a simple yet ambitious realization: the world's finest goods often lose their soul by the time they cross an ocean. Founded by a team of visionaries with deep roots in international trade and local craftsmanship, Zenthia was established to prove that premium quality and ethical scale can exist in the same shipment."
      },
      right: {
        chapter: "Chapter II",
        title: "The Network",
        body: "What started as a focused mission to export high caliber products has evolved into a global network of trust. We don't just move cargo; we curate heritage. By working directly with producers, from the sun drenched fields to the artisan workshops, we ensure that every product exported under the Zenthia seal maintains its integrity, purity, and story."
      }
    }
  ];

  let currentSpreadIndex = 0;

  const pageLeft = document.getElementById('page-left-content');
  const pageRight = document.getElementById('page-right-content');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const bookCounter = document.getElementById('book-counter');

  function updateBookPage(index) {
    if (!pageLeft || !pageRight) return;

    // Apply 3D flipping class to pages
    pageLeft.classList.add('page-turning-left');
    pageRight.classList.add('page-turning-right');

    // Midway through flip, swap text nodes so change looks physical
    setTimeout(() => {
      const data = bookSpreads[index];

      // Left page elements
      document.getElementById('lbl-left').textContent = data.left.chapter;
      document.getElementById('title-left').textContent = data.left.title;
      document.getElementById('body-left').textContent = data.left.body;

      // Right page elements
      document.getElementById('lbl-right').textContent = data.right.chapter;
      document.getElementById('title-right').textContent = data.right.title;
      document.getElementById('body-right').textContent = data.right.body;
      
      // Update page index indicator
      if (bookCounter) {
        bookCounter.textContent = `${index + 1} / ${bookSpreads.length}`;
      }
    }, 250);

    // Remove animation classes once completed
    setTimeout(() => {
      pageLeft.classList.remove('page-turning-left');
      pageRight.classList.remove('page-turning-right');
    }, 550);

    // Button disabled states
    if (btnPrev && btnNext) {
      btnPrev.disabled = index === 0;
      btnNext.disabled = index === bookSpreads.length - 1;
    }
  }

  // Story spreads event listeners
  if (btnPrev && btnNext) {
    btnPrev.addEventListener('click', () => {
      if (currentSpreadIndex > 0) {
        currentSpreadIndex--;
        updateBookPage(currentSpreadIndex);
      }
    });

    btnNext.addEventListener('click', () => {
      if (currentSpreadIndex < bookSpreads.length - 1) {
        currentSpreadIndex++;
        updateBookPage(currentSpreadIndex);
      }
    });

    // Run initial configuration
    updateBookPage(0);
  }


  /* ==========================================================================
     7. PROCESS SECTION: ROAD TRACK & AUTO-CYCLING LOGISTICS VAN TRACKER
     ========================================================================== */
  const vanIcon = document.getElementById('van-icon');
  const progressLine = document.getElementById('progress-fill-line');
  const steps = document.querySelectorAll('.step-column');
  let activeStep = 0;
  let vanTimer = null;

  // Horizontal offsets for van coordinates corresponding to 4 steps
  // Perfectly matches centered 80% track line (left: 10%, width: 80%)
  const vanPositions = ['10%', '36.6%', '63.3%', '90%'];
  const progressWidths = ['0%', '26.6%', '53.3%', '80%'];

  function moveToStep(index) {
    if (!vanIcon) return;
    
    // Shift active classes on columns
    steps.forEach((col, idx) => {
      if (idx === index) {
        col.classList.add('active');
      } else {
        col.classList.remove('active');
      }
    });

    // Slide van physically along track
    vanIcon.style.left = vanPositions[index];

    // Fills gold progress line behind the van as it moves
    if (progressLine) {
      progressLine.style.width = progressWidths[index];
    }

    activeStep = index;
  }

  function startVanAutoCycle() {
    vanTimer = setInterval(() => {
      const nextStep = (activeStep + 1) % steps.length;
      moveToStep(nextStep);
    }, 2400); // Cycles stages every 2.4s
  }

  function resetVanTimer() {
    clearInterval(vanTimer);
    startVanAutoCycle();
  }

  // Step click handling
  steps.forEach((step, idx) => {
    step.addEventListener('click', () => {
      moveToStep(idx);
      resetVanTimer(); // Reset auto cycling clock on manual clicks
    });
  });

  // Run cycle init
  if (steps.length > 0) {
    moveToStep(0);
    startVanAutoCycle();
  }


  /* ==========================================================================
     8. DYNAMIC BACKGROUND SPICE PODS GENERATOR
     ========================================================================== */
  const podsContainer = document.getElementById('falling-pods-container');
  if (podsContainer) {
    const types = ['cardamom', 'pepper', 'cashew'];
    const totalPods = 30;

    for (let i = 0; i < totalPods; i++) {
      const pod = document.createElement('div');
      const podType = types[Math.floor(Math.random() * types.length)];
      
      pod.classList.add('spice-particle', podType);

      // Random sizes corresponding to different spices
      let size = 10;
      if (podType === 'cardamom') {
        size = Math.random() * 10 + 12; // Cardamoms larger
      } else if (podType === 'pepper') {
        size = Math.random() * 6 + 6;   // Peppercorns smaller
      } else {
        size = Math.random() * 8 + 10;  // Cashews standard
      }

      // Physics/CSS layouts
      pod.style.left = `${Math.random() * 100}%`;
      pod.style.width = `${size}px`;
      pod.style.height = `${podType === 'pepper' ? size : size * 1.5}px`;
      
      const duration = Math.random() * 10 + 8; // 8s to 18s drift
      const delay = Math.random() * -15;       // Stagger delay negative so they start pre-spread
      const opacity = Math.random() * 0.18 + 0.08;

      pod.style.animationDuration = `${duration}s`;
      pod.style.animationDelay = `${delay}s`;
      pod.style.opacity = opacity;

      podsContainer.appendChild(pod);
    }
  }


  /* ==========================================================================
     9. MODAL DYNAMIC SPECIFICATIONS SYSTEM
     ========================================================================== */
  const gradesData = {
    cashew: {
      title: "Cashew Nuts Specifications",
      tag: "W GRADE EXPORT SPECIFICATION",
      rows: [
        { code: "W210", size: "Jumbo · 210 nuts/lb", desc: "Premium retail and export. The largest and most prized cashew grade." },
        { code: "W240", size: "Large · 240 nuts/lb", desc: "High end snacks; very popular for export. Sought after in Middle Eastern and European markets." },
        { code: "W320", size: "Standard · 320 nuts/lb", desc: "The global industry standard; most widely traded grade." }
      ]
    },
    pepper: {
      title: "Black Pepper Specifications",
      tag: "GARBLED GRADE EXPORT SPECIFICATION",
      rows: [
        { code: "TGSEB", size: "Tellicherry Garbled Special Extra Bold · 5mm+", desc: "The pinnacle of black pepper grading. Exceptionally large, uniform berries with deep black color and intense aroma." },
        { code: "TGEB", size: "Tellicherry Garbled Extra Bold · 4.5 to 5mm", desc: "Extra Bold grade with uniform deep black color. Highly preferred in gourmet and premium spice markets worldwide." },
        { code: "MG 1", size: "Malabar Garbled · 4 to 4.5mm", desc: "Standard export grade from the Malabar coast. Clean, machine graded, widely used for food processing." }
      ]
    },
    cardamom: {
      title: "Cardamom Specifications",
      tag: "GREEN GRADE EXPORT SPECIFICATION",
      rows: [
        { code: "Super Bold", size: "8mm+", desc: "The premium tier. Uniform, deep green pods, highly aromatic." },
        { code: "Extra Bold", size: "7 to 8mm+", desc: "Premium quality, highly preferred for large size and aroma. Ideal for Middle Eastern and European markets." },
        { code: "AGB", size: "6.5 to 7mm", desc: "Excellent quality, commonly requested in Middle Eastern markets." },
        { code: "Bold", size: "6mm+", desc: "High quality, often used for industrial consumption or mixed packing." }
      ]
    }
  };

  const gradesModal = document.getElementById('grades-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const modalTag = document.getElementById('modal-tag-el');
  const modalTitle = document.getElementById('modal-title-el');
  const gradesTableBody = document.getElementById('grades-table-body');

  function openGradesModal(productKey) {
    if (!gradesModal || !gradesTableBody || !gradesData[productKey]) return;

    const data = gradesData[productKey];
    
    // Set headers
    modalTag.textContent = data.tag;
    modalTitle.textContent = data.title;

    // Clear body and render new rows
    gradesTableBody.innerHTML = '';
    data.rows.forEach((row) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${row.code}</strong></td>
        <td>${row.size}</td>
        <td>${row.desc}</td>
      `;
      gradesTableBody.appendChild(tr);
    });

    // Trigger overlay class
    gradesModal.classList.add('active');
  }

  function closeModal() {
    if (gradesModal) {
      gradesModal.classList.remove('active');
    }
  }

  // Attach buttons events
  const exploreButtons = document.querySelectorAll('.btn-explore-grades');
  exploreButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const product = btn.getAttribute('data-product');
      openGradesModal(product);
    });
  });

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  
  // Close on backdrop clicks
  if (gradesModal) {
    gradesModal.addEventListener('click', (e) => {
      if (e.target === gradesModal) closeModal();
    });
  }

  // Close on escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });


  /* ==========================================================================
     10. SMART FORM SUBMISSION: WHATSAPP / EMAIL PRECOMPILER
     ========================================================================== */
  const toggleWhatsapp = document.getElementById('toggle-whatsapp');
  const toggleEmail = document.getElementById('toggle-email');
  const inquiryForm = document.getElementById('inquiry-form');
  
  let submissionMethod = 'email'; // Default channel

  if (toggleWhatsapp && toggleEmail) {
    toggleWhatsapp.addEventListener('click', () => {
      submissionMethod = 'whatsapp';
      toggleWhatsapp.classList.add('active');
      toggleEmail.classList.remove('active');
    });

    toggleEmail.addEventListener('click', () => {
      submissionMethod = 'email';
      toggleEmail.classList.add('active');
      toggleWhatsapp.classList.remove('active');
    });
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Gather input nodes
      const name = document.getElementById('frm-name').value.trim();
      const company = document.getElementById('frm-company').value.trim();
      const country = document.getElementById('frm-country').value.trim();
      const phone = document.getElementById('frm-phone').value.trim();
      const product = document.getElementById('frm-product').value;
      const grade = document.getElementById('frm-grade').value.trim();
      const reqs = document.getElementById('frm-reqs').value.trim();

      // Compile message content
      const msgHeader = `*ZENTHIA EXPORTS - EXPORT ENQUIRY*`;
      const msgBody = 
`Name: ${name}
Company: ${company}
Country: ${country}
Phone/WhatsApp: ${phone}
Product Requested: ${product}
Grade & Quantity: ${grade}
Requirements: ${reqs}`;

      const fullMessage = `${msgHeader}\n\n${msgBody}`;

      if (submissionMethod === 'whatsapp') {
        // Compile wa.me preformatted text link
        const whatsappNumber = '917025306759'; // Target real WhatsApp business number
        const encodedText = encodeURIComponent(fullMessage);
        const waLink = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
        
        window.open(waLink, '_blank');
      } else {
        // Compile mailto link details
        const emailAddress = 'info@zenthiaexports.com';
        const subject = encodeURIComponent(`Export Inquiry: ${product} - ${company}`);
        const body = encodeURIComponent(fullMessage.replace(/\*/g, '')); // Strip bold markdown asterisks for email plain text
        const mailtoLink = `mailto:${emailAddress}?subject=${subject}&body=${body}`;
        
        window.location.href = mailtoLink;
      }
    });
  }

  // Contact Canvas Particle Network (65 small gold dots, radius 1-2px, connected when within 110px)
  const contactCanvas = document.getElementById('contact-particles');
  if (contactCanvas) {
    const contactCtx = contactCanvas.getContext('2d');
    let contactParticles = [];
    const contactParticleCount = 65;
    const contactConnectionDistance = 110;

    class ContactParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * contactCanvas.width;
        this.y = Math.random() * contactCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.25; // Very slow drift
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 1 + 1; // 1-2px radius
        this.alpha = Math.random() * 0.4 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > contactCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > contactCanvas.height) this.vy *= -1;
      }

      draw() {
        contactCtx.beginPath();
        contactCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        contactCtx.fillStyle = `rgba(201, 168, 76, ${this.alpha * 0.6})`;
        contactCtx.fill();
      }
    }

    function initContactCanvas() {
      contactCanvas.width = contactCanvas.offsetWidth;
      contactCanvas.height = contactCanvas.offsetHeight;
      contactParticles = [];
      for (let i = 0; i < contactParticleCount; i++) {
        contactParticles.push(new ContactParticle());
      }
    }

    function drawContactLines() {
      for (let i = 0; i < contactParticles.length; i++) {
        for (let j = i + 1; j < contactParticles.length; j++) {
          const dx = contactParticles[i].x - contactParticles[j].x;
          const dy = contactParticles[i].y - contactParticles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < contactConnectionDistance) {
            const alpha = (1 - dist / contactConnectionDistance) * 0.08;
            contactCtx.beginPath();
            contactCtx.moveTo(contactParticles[i].x, contactParticles[i].y);
            contactCtx.lineTo(contactParticles[j].x, contactParticles[j].y);
            contactCtx.strokeStyle = `rgba(201, 168, 76, ${alpha})`;
            contactCtx.lineWidth = 0.5;
            contactCtx.stroke();
          }
        }
      }
    }

    function animateContactParticles() {
      contactCtx.clearRect(0, 0, contactCanvas.width, contactCanvas.height);
      contactParticles.forEach((p) => {
        p.update();
        p.draw();
      });
      drawContactLines();
      requestAnimationFrame(animateContactParticles);
    }

    initContactCanvas();
    animateContactParticles();
    window.addEventListener('resize', initContactCanvas);
  }

  // 18. Splash loader fadeout and DOM removal
  const splashLoader = document.getElementById('splash-loader');
  if (splashLoader) {
    setTimeout(() => {
      splashLoader.classList.add('fade-out');
      setTimeout(() => {
        splashLoader.remove();
      }, 900); // 900ms matching transition fadeout duration
    }, 3500); // 3.5s display time
  }

});
