// ============================================================
// PATH GUIDER — App Logic
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Particle / Star field ──────────────────────────────────
  createStarField();

  // ── Smooth scroll for nav links ───────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── Mobile nav toggle ─────────────────────────────────────
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');
  if (burger) {
    burger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      burger.classList.toggle('active');
    });
  }

  // ── Form submission ───────────────────────────────────────
  const form = document.getElementById('analysis-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name   = document.getElementById('user-name').value.trim();
      const dob    = document.getElementById('user-dob').value;
      const gender = document.getElementById('user-gender').value;
      const cob    = document.getElementById('user-cob').value.trim();
      const mobile = document.getElementById('user-mobile').value.trim();

      if (!name || !dob || !gender || !cob || !mobile) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^\d{10,15}$/.test(mobile.replace(/[\s\-\+]/g, ''))) {
        showToast('Please enter a valid mobile number.', 'error');
        return;
      }

      await startAnalysisAnimation();
      const result = runFullAnalysis(name, dob, mobile);
      result.gender = gender;
      result.cob = cob;
      // email and photo will be added later if they purchase
      result.email = "Not Provided";
      result.photoBase64 = "";
      
      window.currentReadingResult = result;

      // Log the lead silently to the backend database
      try {
        fetch('/log-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, dob, gender, mobile, email: "Not Provided" })
        });
      } catch(e) { console.error('Silent logging failed', e); }

      displayResults(result);
    });
  }

  // ── 3D Tilt Initialization ─────────────────────────────────
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.step-card, .service-card, .trust-card, .testi-card'), {
      max: 18, speed: 500, glare: true, "max-glare": 0.35, scale: 1.05, perspective: 1000
    });
  }




  // ── Scroll Reveal ─────────────────────────────────────────────────────────
  const _ro = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  const _observe = () => document.querySelectorAll('.reveal, .reveal-blur').forEach(el => _ro.observe(el));
  _observe();


  // ── Signature Photo Preview ──────────────────────────────────
  const sigPhotoInput = document.getElementById('sig-photo');
  const sigUploadZone = document.getElementById('sig-upload-zone');
  if (sigPhotoInput) {
    sigPhotoInput.addEventListener('change', function() {
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        document.getElementById('sig-preview-img').src = ev.target.result;
        document.getElementById('sig-preview-container').style.display = 'block';
        sigUploadZone.style.borderColor = 'rgba(72,201,176,.7)';
        sigUploadZone.style.background = 'rgba(72,201,176,.05)';
      };
      reader.readAsDataURL(file);
    });
    if (sigUploadZone) {
      sigUploadZone.addEventListener('dragover', e => {
        e.preventDefault();
        sigUploadZone.style.borderColor = 'rgba(245,176,65,.9)';
      });
      sigUploadZone.addEventListener('dragleave', () => {
        sigUploadZone.style.borderColor = 'rgba(245,176,65,.4)';
      });
      sigUploadZone.addEventListener('drop', e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          const dt = new DataTransfer();
          dt.items.add(file);
          sigPhotoInput.files = dt.files;
          sigPhotoInput.dispatchEvent(new Event('change'));
        }
      });
    }
  }

  // ── Signature Analysis Form Submission ──────────────────────
  const sigForm = document.getElementById('signature-form');
  if (sigForm) {
    let appliedPromoCode = null;
    let currentPrice = 79;
    
    // Promo Code Logic
    const promoBtn = document.getElementById('sig-apply-promo');
    if (promoBtn) {
      promoBtn.addEventListener('click', async () => {
        const codeInput = document.getElementById('sig-promo').value.trim();
        const msgDiv = document.getElementById('sig-promo-msg');
        const priceDisplay = document.getElementById('sig-price-display');
        
        if (!codeInput) {
          msgDiv.style.color = '#ff4444';
          msgDiv.innerText = 'Please enter a code';
          return;
        }
        
        try {
          promoBtn.innerText = '...';
          const res = await fetch('/signature/validate-promo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: codeInput })
          });
          const data = await res.json();
          
          if (data.success) {
            appliedPromoCode = codeInput;
            if (data.promo.fixedPrice !== undefined) {
              currentPrice = data.promo.fixedPrice;
            } else {
              const discount = data.promo.discountPercentage;
              currentPrice = Math.round(79 - (79 * (discount / 100)));
            }
            
            msgDiv.style.color = '#00e676';
            msgDiv.innerText = data.promo.message;
            priceDisplay.innerHTML = `<del style="color:#888; font-size:1rem;">₹79</del> ₹${currentPrice}`;
          } else {
            msgDiv.style.color = '#ff4444';
            msgDiv.innerText = data.error;
            appliedPromoCode = null;
            currentPrice = 79;
            priceDisplay.innerHTML = `₹79`;
          }
        } catch(err) {
          msgDiv.style.color = '#ff4444';
          msgDiv.innerText = 'Error validating code';
        } finally {
          promoBtn.innerText = 'Apply';
        }
      });
    }

    sigForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = document.getElementById('sig-pay-btn');
      const btnText = document.getElementById('sig-btn-text');
      const name = document.getElementById('sig-name').value.trim();
      const email = document.getElementById('sig-email').value.trim();
      const photoFile = document.getElementById('sig-photo')?.files[0];

      if (!name || !email) {
        showToast('Please enter your name and email.', 'error');
        return;
      }
      if (!photoFile) {
        showToast('Please upload a photo of your signature.', 'error');
        return;
      }

      btn.disabled = true;

      // Convert photo to base64
      const photoBase64 = await new Promise(resolve => {
        const r = new FileReader();
        r.onload = e2 => resolve(e2.target.result);
        r.readAsDataURL(photoFile);
      });

      const traits = { size_vs_writing: 'photo', slant_direction: 'photo', underline: 'photo', legibility: 'photo' };

      try {
        // Step 1A: AI analysis of the signature image
        btnText.innerText = '🔍 AI Reading Your Signature...';
        const aiRes = await fetch('/signature/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, imageBase64: photoBase64 })
        });
        const aiData = await aiRes.json();
        if (!aiData.success) throw new Error(aiData.error || 'AI analysis failed');
        window._sigAIAnalysis = aiData.analysis;

        // Step 1B: Create Razorpay Order
        btnText.innerText = 'Initializing Secure Payment...';
        const res = await fetch('/signature/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, traits, promoCode: appliedPromoCode })
        });
        const data = await res.json();
        
        if (!data.success) throw new Error(data.error);

        // Handle 100% Free Promo Codes
        if (data.isFree) {
          btnText.innerText = 'Unlocking Your Report...';
          const freeData = {
            success: true, name, email,
            analysis: window._sigAIAnalysis,
            message: `🙏 Namaste ${name}! Your free Signature Analysis is ready.`,
            paid: false
          };
          if (freeData.success) {
            btnText.innerText = 'Report Unlocked!';
            sigForm.style.display = 'none';
            displaySignatureResult(freeData);
          } else {
            alert(freeData.error || 'Error delivering free report');
            btnText.innerText = 'Pay & Unlock Report 🔒';
            btn.disabled = false;
          }
          return; // Exit the function, bypass Razorpay
        }

        // Start signature payment status background polling
        startSignaturePaymentPolling(data.order.id, email, traits, name);

        // Step 2: Open Razorpay Checkout (for paid orders)
        const options = {
          key: data.key,
          amount: data.order.amount,
          currency: "INR",
          name: "Path Guider", // Hides Amar Visual Studio from the checkout popup
          description: "Premium Signature Analysis Report",
          order_id: data.order.id,
          handler: async function (response) {
            btnText.innerText = 'Verifying Payment...';
            if (window.sigPaymentPollInterval) clearInterval(window.sigPaymentPollInterval);
            document.getElementById('sig-pending-banner')?.remove();

            // Step 3: Verify Payment & Get Result
            const verifyRes = await fetch('/signature/verify-and-deliver', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                traits,
                name,
                email,
                aiAnalysis: window._sigAIAnalysis
              })
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              btnText.innerText = 'Report Unlocked!';
              sigForm.style.display = 'none'; // Hide form
              displaySignatureResult(verifyData);
            } else {
              alert('Verification failed. Please contact support.');
              btnText.innerText = 'Pay & Unlock Report 🔒';
              btn.disabled = false;
            }
          },
          prefill: { name, email },
          theme: { color: "#D4AF37" } // Gold theme
        };
        
        const rzp1 = new Razorpay(options);
        rzp1.on('payment.failed', function (response){
          alert('Payment Failed: ' + response.error.description);
          btnText.innerText = 'Pay & Unlock Report 🔒';
          btn.disabled = false;
        });
        rzp1.open();

      } catch(err) {
        alert('Error: ' + err.message);
        btnText.innerText = 'Pay & Unlock Report 🔒';
        btn.disabled = false;
      }
    });
  }

});

// ── Display Signature Result ────────────────────────────────────────────────
function displaySignatureResult(data) {
  const container = document.getElementById('sig-result-container');
  const analysis = data.analysis;
  
  let html = `
    <div style="background:linear-gradient(135deg,rgba(72,201,176,.1),rgba(72,201,176,.02));border:1px solid rgba(72,201,176,.3);padding:2rem 2.5rem;border-radius:20px;margin-bottom:2rem;text-align:center;">
      <div style="font-size:3rem;margin-bottom:.8rem;">✅</div>
      <h2 style="color:#48c9b0;margin-bottom:.6rem;font-family:'Cinzel',serif;font-size:1.7rem;">Report Unlocked!</h2>
      <p style="color:#f8fafc;font-size:1rem;margin-bottom:1rem;">Thank you, ${data.name || 'Seeker'}. Your premium analysis is ready below.</p>
      <p style="background:rgba(245,176,65,.1);display:inline-block;padding:.7rem 1.4rem;border-radius:10px;color:#fad7a1;font-size:.95rem;">
        ✉️ A detailed PDF has been sent to <strong>${data.email || 'your email'}</strong>
      </p>
    </div>
    <h3 style="color:var(--gold-light); margin-bottom:1rem; font-size:1.8rem; font-family:'Cinzel',serif;">
      ${data.message}
    </h3>
    <p style="margin-bottom:2rem; font-size:1.1rem; line-height:1.6;">
      ${analysis.summary}
    </p>
    
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem; text-align:left;">
      <div style="background:rgba(255,255,255,0.05); padding:1.5rem; border-radius:12px;">
        <h4 style="color:var(--gold-primary); margin-bottom:1rem;">💫 Core Personality</h4>
        <ul style="padding-left:1.2rem; margin:0;">
          ${analysis.overallPersonality.map(p => `<li style="margin-bottom:0.5rem;">${p}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background:rgba(255,255,255,0.05); padding:1.5rem; border-radius:12px;">
        <h4 style="color:var(--gold-primary); margin-bottom:1rem;">✨ Destiny Insights</h4>
        <ul style="padding-left:1.2rem; margin:0;">
          ${analysis.destinyInsights.map(d => `<li style="margin-bottom:0.5rem;">${d}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background:rgba(255,255,255,0.05); padding:1.5rem; border-radius:12px;">
        <h4 style="color:var(--gold-primary); margin-bottom:1rem;">💰 Wealth & Fortune</h4>
        <ul style="padding-left:1.2rem; margin:0;">
          ${analysis.fortuneInsights.map(f => `<li style="margin-bottom:0.5rem;">${f}</li>`).join('')}
        </ul>
      </div>
      
      <div style="background:rgba(255,255,255,0.05); padding:1.5rem; border-radius:12px;">
        <h4 style="color:var(--gold-primary); margin-bottom:1rem;">❤️ Love & Relationships</h4>
        <ul style="padding-left:1.2rem; margin:0;">
          ${analysis.loveInsights.map(l => `<li style="margin-bottom:0.5rem;">${l}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div style="background:rgba(255,50,50,0.1); border-left:4px solid #ff4444; padding:1.5rem; margin-top:1.5rem; text-align:left; border-radius:4px;">
      <h4 style="color:#ffaaaa; margin-bottom:1rem;">⚠️ Areas of Caution</h4>
      <ul style="padding-left:1.2rem; margin:0; color:#ffdddd;">
        ${analysis.warnings.map(w => `<li style="margin-bottom:0.5rem;">${w}</li>`).join('')}
      </ul>
    </div>
    
    <div style="margin-top:2rem; font-size:0.85rem; color:var(--text-muted); font-style:italic;">
      ${analysis.disclaimer} <br> Payment Reference: ${data.payment_id}
    </div>
  `;
  
  container.innerHTML = html;
  container.style.display = 'block';
  
  // Scroll to results smoothly
  container.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── 3D Constellation Star field ─────────────────────────────────────────────
function createStarField() {
  const canvas = document.getElementById('star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];
  const connectionDistance = 140;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    
    // Adjust number of stars based on screen size so it doesn't get too cluttered on mobile
    const numStars = Math.floor((W * H) / 12000); 
    
    stars = Array.from({ length: numStars }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random() * 2 + 0.5, // Depth for 3D parallax illusion
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    }));
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    
    // Slight parallax shift based on mouse position
    const shiftX = (mouseX - W/2) * 0.01;
    const shiftY = (mouseY - H/2) * 0.01;

    // Update and draw stars
    for (let i = 0; i < stars.length; i++) {
      let s = stars[i];
      
      // Move
      s.x += s.vx;
      s.y += s.vy;
      
      // Bounce
      if (s.x < 0 || s.x > W) s.vx *= -1;
      if (s.y < 0 || s.y > H) s.vy *= -1;

      // Calculate parallax position based on Z depth
      const px = s.x - (shiftX * s.z);
      const py = s.y - (shiftY * s.z);

      // Draw star
      ctx.beginPath();
      ctx.arc(px, py, s.z * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 175, 55, ${0.5 / s.z + 0.2})`; // Glowing gold
      ctx.fill();

      // Connect with lines (Constellations)
      for (let j = i + 1; j < stars.length; j++) {
        let s2 = stars[j];
        
        // Use true distance without parallax for stable line logic, but draw with parallax
        const dx = s.x - s2.x;
        const dy = s.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < connectionDistance) {
          const px2 = s2.x - (shiftX * s2.z);
          const py2 = s2.y - (shiftY * s2.z);
          
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px2, py2);
          
          // Opacity depends on distance, closer = more visible
          const opacity = 1 - (dist / connectionDistance);
          // Purple-gold mystic line color
          ctx.strokeStyle = `rgba(155, 109, 255, ${opacity * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

// ── Analysis animation ────────────────────────────────────
function startAnalysisAnimation() {
  return new Promise(resolve => {
    const btn = document.getElementById('analyze-btn');
    const btnText = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    btn.disabled = true;
    btnText.textContent = 'Reading the cosmos…';
    spinner.style.display = 'inline-block';

    const steps = [
      'Calculating Life Path…',
      'Decoding your Name…',
      'Analyzing your Numbers…',
      'Unveiling your Path…'
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < steps.length) {
        btnText.textContent = steps[i++];
      } else {
        clearInterval(interval);
        btn.disabled = false;
        btnText.textContent = 'Reveal My Path ✨';
        spinner.style.display = 'none';
        resolve();
      }
    }, 600);
  });
}

// ── Display Results ───────────────────────────────────────
function displayResults(r) {
  const section = document.getElementById('results-section');
  const container = document.getElementById('results-container');
  if (!section || !container) return;

  const lp  = READINGS.lifePathReadings[r.lifePath]  || READINGS.lifePathReadings[1];
  const dst = READINGS.lifePathReadings[r.destiny]   || READINGS.lifePathReadings[1];
  const mob = READINGS.mobileVibrations[r.mobileVib] || READINGS.mobileVibrations[1];
  const soul= READINGS.soulUrgeDescriptions[r.soulUrge] || '';
  const per = READINGS.personalityDescriptions[r.personality] || '';

  const age = new Date().getFullYear() - parseInt(r.dob.split('-')[0]);
  const firstName = r.name.split(' ')[0];

  container.innerHTML = `
    <!-- Header -->
    <div class="result-header">
      <div class="result-avatar">${getInitials(r.name)}</div>
      <div class="result-intro">
        <h2>Your Path Has Been Revealed, <span class="highlight">${firstName}</span></h2>
        <p>Here is your complete numerological blueprint — a map of your soul's journey.</p>
        <div class="result-meta-tags">
          <span class="meta-tag">🗓️ Born: ${formatDate(r.dob)}</span>
          <span class="meta-tag">🔢 Life Path: ${r.lifePath}</span>
          <span class="meta-tag">${r.zodiac.symbol} ${r.zodiac.sign}</span>
          <span class="meta-tag">📱 Vibration: ${r.mobileVib}</span>
        </div>
      </div>
    </div>

    <!-- Structured User Profile -->
    <div class="user-profile-summary">
      <div class="profile-row">
        <span class="profile-label">Full Name</span>
        <span class="profile-value">${r.name}</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Date of Birth</span>
        <span class="profile-value">${formatDate(r.dob)} (Age: ${age})</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Mobile Number</span>
        <span class="profile-value">${r.mobile}</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Zodiac Sign</span>
        <span class="profile-value">${r.zodiac.symbol} ${r.zodiac.sign}</span>
      </div>
    </div>

    <!-- Number Cards Row -->
    <div class="number-cards">
      ${numberCard('Life Path', r.lifePath, lp.symbol, lp.color, lp.title)}
      ${numberCard('Destiny', r.destiny, dst.symbol, dst.color, dst.title)}
      ${numberCard('Soul Urge', r.soulUrge, '💫', '#9370DB', 'Inner Desire')}
      ${numberCard('Personality', r.personality, '🪞', '#20B2AA', 'Outer Self')}
      ${numberCard('Mobile Vibe', r.mobileVib, '📱', '#FF8C00', mob.title.split(' ')[0])}
      ${numberCard('Birth Day', r.birthDay, '🌅', '#4682B4', 'Natural Gift')}
      ${numberCard('Maturity', r.maturity, '🌳', '#228B22', 'Future Self')}
    </div>

    <!-- Life Path Deep Dive -->
    <div class="result-card featured-card">
      <div class="card-badge" style="background:${lp.color}20; border-color:${lp.color}40; color:${lp.color}">
        ${lp.symbol} Life Path ${r.lifePath} — ${lp.title}
      </div>
      <blockquote class="tagline">"${lp.tagline}"</blockquote>
      <div class="deep-grid">
        ${deepItem('💫', 'Personality', lp.personality)}
        ${deepItem('🌿', 'Your Nature', lp.nature)}
        ${deepItem('🧠', 'Mindset', lp.mindset)}
        ${deepItem('🎯', 'Life Purpose', lp.lifePurpose)}
      </div>
    </div>

    <!-- Career & Skills -->
    <div class="result-card">
      <h3 class="section-label">💼 Career & Skills</h3>
      <p class="reading-text">${lp.skills}</p>
      <div class="career-highlight">
        <span class="career-icon">🚀</span>
        <p>${lp.career}</p>
      </div>
    </div>

    <!-- Love Life -->
    <div class="result-card love-card">
      <h3 class="section-label">❤️ Love & Relationships</h3>
      <p class="reading-text">${lp.love}</p>
    </div>

    <!-- Soul Urge + Personality -->
    <div class="two-col-cards">
      <div class="result-card">
        <h3 class="section-label">💫 Soul Urge ${r.soulUrge} — Your Inner Desire</h3>
        <p class="reading-text">${soul}</p>
      </div>
      <div class="result-card">
        <h3 class="section-label">🪞 Personality ${r.personality} — How Others See You</h3>
        <p class="reading-text">${per}</p>
      </div>
    </div>

    <!-- Mobile Vibration -->
    <div class="result-card mobile-card">
      <div class="mobile-header">
        <span class="big-number">${r.mobileVib}</span>
        <div>
          <h3 class="section-label">📱 Mobile Number Vibration</h3>
          <p class="vib-title">${mob.title}</p>
        </div>
      </div>
      <p class="reading-text">${mob.description}</p>
      <div class="info-pills">
        <div class="info-pill">
          <span class="pill-label">Effect</span>
          <span>${mob.effect}</span>
        </div>
        <div class="info-pill">
          <span class="pill-label">Lucky</span>
          <span>${mob.lucky}</span>
        </div>
      </div>
    </div>

    <!-- Lucky Profile -->
    <div class="result-card lucky-card">
      <h3 class="section-label">🍀 Your Lucky Profile</h3>
      <div class="lucky-grid">
        <div class="lucky-item">
          <span class="lucky-icon">🔢</span>
          <span class="lucky-label">Lucky Numbers</span>
          <span class="lucky-val">${r.lucky.numbers.join(', ')}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-icon">🎨</span>
          <span class="lucky-label">Lucky Colors</span>
          <span class="lucky-val">${r.lucky.colors}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-icon">📅</span>
          <span class="lucky-label">Lucky Day</span>
          <span class="lucky-val">${r.lucky.day}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-icon">${r.zodiac.symbol}</span>
          <span class="lucky-label">Zodiac Sign</span>
          <span class="lucky-val">${r.zodiac.sign}</span>
        </div>
      </div>
    </div>

    <!-- Maturity / Future -->
    <div class="result-card">
      <h3 class="section-label">🌳 Maturity Number ${r.maturity} — Your Future Self</h3>
      <p class="reading-text">As you grow into the later chapters of your life, your energy will evolve toward the themes of number ${r.maturity}. 
      ${READINGS.lifePathReadings[r.maturity] ? READINGS.lifePathReadings[r.maturity].lifePurpose : 'A rich path of growth and wisdom awaits you.'}
      This is the highest version of yourself — the person you are becoming.</p>
    </div>

    <!-- Premium Packages CTA -->
    <div class="packages-section">
      <h2 class="section-title">Want Massive <span>Details?</span></h2>
      <p class="section-sub">Get a deep-dive PDF report about your Love Life, Career Path, and Future</p>
      
      <div class="pricing-grid">
        <!-- Package 1: ₹47 -->
        <div class="pricing-card package-card" style="--card-glow: rgba(108,63,197,.15)">
          <h3 class="pkg-title">Deep Numerology</h3>
          <p class="pkg-desc">Detailed Love &amp; Career Analysis</p>
          <div class="pkg-price">
            <span class="price-strike">₹199</span>
            <span class="price-actual">₹47</span>
          </div>
          <ul class="pkg-features">
            <li>✅ Deep Love Life Analysis</li>
            <li>✅ Detailed Career Path Guide</li>
            <li>✅ 20+ Page Massive PDF</li>
            <li class="disabled">❌ Face Reading Analysis</li>
            <li class="disabled">❌ Astrology Birth Chart</li>
          </ul>
          <button class="btn-primary pkg-btn" onclick="initiatePayment('basic')">Get Detailed PDF</button>
        </div>

        <!-- Package 2: ₹79 Signature Analysis -->
        <div class="pricing-card package-card" style="--card-glow: rgba(245,176,65,.25); border-color: rgba(245,176,65,.3);">
          <div class="popular-badge" style="background:linear-gradient(135deg,#d4af37,#f5b041);">✨ AI-Powered</div>
          <h3 class="pkg-title">Signature Analysis</h3>
          <p class="pkg-desc">Upload your signature — Gemini AI reads it</p>
          <div class="pkg-price">
            <span class="price-strike">₹299</span>
            <span class="price-actual">₹79</span>
          </div>
          <ul class="pkg-features">
            <li>✅ Gemini Vision AI Analysis</li>
            <li>✅ Personality &amp; Destiny Report</li>
            <li>✅ Love &amp; Fortune Reading</li>
            <li>✅ Strengths &amp; Hidden Traits</li>
            <li>✅ PDF Report via Email</li>
          </ul>
          <button class="btn-primary pkg-btn" style="background:linear-gradient(135deg,#d4af37,#b8860b); color:#06060f;" onclick="window.location.href='signature.html'">Analyse My Signature 🖋️</button>
        </div>

        <!-- Package 3: ₹97 Advanced -->
        <div class="pricing-card package-card popular-pkg" style="--card-glow: rgba(212,175,55,.15)">
          <div class="popular-badge">Most Popular</div>
          <h3 class="pkg-title">Advanced</h3>
          <p class="pkg-desc">Numerology + Face Reading</p>
          <div class="pkg-price">
            <span class="price-strike">₹399</span>
            <span class="price-actual">₹97</span>
          </div>
          <ul class="pkg-features">
            <li>✅ 20+ Page Numerology PDF</li>
            <li>✅ Month-by-month forecasts</li>
            <li>✅ Karmic debts &amp; lessons</li>
            <li>✅ Detailed Face Reading Analysis</li>
            <li class="disabled">❌ Astrology Birth Chart</li>
          </ul>
          <button class="btn-primary pkg-btn" onclick="initiatePayment('advanced')">Get Advanced PDF</button>
        </div>

        <!-- Package 4: ₹121 Complete Mastery -->
        <div class="pricing-card package-card premium-pkg" style="--card-glow: rgba(255,110,180,.15)">
          <h3 class="pkg-title">Complete Mastery</h3>
          <p class="pkg-desc">Numerology + Face Reading + Astrology</p>
          <div class="pkg-price">
            <span class="price-strike">₹699</span>
            <span class="price-actual">₹121</span>
          </div>
          <ul class="pkg-features">
            <li>✅ 20+ Page Numerology PDF</li>
            <li>✅ Month-by-month forecasts</li>
            <li>✅ Karmic debts &amp; lessons</li>
            <li>✅ Detailed Face Reading Analysis</li>
            <li>✅ Full Astrology Birth Chart</li>
          </ul>
          <button class="btn-primary pkg-btn" onclick="initiatePayment('mastery')">Get Complete PDF</button>
        </div>
      </div>
    </div>

    <!-- Footer CTA -->
    <div class="result-footer-cta">
      <p>✨ Share your reading or start a new one</p>
      <button class="btn-secondary" onclick="resetForm()">🔄 New Reading</button>
    </div>
  `;

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  animateNumbers();

  // Initialize 3D Tilt for result cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.num-card, .result-card, .package-card, .user-profile-summary'), {
      max: 8,
      speed: 400,
      glare: true,
      "max-glare": 0.1,
      scale: 1.02
    });
  }
}

function numberCard(label, num, symbol, color, title) {
  return `
    <div class="num-card" style="--card-color:${color}">
      <div class="num-symbol">${symbol}</div>
      <div class="num-value count-up" data-target="${num}">${num}</div>
      <div class="num-label">${label}</div>
      <div class="num-title">${title}</div>
    </div>`;
}

function deepItem(icon, label, text) {
  return `
    <div class="deep-item">
      <h4><span>${icon}</span> ${label}</h4>
      <p>${text}</p>
    </div>`;
}

function animateNumbers() {
  document.querySelectorAll('.count-up').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.max(1, Math.floor(target / 20));
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
      if (current >= target) clearInterval(interval);
    }, 40);
  });
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function formatDate(dob) {
  const d = new Date(dob);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function resetForm() {
  document.getElementById('analysis-form').reset();
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
}

function showToast(msg, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);
  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Payment Integration ────────────────────────────────────
let pendingPackageType = null;

function initiatePayment(packageType) {
  if (!window.currentReadingResult) {
    showToast('Please complete the form first.', 'error');
    return;
  }
  
  pendingPackageType = packageType;
  
  // Show Payment Modal for Email & Photo
  document.getElementById('payment-modal').classList.add('visible');
}

// Close Modal
document.getElementById('close-payment-modal').addEventListener('click', () => {
  document.getElementById('payment-modal').classList.remove('visible');
});

// Handle Modal Submit
let _appliedPromo = null;
let _discountedPrice = null;

// Apply Promo Code button
document.getElementById('apply-promo-btn')?.addEventListener('click', async () => {
  const code = document.getElementById('modal-promo').value.trim().toUpperCase();
  const msgEl = document.getElementById('promo-msg');
  if (!code) { msgEl.style.color='#ff6b6b'; msgEl.textContent='Please enter a promo code.'; return; }
  if (!pendingPackageType) { msgEl.style.color='#ff6b6b'; msgEl.textContent='Please select a package first.'; return; }

  msgEl.style.color='var(--text-muted)'; msgEl.textContent='Checking...';
  try {
    const res = await fetch('/validate-promo', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ code, packageType: pendingPackageType })
    });
    const data = await res.json();
    if (data.success) {
      _appliedPromo = code;
      _discountedPrice = data.finalPrice;
      msgEl.style.color='#48c9b0';
      msgEl.textContent = `✅ ${data.message} — Final price: ₹${data.finalPrice}`;
    } else {
      _appliedPromo = null; _discountedPrice = null;
      msgEl.style.color='#ff6b6b';
      msgEl.textContent = '❌ ' + (data.error || 'Invalid promo code');
    }
  } catch(e) {
    msgEl.style.color='#ff6b6b'; msgEl.textContent='Error checking promo. Try again.';
  }
});

document.getElementById('payment-details-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email     = document.getElementById('modal-email').value.trim();
  const photoFile = document.getElementById('modal-photo').files[0];

  if (!email) {
    showToast('Please enter your email address.', 'error');
    return;
  }

  document.getElementById('payment-modal').classList.remove('visible');
  window.currentReadingResult.email = email;

  if (photoFile) {
    showToast('Processing your photo...', 'info');
    const reader = new FileReader();
    reader.onload = async (event) => {
      window.currentReadingResult.photoBase64 = event.target.result;
      await launchRazorpayCheckout(pendingPackageType, _appliedPromo);
    };
    reader.readAsDataURL(photoFile);
  } else {
    showToast('Initializing secure checkout...', 'info');
    window.currentReadingResult.photoBase64 = '';
    await launchRazorpayCheckout(pendingPackageType, _appliedPromo);
  }
});

async function launchRazorpayCheckout(packageType, promoCode = null) {
  try {
    const response = await fetch('/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageType,
        promoCode,
        userDetails: window.currentReadingResult
      })
    });

    const orderData = await response.json();
    if (orderData.error) throw new Error(orderData.error);

    const userEmail = window.currentReadingResult?.email || 'your email';

    // Start background status polling immediately
    startPaymentPolling(orderData.orderId, userEmail);

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Path Guider',
      description: 'Numerology PDF Report',
      order_id: orderData.orderId,
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: true,
        emi: true,
        paylater: false
      },
      handler: async function (paymentResponse) {
        showToast('✅ Payment received! Processing your report...', 'info');
        if (window.paymentPollInterval) clearInterval(window.paymentPollInterval);
        showPaymentSuccessScreen(userEmail);
        try {
          const verifyRes = await fetch('/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: paymentResponse.razorpay_order_id,
              razorpay_payment_id: paymentResponse.razorpay_payment_id,
              razorpay_signature: paymentResponse.razorpay_signature,
              userDetails: window.currentReadingResult,
              packageType,
              readingData: window.currentReadingResult
            })
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            showToast('🎉 Payment successful! Your PDF report will be emailed shortly.', 'info');
          } else {
            showToast('✅ Payment received! Your report will be emailed within 10 minutes.', 'info');
          }
        } catch (err) {
          console.error(err);
          showToast('✅ Payment received! Your report will be emailed within 10 minutes.', 'info');
        }
      },
      prefill: {
        name:    window.currentReadingResult?.name    || '',
        email:   window.currentReadingResult?.email   || '',
        contact: window.currentReadingResult?.mobile  || ''
      },
      theme: { color: '#6c3fc5' },
      modal: {
        ondismiss: function () {
          // If user closes after UPI payment, webhook/polling will still confirm it
          showToast('💡 If you already paid via UPI/QR, keep this page open. We are checking for payment confirmation.', 'info');
        }
      }
    };

    const rzp = new window.Razorpay(options);

    // Catch UPI timeout / payment cancelled — webhook/polling will still confirm real payments
    rzp.on('payment.failed', function (response) {
      const reason    = response.error?.reason      || '';
      const errorCode = response.error?.code        || '';
      const desc      = response.error?.description || 'Please try again.';

      console.log('Payment event - code:', errorCode, '| reason:', reason);

      const isUpiTimeout =
        reason.includes('timeout')   ||
        reason.includes('cancel')    ||
        reason === 'payment_cancelled' ||
        reason === 'payment_timeout';

      if (isUpiTimeout) {
        showToast(
          '💡 Check status banner active. Checking if your payment went through.',
          'info'
        );
      } else {
        showToast('❌ Payment failed: ' + desc, 'error');
      }
    });

    rzp.open();

  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Payment failed to initialize. Please try again.', 'error');
  }
}


// -- GITA WISDOM CHAT ----------------------------------------
document.getElementById('gita-problem')?.addEventListener('input', function() {
  document.getElementById('gita-char-count').textContent = `${this.value.length} / 500`;
});

async function sendGitaMessage() {
  const name = document.getElementById('gita-name').value.trim();
  const problem = document.getElementById('gita-problem').value.trim();
  const chatBox = document.getElementById('gita-chat-box');
  const sendBtn = document.getElementById('gita-send-btn');

  if (!name) { showToast('Please enter your name first 🙏', 'error'); return; }
  if (!problem || problem.length < 10) { showToast('Please describe your problem in at least 10 characters.', 'error'); return; }

  // Add user message bubble
  const userInitial = name.charAt(0).toUpperCase();
  const userMsg = document.createElement('div');
  userMsg.className = 'gita-msg-user';
  userMsg.innerHTML = `
    <div class="gita-bubble gita-bubble-user"><strong>${name}:</strong><br>${problem}</div>
    <div class="gita-user-avatar">${userInitial}</div>
  `;
  chatBox.appendChild(userMsg);

  // Show typing indicator
  const typingEl = document.createElement('div');
  typingEl.className = 'gita-msg-bot';
  typingEl.id = 'gita-typing';
  typingEl.innerHTML = `
    <div class="gita-avatar">📿</div>
    <div class="gita-bubble gita-bubble-bot">
      <div class="gita-typing-dots"><span></span><span></span><span></span></div>
      <em style="font-size:0.8rem; color:var(--text-muted);">Seeking wisdom from the Bhagavad Gita...</em>
    </div>
  `;
  chatBox.appendChild(typingEl);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Disable button
  sendBtn.disabled = true;
  sendBtn.textContent = '📿 Seeking Guidance...';

  try {
    const response = await fetch('/gita-guidance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, problem })
    });
    const data = await response.json();

    // Remove typing indicator
    document.getElementById('gita-typing')?.remove();

    if (data.success) {
      const parsed = parseGitaResponse(data.response);
      const botMsg = document.createElement('div');
      botMsg.className = 'gita-msg-bot';
      botMsg.innerHTML = `
        <div class="gita-avatar">📿</div>
        <div class="gita-bubble gita-bubble-bot">
          <div class="gita-chapter-badge">📜 ${parsed.reference}</div>
          <div class="gita-sloka-block">
            <div style="font-size:1rem; color:var(--gold); margin-bottom:0.5rem;">${parsed.sloka}</div>
            <div style="font-size:0.85rem; color:var(--text-muted); font-style:normal;">${parsed.transliteration}</div>
          </div>
          <div style="margin: 0.8rem 0; padding: 0.8rem; background:rgba(255,255,255,0.03); border-radius:10px;">
            <strong style="color:var(--gold-light); font-size:0.8rem; letter-spacing:1px;">🇮🇳 HINDI MEANING</strong>
            <p style="margin-top:0.4rem; color:var(--text); font-size:0.9rem;">${parsed.hindi}</p>
          </div>
          <div style="margin: 0.8rem 0; padding: 0.8rem; background:rgba(255,255,255,0.03); border-radius:10px;">
            <strong style="color:var(--purple-light); font-size:0.8rem; letter-spacing:1px;">💡 ENGLISH MEANING</strong>
            <p style="margin-top:0.4rem; color:var(--text); font-size:0.9rem;">${parsed.english}</p>
          </div>
          <div style="border-top:1px solid var(--glass-border); padding-top:1rem; margin-top:1rem;">
            <strong style="color:var(--gold-light);">🏷️ Krishna's Guidance for You:</strong>
            <p style="margin-top:0.6rem; color:var(--text); line-height:1.8;">${parsed.guidance.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
      `;
      chatBox.appendChild(botMsg);
    } else {
      appendErrorMsg(chatBox, data.error || 'Could not fetch guidance. Please try again.');
    }
  } catch (err) {
    document.getElementById('gita-typing')?.remove();
    appendErrorMsg(chatBox, 'Connection error. Please make sure the server is running.');
  }

  // Reset
  sendBtn.disabled = false;
  sendBtn.innerHTML = '🏷️ Seek Divine Guidance';
  document.getElementById('gita-problem').value = '';
  document.getElementById('gita-char-count').textContent = '0 / 500';
  chatBox.scrollTop = chatBox.scrollHeight;
}

function parseGitaResponse(text) {
  const get = (key) => {
    const keys = ['SLOKA','REFERENCE','TRANSLITERATION','HINDI','ENGLISH','GUIDANCE'];
    const idx = keys.indexOf(key);
    const startTag = `---${key}---`;
    const nextKey = keys[idx + 1];
    const endTag = nextKey ? `---${nextKey}---` : null;
    const start = text.indexOf(startTag);
    if (start === -1) return '';
    const contentStart = start + startTag.length;
    const end = endTag ? text.indexOf(endTag, contentStart) : text.length;
    return text.slice(contentStart, end === -1 ? text.length : end).trim();
  };
  return {
    sloka:          get('SLOKA'),
    reference:      get('REFERENCE') || 'Bhagavad Gita',
    transliteration:get('TRANSLITERATION'),
    hindi:          get('HINDI'),
    english:        get('ENGLISH'),
    guidance:       get('GUIDANCE')
  };
}

function appendErrorMsg(chatBox, msg) {
  const el = document.createElement('div');
  el.className = 'gita-msg-bot';
  el.innerHTML = `
    <div class="gita-avatar">📿</div>
    <div class="gita-bubble gita-bubble-bot" style="color:#ff6b6b;">?? ${msg}</div>
  `;
  chatBox.appendChild(el);
}
  
// Super Design Animations 

// == SUPER DESIGN ANIMATIONS ==========================================
// Reveal on scroll
const sdObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.sd-reveal').forEach(el => sdObserver.observe(el));

// Navbar scroll effect
const sdNav = document.getElementById('sd-nav');
if (sdNav) {
  window.addEventListener('scroll', () => {
    window.scrollY > 80 ? sdNav.classList.add('scrolled') : sdNav.classList.remove('scrolled');
  });
}

// Hero parallax + fade
const heroInner = document.getElementById('hero-inner');
if (heroInner) {
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    if (s < 900) {
      heroInner.style.transform = `translateY(${s * 0.28}px)`;
      heroInner.style.opacity = Math.max(0, 1 - s / 700);
    }
  });
}

// Digital clock
function sdClock() {
  const el = document.getElementById('sd-clock');
  if (!el) return;
  const now = new Date();
  let h = now.getHours(), m = now.getMinutes().toString().padStart(2,'0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  el.textContent = `${h}:${m} ${ap}`;
}
setInterval(sdClock, 1000); sdClock();

// Kick off reveal for hero
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.sd-reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('active'), 200 + i * 200);
  });
});

// ── RAZORPAY QR PAYMENT STATUS RESOLUTION HELPERS ──────────────────────
function showPaymentSuccessScreen(email) {
  // Hide modal
  document.getElementById('payment-modal')?.classList.remove('visible');
  // Remove pending banner
  document.getElementById('payment-pending-banner')?.remove();
  
  // Find packages section and replace it with success screen
  const pkgSection = document.querySelector('.packages-section');
  if (pkgSection) {
    pkgSection.innerHTML = `
      <div class="payment-success-card" style="background:linear-gradient(135deg,rgba(72,201,176,.15),rgba(72,201,176,.02)); border:1.5px solid rgba(72,201,176,.4); padding:3rem 2rem; border-radius:24px; text-align:center; max-width:650px; margin:2rem auto; box-shadow:0 15px 45px rgba(72,201,176,0.15); animation:fadeInUp 0.6s ease;">
        <div style="font-size:3.5rem; margin-bottom:1rem;">🎉</div>
        <h2 style="color:#48c9b0; margin-bottom:.8rem; font-family:'Cinzel',serif; font-size:2rem; font-weight:700;">Payment Successful!</h2>
        <p style="color:#f8fafc; font-size:1.05rem; margin-bottom:1.2rem; line-height:1.6;">Thank you! Your premium PDF report has been generated and sent to <br><strong style="color:#fad7a1;">${email}</strong>.</p>
        <p style="color:#8888aa; font-size:.9rem; line-height:1.5; margin-bottom:2rem; padding:0 1rem;">Please check your Inbox as well as your Spam/Junk folders. It should arrive within 2-3 minutes. If you face any issues, contact support.</p>
        <button class="btn-secondary" onclick="resetForm()" style="padding:10px 24px; font-size:.9rem; border-radius:50px;">🔄 Start New Reading</button>
      </div>
    `;
    pkgSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function showPaymentPendingBanner(orderId, email) {
  if (document.getElementById('payment-pending-banner')) return;

  const pkgSection = document.querySelector('.packages-section');
  if (pkgSection) {
    const banner = document.createElement('div');
    banner.id = 'payment-pending-banner';
    banner.style.cssText = `
      background: rgba(245,176,65,.12);
      border: 1.5px solid rgba(245,176,65,.35);
      padding: 1.2rem;
      border-radius: 16px;
      margin: 0 auto 2rem;
      max-width: 800px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      animation: fadeIn 0.4s ease;
    `;
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; text-align:left;">
        <span style="font-size:1.5rem; animation: pulse 2s infinite;">⏳</span>
        <div>
          <strong style="color:var(--gold-light); font-size:.95rem; display:block; margin-bottom:2px;">Waiting for payment confirmation...</strong>
          <span style="color:var(--text-muted); font-size:.82rem;">If you paid via UPI/QR code, please keep this page open. We will redirect automatically.</span>
        </div>
      </div>
      <button id="manual-check-btn" class="btn-primary" style="padding:8px 18px; font-size:.85rem; border-radius:8px; background:var(--gold); color:#000; border:none; font-weight:600; cursor:pointer; transition: transform 0.2s;">
        Check Status 🔄
      </button>
    `;
    
    pkgSection.insertBefore(banner, pkgSection.firstChild);
    
    document.getElementById('manual-check-btn').addEventListener('click', async () => {
      const btn = document.getElementById('manual-check-btn');
      btn.innerText = 'Checking...';
      btn.disabled = true;
      try {
        const res = await fetch(`/check-payment-status?orderId=${orderId}`);
        const data = await res.json();
        if (data.success && data.status === 'paid') {
          if (window.paymentPollInterval) clearInterval(window.paymentPollInterval);
          showPaymentSuccessScreen(email);
          showToast('🎉 Payment verified! Your PDF is being emailed.', 'success');
        } else {
          showToast('⌛ Payment not detected yet. If you paid, please wait a few seconds and try again.', 'info');
          btn.innerText = 'Check Status 🔄';
          btn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        showToast('❌ Error checking status. Try again.', 'error');
        btn.innerText = 'Check Status 🔄';
        btn.disabled = false;
      }
    });
  }
}

function startPaymentPolling(orderId, email) {
  if (window.paymentPollInterval) clearInterval(window.paymentPollInterval);
  
  showPaymentPendingBanner(orderId, email);

  window.paymentPollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/check-payment-status?orderId=${orderId}`);
      const data = await res.json();
      if (data.success && data.status === 'paid') {
        clearInterval(window.paymentPollInterval);
        showPaymentSuccessScreen(email);
        showToast('🎉 Payment verified! Your PDF is being emailed.', 'success');
      }
    } catch (e) {
      console.error('Error polling payment status:', e);
    }
  }, 3000);
}

function showSignaturePaymentPendingBanner(orderId, email, traits, name) {
  if (document.getElementById('sig-pending-banner')) return;

  const form = document.getElementById('signature-form');
  if (form) {
    const banner = document.createElement('div');
    banner.id = 'sig-pending-banner';
    banner.style.cssText = `
      background: rgba(245,176,65,.12);
      border: 1.5px solid rgba(245,176,65,.35);
      padding: 1.2rem;
      border-radius: 16px;
      margin: 1.5rem auto;
      max-width: 500px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      animation: fadeIn 0.4s ease;
    `;
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px; text-align:left;">
        <span style="font-size:1.5rem; animation: pulse 2s infinite;">⏳</span>
        <div>
          <strong style="color:var(--gold-light); font-size:.95rem; display:block; margin-bottom:2px;">Waiting for payment...</strong>
          <span style="color:var(--text-muted); font-size:.82rem;">If you paid via UPI/QR code, please keep this page open.</span>
        </div>
      </div>
      <button id="sig-manual-check-btn" class="btn-primary" style="padding:8px 18px; font-size:.85rem; border-radius:8px; background:var(--gold); color:#000; border:none; font-weight:600; cursor:pointer;">
        Check Status 🔄
      </button>
    `;
    
    form.appendChild(banner);
    
    document.getElementById('sig-manual-check-btn').addEventListener('click', async () => {
      const btn = document.getElementById('sig-manual-check-btn');
      btn.innerText = 'Checking...';
      btn.disabled = true;
      try {
        const res = await fetch(`/check-payment-status?orderId=${orderId}`);
        const data = await res.json();
        if (data.success && data.status === 'paid') {
          if (window.sigPaymentPollInterval) clearInterval(window.sigPaymentPollInterval);
          
          form.style.display = 'none';
          banner.remove();
          
          displaySignatureResult({
            success: true,
            name,
            email,
            analysis: data.analysis || window._sigAIAnalysis,
            message: `🙏 Namaste ${name}! Your complete Signature Analysis Report is ready.`,
            paid: true
          });
          showToast('🎉 Payment verified! Signature Report unlocked.', 'success');
        } else {
          showToast('⌛ Payment not detected yet. If you paid, please wait a few seconds and try again.', 'info');
          btn.innerText = 'Check Status 🔄';
          btn.disabled = false;
        }
      } catch (err) {
        console.error(err);
        showToast('❌ Error checking status. Try again.', 'error');
        btn.innerText = 'Check Status 🔄';
        btn.disabled = false;
      }
    });
  }
}

function startSignaturePaymentPolling(orderId, email, traits, name) {
  if (window.sigPaymentPollInterval) clearInterval(window.sigPaymentPollInterval);
  
  showSignaturePaymentPendingBanner(orderId, email, traits, name);

  window.sigPaymentPollInterval = setInterval(async () => {
    try {
      const res = await fetch(`/check-payment-status?orderId=${orderId}`);
      const data = await res.json();
      if (data.success && data.status === 'paid') {
        clearInterval(window.sigPaymentPollInterval);
        
        const sigForm = document.getElementById('signature-form');
        if (sigForm) sigForm.style.display = 'none';
        document.getElementById('sig-pending-banner')?.remove();
        
        displaySignatureResult({
          success: true,
          name,
          email,
          analysis: data.analysis || window._sigAIAnalysis,
          message: `🙏 Namaste ${name}! Your complete Signature Analysis Report is ready.`,
          paid: true
        });
        showToast('🎉 Payment verified! Signature Report unlocked.', 'success');
      }
    } catch (e) {
      console.error('Error polling signature payment status:', e);
    }
  }, 3000);
}

