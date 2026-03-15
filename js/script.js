(function() {
  console.log("Script loaded successfully");
  
  // ---------- FALLING PETALS (slowed) ----------
  const canvas = document.getElementById('petal-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let petals = [];

  class Petal {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * -height;
      this.size = 8 + Math.random() * 18;
      this.speedY = 0.2 + Math.random() * 0.5;
      this.speedX = 0.1 + Math.random() * 0.4;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotateSpeed = (Math.random() - 0.5) * 0.01;
      this.opacity = 0.4 + Math.random() * 0.5;
      this.color = `rgba(255, 180, 190, ${this.opacity})`;
    }
    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.y * 0.01) * 0.2 + this.speedX * 0.2;
      this.rotation += this.rotateSpeed;
      if (this.y > height + this.size) { this.reset(); this.y = -this.size; }
      if (this.x > width + 20) this.x = -20;
      if (this.x < -20) this.x = width + 20;
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 0.7, this.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = 'rgba(200, 120, 130, 0.2)';
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.restore();
    }
  }

  function initCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    petals = [];
    for (let i = 0; i < (width * 0.08); i++) petals.push(new Petal());
    console.log("Canvas initialized with", petals.length, "petals");
  }
  window.addEventListener('resize', initCanvas);
  initCanvas();
  function animatePetals() {
    ctx.clearRect(0, 0, width, height);
    petals.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animatePetals);
  }
  animatePetals();

  // ---------- CREATE CONFIRMATION MODAL (theme matching) ----------
  function createConfirmationModal(title, message, icon = '🌸', showCancel = false, onConfirm = null) {
    // Remove existing modal if any
    const existingModal = document.getElementById('theme-modal');
    if (existingModal) existingModal.remove();
    
    // Create modal container
    const modal = document.createElement('div');
    modal.id = 'theme-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    `;
    
    // Create backdrop
    const backdrop = document.createElement('div');
    backdrop.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(3px);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: all;
    `;
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
      background: rgba(255, 240, 245, 0.95);
      backdrop-filter: blur(10px);
      padding: 2.5rem 3rem;
      border-radius: 60px 20px 60px 20px;
      border: 2px solid #ffd8e0;
      box-shadow: 0 25px 40px -10px rgba(140, 70, 80, 0.4);
      text-align: center;
      transform: scale(0.8) translateY(20px);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.2);
      max-width: 450px;
      width: 90%;
      pointer-events: all;
      position: relative;
      z-index: 10000;
    `;
    
    // Add icon
    const iconEl = document.createElement('div');
    iconEl.style.cssText = `
      font-size: 4rem;
      margin-bottom: 0.5rem;
      animation: softFloat 3s infinite alternate ease-in-out;
    `;
    iconEl.textContent = icon;
    
    // Add title
    const titleEl = document.createElement('h3');
    titleEl.style.cssText = `
      font-size: 2rem;
      font-weight: 300;
      color: #633f48;
      margin: 0.5rem 0 0.5rem;
      letter-spacing: 2px;
    `;
    titleEl.textContent = title;
    
    // Add message
    const msgEl = document.createElement('p');
    msgEl.style.cssText = `
      font-size: 1.1rem;
      color: #7a4e5a;
      margin: 0.5rem 0 1.5rem;
      font-style: italic;
      border-left: 3px solid #ffb0c0;
      padding-left: 1rem;
      text-align: left;
      line-height: 1.5;
    `;
    msgEl.innerHTML = message;
    
    // Button container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      gap: 1rem;
      justify-content: center;
      margin-top: 1.5rem;
    `;
    
    // Add OK button
    const okBtn = document.createElement('button');
    okBtn.style.cssText = `
      background: #ffb3c6;
      border: none;
      padding: 0.8rem 2rem;
      border-radius: 50px;
      font-size: 1.1rem;
      font-weight: 500;
      color: #5d3842;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 8px 16px #ffb0c0;
      border: 1px solid #ffcbd6;
      letter-spacing: 1px;
      flex: ${showCancel ? '1' : 'auto'};
    `;
    okBtn.textContent = showCancel ? 'Try Again' : 'Got It ✨';
    okBtn.onmouseover = () => {
      okBtn.style.background = '#ffa2b9';
      okBtn.style.transform = 'scale(1.02)';
    };
    okBtn.onmouseout = () => {
      okBtn.style.background = '#ffb3c6';
      okBtn.style.transform = 'scale(1)';
    };
    okBtn.onclick = () => {
      // Fade out
      backdrop.style.opacity = '0';
      modalContent.style.opacity = '0';
      modalContent.style.transform = 'scale(0.8) translateY(20px)';
      setTimeout(() => modal.remove(), 400);
      if (onConfirm) onConfirm(false);
    };
    
    buttonContainer.appendChild(okBtn);
    
    // Add Cancel button if needed
    if (showCancel) {
      const cancelBtn = document.createElement('button');
      cancelBtn.style.cssText = `
        background: transparent;
        border: 2px solid #ffb3c6;
        padding: 0.8rem 2rem;
        border-radius: 50px;
        font-size: 1.1rem;
        font-weight: 500;
        color: #633f48;
        cursor: pointer;
        transition: 0.2s;
        letter-spacing: 1px;
        flex: 1;
      `;
      cancelBtn.textContent = 'Cancel';
      cancelBtn.onmouseover = () => {
        cancelBtn.style.background = '#ffe2e9';
      };
      cancelBtn.onmouseout = () => {
        cancelBtn.style.background = 'transparent';
      };
      cancelBtn.onclick = () => {
        // Fade out
        backdrop.style.opacity = '0';
        modalContent.style.opacity = '0';
        modalContent.style.transform = 'scale(0.8) translateY(20px)';
        setTimeout(() => modal.remove(), 400);
        if (onConfirm) onConfirm(true);
      };
      buttonContainer.appendChild(cancelBtn);
    }
    
    modalContent.appendChild(iconEl);
    modalContent.appendChild(titleEl);
    modalContent.appendChild(msgEl);
    modalContent.appendChild(buttonContainer);
    modal.appendChild(backdrop);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add keyframe animation for icon
    const style = document.createElement('style');
    style.textContent = `
      @keyframes softFloat {
        0% { transform: translateY(0) rotate(0deg); }
        100% { transform: translateY(-10px) rotate(5deg); }
      }
    `;
    document.head.appendChild(style);
    
    // Trigger animation after a tiny delay
    setTimeout(() => {
      backdrop.style.opacity = '1';
      modalContent.style.opacity = '1';
      modalContent.style.transform = 'scale(1) translateY(0)';
    }, 10);
    
    return modal;
  }

  // ---------- URL EXTENSION VALIDATION FUNCTION (NEW) ----------
  function hasImageExtension(url) {
    // Check if URL ends with common image extensions
    return url.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i) !== null;
  }

  // ---------- FLOWER DATA WITH PERMANENT STORAGE (no expiration) ----------
  const STORAGE_KEY = 'blushBloomFlowers';

  // Default flowers with local images
  const defaultFlowers = [
    { 
      name: "peony", 
      latin: "paeonia", 
      img: "images/peony.png", 
      desc: "Lush, full petals in soft pink.", 
      isDefault: true 
    },
    { 
      name: "rose", 
      latin: "rosa 'pink'", 
      img: "images/rose.png", 
      desc: "Classic romantic fragrance.", 
      isDefault: true 
    },
    { 
      name: "cherry blossom", 
      latin: "prunus", 
      img: "images/cherry.png", 
      desc: "Delicate spring blossoms.", 
      isDefault: true 
    },
    { 
      name: "camellia", 
      latin: "camellia japonica", 
      img: "images/camellia.png", 
      desc: "Smooth, waxy petals.", 
      isDefault: true 
    },
    { 
      name: "dahlia", 
      latin: "dahlia", 
      img: "images/dahlia.png", 
      desc: "Symmetrical and vibrant.", 
      isDefault: true 
    },
    { 
      name: "lotus", 
      latin: "nelumbo", 
      img: "images/lotus.png", 
      desc: "Sacred flower, serene.", 
      isDefault: true 
    }
  ];

  let flowers = [];

  function loadFlowers() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // ensure all stored flowers are marked as not default (user-added)
        parsed.forEach(f => f.isDefault = false);
        flowers = [...defaultFlowers, ...parsed];
        console.log("Loaded flowers from storage:", flowers.length, "total flowers");
        console.log("Your flowers are stored permanently in your browser!");
      } catch {
        flowers = [...defaultFlowers];
        console.log("Error parsing storage, using defaults");
      }
    } else {
      flowers = [...defaultFlowers];
      console.log("No storage found, using default flowers");
    }
  }

  function saveFlowers() {
    // only save user-added flowers (those with isDefault = false)
    const userFlowers = flowers.filter(f => !f.isDefault);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userFlowers));
    console.log("Saved user flowers permanently:", userFlowers.length);
    console.log("These flowers will stay here forever until you remove them.");
  }

  loadFlowers();

  const grid = document.getElementById('flowerGrid');
  console.log("Grid element:", grid);

  function renderFlowers() {
    if (!grid) {
      console.error("Grid element not found!");
      return;
    }
    
    grid.innerHTML = '';
    console.log("Rendering", flowers.length, "flowers");
    
    flowers.forEach((f, index) => {
      const card = document.createElement('div');
      card.className = 'flower-card';
      card.dataset.index = index;

      // Determine if remove button should appear (only for non-default)
      const showRemove = !f.isDefault;

      card.innerHTML = `
        <div class="flip-inner">
          <div class="card-front">
            <div class="image-morph">
              <img class="flower-img" src="${f.img}" alt="${f.name}" loading="lazy" 
                   onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'600\' height=\'600\' viewBox=\'0 0 600 600\'%3E%3Crect width=\'600\' height=\'600\' fill=\'%23ffd0d9\'/%3E%3Ctext x=\'300\' y=\'300\' font-size=\'40\' text-anchor=\'middle\' fill=\'%23633f48\' font-family=\'Arial\'%3E🌸%3C/text%3E%3Ctext x=\'300\' y=\'380\' font-size=\'24\' text-anchor=\'middle\' fill=\'%23633f48\' font-family=\'Arial\'%3E${f.name}%3C/text%3E%3C/svg%3E';">
            </div>
            <div class="flower-name">${f.name}</div>
            <div class="latin-name">${f.latin}</div>
          </div>
          <div class="card-back">
            <p>🌸 ${f.desc || 'A beautiful flower.'}</p>
            ${showRemove ? `<button class="remove-btn" data-index="${index}">remove</button>` : ''}
          </div>
        </div>
      `;

      // Add hover flip
      card.addEventListener('mouseenter', () => {
        card.classList.add('flipped');
      });
      
      card.addEventListener('mouseleave', () => {
        card.classList.remove('flipped');
      });

      if (showRemove) {
        const removeBtn = card.querySelector('.remove-btn');
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation(); // Prevent the card from flipping when clicking remove
          flowers.splice(index, 1);
          saveFlowers();
          renderFlowers();
          // Show removal confirmation
          createConfirmationModal(
            'Flower Removed', 
            `${f.name} has been gently removed from your garden.`,
            '🍂'
          );
        });
      }

      grid.appendChild(card);
    });
  }

  renderFlowers();

  

  // ADD NEW FLOWER (always user-added, deletable) - NO DEFAULT VALUES
  const addBtn = document.getElementById('addFlowerBtn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const name = document.getElementById('flowerName').value.trim();
      const latin = document.getElementById('flowerLatin').value.trim();
      const imgUrl = document.getElementById('flowerImage').value.trim();
      const desc = document.getElementById('flowerDesc').value.trim();
      
      if (!name || !latin || !imgUrl) { 
        createConfirmationModal(
          'Missing Information', 
          'Please fill in:<br>• Flower name<br>• Latin/subtitle name<br>• Image URL',
          '⚠️'
        );
        return; 
      }
      
      // ---------- NEW: Check if URL has image extension ----------
      if (!hasImageExtension(imgUrl)) {
        createConfirmationModal(
          '❌ Invalid Image URL',
          `The URL you provided doesn't end with an image extension.<br><br>
           <strong>Valid image extensions:</strong><br>
           • .jpg, .jpeg<br>
           • .png<br>
           • .gif<br>
           • .webp<br>
           • .svg<br>
           • .bmp, .ico<br><br>
           <strong>Your URL:</strong> <span style="color:#a03e55; word-break:break-all;">${imgUrl}</span><br><br>
           <strong>Tip:</strong> Right-click on an image and select "Open image in new tab" to get the correct URL.`,
          '🔗',
          true,
          (cancelled) => {
            if (!cancelled) {
              // User clicked "Try Again" - keep the form as is
              document.getElementById('flowerImage').focus();
            }
          }
        );
        return;
      }

      // Validate URL format
      try { 
        new URL(imgUrl); 
      } catch { 
        createConfirmationModal(
          '❌ Invalid URL Format',
          `The URL must start with http:// or https://`,
          '🌐',
          true,
          (cancelled) => {
            if (!cancelled) {
              document.getElementById('flowerImage').focus();
            }
          }
        );
        return;
      }

      // new flower: isDefault = false
      flowers.push({ 
        name, 
        latin, 
        img: imgUrl, 
        desc: desc || 'A lovely addition.',
        isDefault: false 
      });

      saveFlowers();
      renderFlowers();

      // Clear all inputs completely
      document.getElementById('flowerName').value = '';
      document.getElementById('flowerLatin').value = '';
      document.getElementById('flowerImage').value = '';
      document.getElementById('flowerDesc').value = '';
      
      // Show beautiful confirmation modal
      createConfirmationModal(
        'Flower Added!', 
        `${name} has been added to your garden. It will stay here forever.`,
        '🌱'
      );
    });
  } else {
    console.error("Add button not found");
  }

  const emailJSScript = document.createElement('script');
  emailJSScript.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  document.head.appendChild(emailJSScript);

  // Replace these with your actual EmailJS credentials
  const EMAILJS_PUBLIC_KEY = 'xlO6-BJ47ULnxWji1'; // Get from EmailJS Dashboard → Account → API Keys
  const EMAILJS_SERVICE_ID = 'service_s14u6k8'; // Get from EmailJS Dashboard → Email Services
  const EMAILJS_TEMPLATE_ID = 'template_ecoi6e3'; // Get from EmailJS Dashboard → Email Templates

  emailJSScript.onload = () => {
    // Initialize EmailJS with your Public Key
    emailjs.init(EMAILJS_PUBLIC_KEY);
    console.log('EmailJS initialized successfully');
  };

  // CONTACT FORM - Send email to admin (NO EMAIL FIELD)
  const sendBtn = document.getElementById('sendMessageBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent any default behavior
      
      const name = document.getElementById('name').value.trim();
      const message = document.getElementById('message').value.trim();
      
      if (!name || !message) {
        createConfirmationModal(
          'Missing Information', 
          'Please enter both your name and message.',
          '⚠️'
        );
        return;
      }
      
      // Show sending status
      const originalText = sendBtn.textContent;
      sendBtn.textContent = 'Sending... ✉️';
      sendBtn.disabled = true;
      
      // Prepare email parameters - ONLY name and message (no email field)
      const templateParams = {
        name: name,           // Matches {{name}} in template
        message: message       // Matches {{message}} in template
        // NO email parameter - user doesn't provide it
      };
      
      console.log('Sending email with params:', templateParams);
      
      // Send email using EmailJS
      emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      )
      .then(function(response) {
        console.log('Email sent successfully!', response);
        
        // Clear contact form
        document.getElementById('name').value = '';
        document.getElementById('message').value = '';
        
        // Show success modal
        createConfirmationModal(
          'Message Sent!', 
          `Thank you ${name}! Your message has been delivered.`,
          '✉️'
        );
      })
      .catch(function(error) {
        console.error('Email sending failed:', error);
        
        // Show error modal
        createConfirmationModal(
          'Message Failed', 
          'Sorry, your message could not be sent. Please try again later.',
          '❌'
        );
      })
      .finally(function() {
        // Restore button
        sendBtn.textContent = originalText;
        sendBtn.disabled = false;
      });
    });
  }

  // parallax
  const bgLayer = document.getElementById('parallaxBg');
  if (bgLayer) {
    window.addEventListener('scroll', () => bgLayer.style.setProperty('--scrollY', window.scrollY));
  }
})();