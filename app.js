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
        // Step 1: AI analysis of the signature image
        btnText.innerText = '🔍 AI Reading Your Signature...';
        const aiRes = await fetch('/signature/analyze-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, imageBase64: photoBase64 })
        });
        const aiData = await aiRes.json();
        if (!aiData.success) throw new Error(aiData.error || 'AI analysis failed');
        window._sigAIAnalysis = aiData.analysis;

        // Step 2: Deliver free (no payment in testing mode)
        btnText.innerText = '📧 Sending your report...';
        const freeRes = await fetch('/signature/deliver-free', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, traits })
        });
        const freeData = await freeRes.json();

        if (freeData.success) {
          btnText.innerText = 'Report Unlocked! ✅';
          sigForm.style.display = 'none';
          // Merge AI analysis into result
          freeData.analysis = { ...freeData.analysis, ...window._sigAIAnalysis };
          displaySignatureResult(freeData);
          showToast('🎉 Your Signature Report is ready! Check your email.', 'success');
        } else {
          throw new Error(freeData.error || 'Delivery failed');
        }

      } catch(err) {
        showToast('❌ Error: ' + err.message, 'error');
        btnText.innerText = 'Analyse My Signature 🖋️';
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

// ── Display Results (Cosmic Cockpit v3.0) ─────────────────
function displayResults(r) {
  const section = document.getElementById('results-section');
  const container = document.getElementById('results-container');
  if (!section || !container) return;

  const lp  = READINGS.lifePathReadings[r.lifePath]  || READINGS.lifePathReadings[1];
  const dst = READINGS.lifePathReadings[r.destiny]   || READINGS.lifePathReadings[1];
  const mob = READINGS.mobileVibrations[r.mobileVib] || READINGS.mobileVibrations[1];
  const soul= READINGS.soulUrgeDescriptions[r.soulUrge] || '';
  const per = READINGS.personalityDescriptions[r.personality] || '';
  const py  = READINGS.personalYearReadings[r.personalYear] || READINGS.personalYearReadings[1];

  const age = new Date().getFullYear() - parseInt(r.dob.split('-')[0]);
  const firstName = r.name.split(' ')[0];

  container.innerHTML = `
    <!-- Header -->
    <div class="result-header">
      <div class="result-avatar">${getInitials(r.name)}</div>
      <div class="result-intro">
        <h2>Cosmic Blueprint Revealed: <span class="highlight">${r.name}</span></h2>
        <p>Your multi-dimensional Pythagorean &amp; Vedic numerical blueprint is active and decoded.</p>
        <div class="result-meta-tags">
          <span class="meta-tag">🗓️ Born: ${formatDate(r.dob)} (Age: ${age})</span>
          <span class="meta-tag">☀️ Life Path: ${r.lifePath} (${lp.title})</span>
          <span class="meta-tag">✨ Destiny: ${r.destiny}</span>
          <span class="meta-tag">⏳ 2026 Cycle: Year ${r.personalYear}</span>
          <span class="meta-tag">${r.zodiac.symbol} ${r.zodiac.sign} (${r.zodiac.element})</span>
        </div>
      </div>
    </div>

    <!-- Actions Bar -->
    <div class="results-actions-bar">
      <button class="btn-print" onclick="window.print()">
        🖨️ Print / Save Full PDF Report
      </button>
      <button class="btn-print" style="border-color:rgba(245,176,65,0.4);" onclick="document.getElementById('analysis-form').scrollIntoView({behavior:'smooth'})">
        🔄 New Analysis
      </button>
    </div>

    <!-- Structured User Profile Summary -->
    <div class="user-profile-summary">
      <div class="profile-row">
        <span class="profile-label">Full Name</span>
        <span class="profile-value">${r.name}</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Date of Birth &amp; Age</span>
        <span class="profile-value">${formatDate(r.dob)} · ${age} Years</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Mobile Number</span>
        <span class="profile-value">${r.mobile} (Vibration ${r.mobileVib})</span>
      </div>
      <div class="profile-row">
        <span class="profile-label">Vedic Zodiac</span>
        <span class="profile-value">${r.zodiac.symbol} ${r.zodiac.sign} · ${r.zodiac.hindi}</span>
      </div>
    </div>

    <!-- Sticky Navigation Tab Bar -->
    <div class="results-tab-bar">
      <button class="rtab-btn active" onclick="scrollToResultSection('sec-core', this)">🌟 Core Archetype</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-career', this)">💼 Career &amp; Wealth</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-love', this)">❤️ Love &amp; Compatibility</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-year', this)">⏳ 2026 Year &amp; Pinnacles</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-karmic', this)">🔮 Karmic Lessons</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-planes', this)">🧠 Planes of Expression</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-mobile', this)">📱 Mobile Frequency</button>
      <button class="rtab-btn" onclick="scrollToResultSection('sec-lucky', this)">🍀 Lucky Matrix</button>
    </div>

    <!-- 1. Power Affirmation Banner -->
    <div class="affirmation-banner">
      <h3>✨ Sacred Power Affirmation ✨</h3>
      <p class="affirmation-text">"${lp.powerAffirmation || r.lucky.affirmation}"</p>
    </div>

    <!-- 2. Core Number Cards Row -->
    <div class="number-cards" id="sec-core">
      ${numberCard('Life Path', r.lifePath, lp.symbol, lp.color, lp.title)}
      ${numberCard('Destiny', r.destiny, dst.symbol, dst.color, dst.title)}
      ${numberCard('Soul Urge', r.soulUrge, '💫', '#9370DB', 'Inner Craving')}
      ${numberCard('Personality', r.personality, '🪞', '#20B2AA', 'Outer Aura')}
      ${numberCard('2026 Year', r.personalYear, '⏳', '#FFD700', 'Annual Cycle')}
      ${numberCard('Birth Day', r.birthDay, '🌅', '#4682B4', 'Natural Gift')}
      ${numberCard('Maturity', r.maturity, '🌳', '#228B22', 'Soul Future')}
      ${numberCard('Mobile Vibe', r.mobileVib, '📱', '#FF8C00', mob.title.split(' ')[0])}
    </div>

    <!-- 3. Life Path Deep Dive -->
    <div class="result-card featured-card">
      <div class="card-badge" style="background:${lp.color}20; border-color:${lp.color}40; color:${lp.color}">
        ${lp.symbol} Life Path ${r.lifePath} — ${lp.title} (${lp.element || 'Universal'} Element · ${lp.rulingPlanet || 'Cosmic'})
      </div>
      <blockquote class="tagline">"${lp.tagline}"</blockquote>
      <div class="deep-grid">
        ${deepItem('💫', 'Core Personality', lp.personality)}
        ${deepItem('🌿', 'Your True Nature', lp.nature)}
        ${deepItem('🧠', 'Cosmic Mindset', lp.mindset || 'Strategic and intuitive.')}
        ${deepItem('🎯', 'Life Purpose', lp.lifePurpose)}
      </div>

      ${lp.shadowSide ? `
        <div style="background:rgba(255,80,80,0.06); border-left:3px solid #ff6b6b; padding:1.2rem; border-radius:8px; margin-top:1.5rem;">
          <h4 style="color:#ff8888; font-size:0.95rem; margin-bottom:0.4rem;">⚠️ Shadow Side &amp; Pitfalls to Master</h4>
          <p style="font-size:0.88rem; color:var(--text-muted); line-height:1.7;">${lp.shadowSide}</p>
        </div>
      ` : ''}
    </div>

    <!-- 4. Career, Wealth & Money Magnetism -->
    <div class="result-card" id="sec-career">
      <h3 class="section-label">💼 Career &amp; Wealth Magnetism Matrix</h3>
      <p class="reading-text">${lp.skills}</p>
      
      <div class="career-highlight">
        <span class="career-icon">🚀</span>
        <div>
          <strong style="color:var(--gold-light); display:block; margin-bottom:0.3rem;">Prime Professional Callings:</strong>
          <p>${lp.career}</p>
        </div>
      </div>

      ${lp.wealthMagnetism ? `
        <div class="career-highlight" style="background:rgba(245,176,65,0.08); border:1px solid rgba(245,176,65,0.25); margin-top:1rem;">
          <span class="career-icon">💰</span>
          <div>
            <strong style="color:var(--gold); display:block; margin-bottom:0.3rem;">Wealth Attraction Archetype:</strong>
            <p>${lp.wealthMagnetism}</p>
          </div>
        </div>
      ` : ''}
    </div>

    <!-- 5. Love Life & Relationship Compatibility -->
    <div class="result-card love-card" id="sec-love">
      <h3 class="section-label">❤️ Love, Soul Connections &amp; Compatibility</h3>
      <p class="reading-text">${lp.love}</p>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-top:1.5rem;">
        <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; border-left:3px solid #2ecc71;">
          <strong style="color:#48c9b0; font-size:0.9rem;">✨ Harmonious Matches:</strong>
          <p style="font-size:0.88rem; color:var(--text); margin-top:0.3rem;">
            Life Path Numbers: <strong>${(lp.compatibleNumbers || [1,3,5]).join(', ')}</strong>
          </p>
          <span style="font-size:0.78rem; color:var(--text-muted);">Natural harmonic resonance and emotional flow.</span>
        </div>

        <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; border-left:3px solid #ff7675;">
          <strong style="color:#ff7675; font-size:0.9rem;">⚡ Growth / Challenging Dynamics:</strong>
          <p style="font-size:0.88rem; color:var(--text); margin-top:0.3rem;">
            Life Path Numbers: <strong>${(lp.challengingNumbers || [4,8]).join(', ')}</strong>
          </p>
          <span style="font-size:0.78rem; color:var(--text-muted);">Requires mutual patience and conscious communication.</span>
        </div>
      </div>
    </div>

    <!-- 6. Soul Urge + Personality -->
    <div class="two-col-cards">
      <div class="result-card">
        <h3 class="section-label">💫 Soul Urge ${r.soulUrge} — Inner Heart's Craving</h3>
        <p class="reading-text">${soul}</p>
      </div>
      <div class="result-card">
        <h3 class="section-label">🪞 Personality ${r.personality} — How Others Perceive You</h3>
        <p class="reading-text">${per}</p>
      </div>
    </div>

    <!-- 7. 2026 Personal Year Forecast & Life Pinnacles -->
    <div class="result-card" id="sec-year">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:1rem;">
        <h3 class="section-label" style="margin-bottom:0;">⏳ 2026 Personal Year Forecast (Year ${r.personalYear})</h3>
        <span class="card-badge" style="background:rgba(245,176,65,0.15); color:var(--gold); border-color:rgba(245,176,65,0.3);">
          Theme: ${py.theme}
        </span>
      </div>
      <p class="reading-text" style="font-size:0.95rem; margin-bottom:1rem;">${py.forecast}</p>
      <div style="background:rgba(255,255,255,0.04); padding:1rem 1.2rem; border-radius:10px; border-left:3px solid var(--gold);">
        <strong style="color:var(--gold-light);">💡 Strategic Guidance for 2026:</strong> ${py.advice}
      </div>

      <h4 style="margin-top:2rem; font-family:'Cinzel',serif; color:var(--gold-light); font-size:1.05rem;">
        🏛️ Your 4 Life Pinnacle Stages
      </h4>
      <div class="pinnacles-grid">
        ${r.cycles?.pinnacles ? r.cycles.pinnacles.map(p => `
          <div class="pinnacle-card">
            <div class="pinnacle-stage">Stage ${p.stage}</div>
            <div class="pinnacle-num">${p.number}</div>
            <div class="pinnacle-age">${p.ageRange}</div>
          </div>
        `).join('') : ''}
      </div>
    </div>

    <!-- 8. Karmic Debts & Missing Soul Lessons -->
    <div class="result-card" id="sec-karmic">
      <h3 class="section-label">🔮 Karmic Debts &amp; Soul Lessons Matrix</h3>
      <p class="reading-text">
        Every soul arrives with strengths earned from past cycles and specific lessons chosen for evolution in this life.
      </p>

      ${r.karmicDebts && r.karmicDebts.length > 0 ? `
        <div class="karmic-grid">
          ${r.karmicDebts.map(kd => {
            const info = READINGS.karmicDebtReadings[kd.number] || {};
            return `
              <div class="karmic-box">
                <h4>⚠️ ${info.title || 'Karmic Debt ' + kd.number} (${kd.source})</h4>
                <p><strong>Past Origin:</strong> ${info.origin || 'Past life pattern'}</p>
                <p><strong>Life Lesson:</strong> ${info.lesson || 'Growth lesson'}</p>
                <p style="margin-top:0.5rem; color:#48c9b0;"><strong>🌿 Remedy:</strong> ${info.remedy || 'Spiritual practice'}</p>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div style="background:rgba(72,201,176,0.08); border:1px solid rgba(72,201,176,0.25); border-radius:12px; padding:1.2rem; margin-top:1rem;">
          <strong style="color:#48c9b0;">✨ Clear Karmic Slate:</strong> No primary Karmic Debt numbers (13, 14, 16, 19) detected in your core birth calculations. Your energy flows smoothly without inherited past-life debt blocks.
        </div>
      `}

      <h4 style="margin-top:1.8rem; color:var(--gold-light); font-size:1rem; margin-bottom:0.8rem;">
        🌱 Karmic Lessons (Qualities to Develop):
      </h4>
      <div>
        ${r.karmicLessons && r.karmicLessons.length > 0 ? r.karmicLessons.map(num => `
          <div class="lesson-pill">
            ${READINGS.karmicLessonReadings[num] || 'Number ' + num + ' lesson'}
          </div>
        `).join('') : '<div style="color:var(--text-muted);">All 9 vibrational frequencies are present in your name. Excellent balance!</div>'}
      </div>
    </div>

    <!-- 9. Planes of Expression -->
    <div class="result-card" id="sec-planes">
      <h3 class="section-label">🧠 Planes of Expression (Mind, Emotion, Body &amp; Spirit)</h3>
      <p class="reading-text">Shows how your consciousness naturally processes and reacts to experiences in the physical universe:</p>
      
      <div class="planes-grid">
        <div class="plane-card">
          <div class="plane-header">
            <span class="plane-title">🧠 Mental Plane</span>
            <span class="plane-pct">${r.planes?.mental || 25}%</span>
          </div>
          <div class="plane-track">
            <div class="plane-fill" style="width:${r.planes?.mental || 25}%; background:linear-gradient(90deg, #6c3fc5, #a29bfe);"></div>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem; display:block;">Logic, strategy, intellect</span>
        </div>

        <div class="plane-card">
          <div class="plane-header">
            <span class="plane-title">❤️ Emotional Plane</span>
            <span class="plane-pct">${r.planes?.emotional || 25}%</span>
          </div>
          <div class="plane-track">
            <div class="plane-fill" style="width:${r.planes?.emotional || 25}%; background:linear-gradient(90deg, #ff7675, #fab1a0);"></div>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem; display:block;">Feelings, empathy, passion</span>
        </div>

        <div class="plane-card">
          <div class="plane-header">
            <span class="plane-title">🌿 Physical Plane</span>
            <span class="plane-pct">${r.planes?.physical || 25}%</span>
          </div>
          <div class="plane-track">
            <div class="plane-fill" style="width:${r.planes?.physical || 25}%; background:linear-gradient(90deg, #00b894, #55efc4);"></div>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem; display:block;">Action, structure, endurance</span>
        </div>

        <div class="plane-card">
          <div class="plane-header">
            <span class="plane-title">🔮 Intuitive Plane</span>
            <span class="plane-pct">${r.planes?.intuitive || 25}%</span>
          </div>
          <div class="plane-track">
            <div class="plane-fill" style="width:${r.planes?.intuitive || 25}%; background:linear-gradient(90deg, #f5b041, #ffeaa7);"></div>
          </div>
          <span style="font-size:0.75rem; color:var(--text-muted); margin-top:0.4rem; display:block;">Insight, gut feelings, spirit</span>
        </div>
      </div>
    </div>

    <!-- 10. Mobile Vibration Frequency -->
    <div class="result-card mobile-card" id="sec-mobile">
      <div class="mobile-header">
        <span class="big-number">${r.mobileVib}</span>
        <div>
          <h3 class="section-label" style="margin-bottom:0.2rem;">📱 Mobile Frequency: ${r.mobile}</h3>
          <p class="vib-title">${mob.title}</p>
        </div>
      </div>
      <p class="reading-text">${mob.description}</p>
      <div class="info-pills">
        <div class="info-pill">
          <span class="pill-label">Energy Impact</span>
          <span>${mob.effect}</span>
        </div>
        <div class="info-pill">
          <span class="pill-label">Ideal For</span>
          <span>${mob.lucky}</span>
        </div>
      </div>
    </div>

    <!-- 11. Sacred Lucky Matrix -->
    <div class="result-card lucky-card" id="sec-lucky">
      <h3 class="section-label">🍀 Sacred Elements &amp; Divine Alignment Matrix</h3>
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
          <span class="lucky-label">Power Day</span>
          <span class="lucky-val">${r.lucky.day}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-icon">💎</span>
          <span class="lucky-label">Benefic Gemstone</span>
          <span class="lucky-val">${r.lucky.gemstone || 'Natural Gem'}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-icon">🕉️</span>
          <span class="lucky-label">Ruling Deity</span>
          <span class="lucky-val">${r.lucky.deity || 'Universal Divine'}</span>
        </div>
        <div class="lucky-item">
          <span class="lucky-icon">${r.zodiac.symbol}</span>
          <span class="lucky-label">Vedic Zodiac</span>
          <span class="lucky-val">${r.zodiac.sign} (${r.zodiac.element})</span>
        </div>
      </div>
    </div>

    <!-- 12. Maturity / Future Self -->
    <div class="result-card">
      <h3 class="section-label">🌳 Maturity Number ${r.maturity} — Your Culminating Future Self</h3>
      <p class="reading-text">
        As you grow into the mature chapters of your life (post age 35–40), your energy will naturally blossom toward the themes of number ${r.maturity}. 
        ${READINGS.lifePathReadings[r.maturity] ? READINGS.lifePathReadings[r.maturity].lifePurpose : 'A rich path of growth, abundance, and spiritual wisdom awaits you.'}
        This is the sovereign version of yourself — the enduring legacy you are cultivating.
      </p>
    </div>

    <!-- 13. Deep-Dive Packages CTA -->
    <div class="packages-section">
      <h2 class="section-title">Want Massive <span>Details?</span></h2>
      <p class="section-sub">Get an in-depth 20+ Page personalised PDF report with predictive timelines, graphology &amp; remedial guidance</p>
      
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
            <li class="disabled">❌ Signature AI Reading</li>
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
            <li>✅ Signature Improvement Tips</li>
          </ul>
          <button class="btn-primary pkg-btn" onclick="initiatePayment('signature')">Analyze Signature</button>
        </div>

        <!-- Package 3: ₹99 Complete Mastery -->
        <div class="pricing-card package-card popular-pkg" style="--card-glow: rgba(212,175,55,.3); border-color: var(--gold);">
          <div class="popular-badge">⭐ Most Popular</div>
          <h3 class="pkg-title">Complete Mastery</h3>
          <p class="pkg-desc">Numerology + Face + Signature AI</p>
          <div class="pkg-price">
            <span class="price-strike">₹499</span>
            <span class="price-actual">₹99</span>
          </div>
          <ul class="pkg-features">
            <li>✅ Full Numerology Report</li>
            <li>✅ AI Face Reading</li>
            <li>✅ AI Signature Analysis</li>
            <li>✅ 30+ Page Master PDF</li>
            <li>✅ Priority Email Delivery</li>
          </ul>
          <button class="btn-primary pkg-btn" onclick="initiatePayment('advanced')">Unlock Everything</button>
        </div>
      </div>
    </div>
  `;

  container.style.display = 'block';
  section.style.display = 'block';

  section.style.display = 'block';
  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  animateNumbers();

  // Initialize 3D Tilt for result cards
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(document.querySelectorAll('.num-card, .result-card, .package-card, .user-profile-summary, .pinnacle-card, .plane-card'), {
      max: 6,
      speed: 400,
      glare: true,
      "max-glare": 0.08,
      scale: 1.01
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

  const submitBtn = document.querySelector('#payment-details-form button[type="submit"]');
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Generating your report...'; }

  if (photoFile) {
    showToast('Processing your photo...', 'info');
    const reader = new FileReader();
    reader.onload = async (event) => {
      window.currentReadingResult.photoBase64 = event.target.result;
      await deliverFreeReport(pendingPackageType);
      if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Get My Free Report →'; }
    };
    reader.readAsDataURL(photoFile);
  } else {
    window.currentReadingResult.photoBase64 = '';
    await deliverFreeReport(pendingPackageType);
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Get My Free Report →'; }
  }
});

async function deliverFreeReport(packageType) {
  showToast('⏳ Generating your PDF report...', 'info');
  try {
    const res = await fetch('/deliver-free-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        packageType,
        userDetails: window.currentReadingResult,
        readingData: window.currentReadingResult
      })
    });
    const data = await res.json();
    if (data.success) {
      showPaymentSuccessScreen(window.currentReadingResult.email);
      showToast('🎉 Report generated! Check your email inbox.', 'success');
    } else {
      showToast('❌ ' + (data.error || 'Failed to deliver report. Try again.'), 'error');
    }
  } catch (err) {
    console.error(err);
    showToast('❌ Connection error. Please try again.', 'error');
  }
}

// launchRazorpayCheckout is preserved in app.PAYMENT_BACKUP.js
// In free/testing mode, deliverFreeReport() is used instead.
async function launchRazorpayCheckout(packageType, promoCode = null) {
  // Redirects to free delivery in testing mode
  await deliverFreeReport(packageType);
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

// ── VEDIC SUITE CONTROLLERS ──────────────────────────────────────────────────
function switchVedicTab(tabId, btn) {
  document.querySelectorAll('.vedic-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.vedic-panel').forEach(p => p.classList.remove('active'));
  
  if (btn) btn.classList.add('active');
  const panel = document.getElementById(`tab-${tabId}`);
  if (panel) panel.classList.add('active');
}

async function fetchHoroscope() {
  const sign = document.getElementById('horoscope-sign')?.value || 'leo';
  const resBox = document.getElementById('horoscope-result');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = '<div style="color:var(--gold-light);">✨ Consulting celestial planetary transits...</div>';

  try {
    const res = await fetch(`/horoscope/${encodeURIComponent(sign)}`);
    const data = await res.json();
    if (data.success && data.horoscope) {
      const h = data.horoscope;
      resBox.innerHTML = `
        <div class="vedic-badge badge-gold">✨ Daily Celestial Guidance · ${h.date}</div>
        <h4 class="vedic-result-title">${h.sign.toUpperCase()} — Today's Energy</h4>
        <p class="vedic-result-text" style="font-size:1.05rem; margin-bottom:1rem;">"${h.message}"</p>
        <div style="font-size:0.85rem; color:var(--text-muted);">
          💫 <em>Align your intentions with patience and mindful awareness today.</em>
        </div>
      `;
    } else {
      resBox.innerHTML = '<div style="color:#ff6b6b;">Could not fetch horoscope. Please try again.</div>';
    }
  } catch (err) {
    resBox.innerHTML = '<div style="color:#ff6b6b;">Error connecting to horoscope service.</div>';
  }
}

async function fetchMuhurat() {
  const activity = document.getElementById('muhurat-activity')?.value || 'business';
  const dateInput = document.getElementById('muhurat-date')?.value || new Date().toISOString().split('T')[0];
  const resBox = document.getElementById('muhurat-result');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = '<div style="color:var(--gold-light);">⏳ Calculating Vedic planetary hours & Tithi...</div>';

  try {
    const res = await fetch('/muhurat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ activity, date: dateInput })
    });
    const data = await res.json();
    if (data.success && data.muhurat) {
      const m = data.muhurat;
      resBox.innerHTML = `
        <div class="vedic-badge badge-cyan">📅 Verdict: ${m.verdict}</div>
        <h4 class="vedic-result-title">${m.day} — ${(data.muhurat.activity || activity).toUpperCase()}</h4>
        <p class="vedic-result-text" style="margin-bottom:0.8rem;">${m.reasoning || m.advice || 'Auspicious cosmic planetary alignment for this activity.'}</p>
        <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; font-size:0.88rem;">
          <strong style="color:var(--gold-light);">⭐ Shubh Timings:</strong> ${m.bestHours || 'Morning Brahma Muhurat (6:00 AM – 9:30 AM) & Abhijit Muhurat (11:45 AM – 12:30 PM)'}<br>
          <strong style="color:#ff6b6b;">⚠️ Rahu Kaal:</strong> ${m.rahuKaal || 'Avoid important commitments during mid-afternoon Rahu Kaal.'}
        </div>
      `;
    } else {
      resBox.innerHTML = '<div style="color:#ff6b6b;">Could not calculate Muhurat. Please try again.</div>';
    }
  } catch (err) {
    resBox.innerHTML = '<div style="color:#ff6b6b;">Error calculating Muhurat.</div>';
  }
}

async function fetchChakraDiagnostic() {
  const symptoms = document.getElementById('chakra-symptoms')?.value || 'fear and anxiety';
  const resBox = document.getElementById('chakra-result');
  if (!resBox) return;

  resBox.style.display = 'block';
  resBox.innerHTML = '<div style="color:var(--gold-light);">🧘 Diagnosing energy centers and subtle body currents...</div>';

  try {
    const res = await fetch('/chakra', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms })
    });
    const data = await res.json();
    if (data.success && data.chakra) {
      const c = data.chakra;
      resBox.innerHTML = `
        <div class="vedic-badge badge-purple">🧘 Affected Energy Center: ${c.name} (${c.sanskrit})</div>
        <h4 class="vedic-result-title" style="color:${c.color || 'var(--gold-light)'};">Color Vibration: ${c.color} · Location: ${c.location}</h4>
        <p class="vedic-result-text" style="margin-bottom:0.8rem;"><strong style="color:var(--gold-light);">Diagnostic:</strong> ${c.blocked}</p>
        <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; font-size:0.88rem; line-height:1.8;">
          <strong style="color:#48c9b0;">🌿 Healing Action:</strong> ${c.heal}<br>
          <strong style="color:var(--gold-light);">💎 Crystal:</strong> ${c.crystal} | <strong style="color:var(--gold-light);">🧘 Yoga Asana:</strong> ${c.yoga}
        </div>
      `;
    } else {
      resBox.innerHTML = '<div style="color:#ff6b6b;">Could not diagnose chakra.</div>';
    }
  } catch (err) {
    resBox.innerHTML = '<div style="color:#ff6b6b;">Error diagnosing chakra.</div>';
  }
}

async function fetchRashiAndGemstone() {
  const dob = document.getElementById('rashi-dob')?.value;
  const resBox = document.getElementById('rashi-result');
  if (!resBox) return;

  if (!dob) {
    resBox.style.display = 'block';
    resBox.innerHTML = '<div style="color:#ff6b6b;">Please select your Date of Birth.</div>';
    return;
  }

  resBox.style.display = 'block';
  resBox.innerHTML = '<div style="color:var(--gold-light);">🕉️ Calculating Vedic Moon placement & Planetary Gemstone...</div>';

  try {
    const [rashiRes, nakshatraRes] = await Promise.all([
      fetch('/rashi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dob }) }).then(r => r.json()),
      fetch('/nakshatra', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dob }) }).then(r => r.json())
    ]);

    if (rashiRes.success && rashiRes.rashi) {
      const r = rashiRes.rashi;
      const n = nakshatraRes.nakshatra || {};
      resBox.innerHTML = `
        <div class="vedic-badge badge-gold">${r.symbol} Vedic Rashi: ${r.sign.toUpperCase()} (${r.hindi})</div>
        <h4 class="vedic-result-title">Ruling Planet: ${r.ruler} · Element: ${r.element}</h4>
        <p class="vedic-result-text" style="margin-bottom:0.8rem;"><strong style="color:var(--gold-light);">Core Traits:</strong> ${r.traits}</p>
        <div style="background:rgba(255,255,255,0.04); padding:1.2rem; border-radius:12px; font-size:0.88rem; line-height:1.8;">
          ⭐ <strong>Lunar Nakshatra:</strong> ${n.name || 'Auspicious'} (${n.deity ? 'Deity: ' + n.deity : ''})<br>
          💎 <strong>Benefic Gemstone:</strong> ${r.lucky?.stone || 'Natural Gemstone'} | <strong>Lucky Color:</strong> ${r.lucky?.color || 'Gold'}<br>
          📿 <strong>Deity & Mantra:</strong> ${n.mantra || 'Om Namah Shivaya'}
        </div>
      `;
    } else {
      resBox.innerHTML = '<div style="color:#ff6b6b;">Could not calculate Rashi. Please check DOB.</div>';
    }
  } catch (err) {
    resBox.innerHTML = '<div style="color:#ff6b6b;">Error calculating Rashi & Gemstone.</div>';
  }
}

// ── GITA GUIDANCE CONTROLLER ─────────────────────────────────
async function sendGitaMessage() {
  const nameInput = document.getElementById('gita-name');
  const probInput = document.getElementById('gita-problem');
  const chatBox   = document.getElementById('gita-chat-box');
  const sendBtn   = document.getElementById('gita-send-btn');
  if (!probInput || !chatBox) return;

  const name = (nameInput?.value || 'Seeker').trim();
  const problem = probInput.value.trim();

  if (!problem) {
    alert('Please share your situation or question with Lord Krishna.');
    probInput.focus();
    return;
  }

  // Append user message bubble
  const userMsgHtml = `
    <div class="gita-msg-row-user" style="display:flex; justify-content:flex-end; margin:1rem 0;">
      <div style="background:linear-gradient(135deg,var(--purple),var(--purple-light)); color:#fff; padding:0.9rem 1.3rem; border-radius:16px 16px 0 16px; max-width:80%; font-size:0.92rem; box-shadow:0 4px 15px rgba(0,0,0,0.3);">
        <strong>${name}:</strong><br>${problem}
      </div>
    </div>
  `;
  chatBox.insertAdjacentHTML('beforeend', userMsgHtml);

  // Append bot loading bubble
  const loadingId = 'gita-loading-' + Date.now();
  const loadingHtml = `
    <div id="${loadingId}" style="display:flex; gap:10px; margin:1rem 0; align-items:flex-start;">
      <div style="font-size:1.6rem;">📿</div>
      <div style="background:rgba(255,255,255,0.05); border:1px solid rgba(245,176,65,0.3); border-radius:16px 16px 16px 0; padding:0.9rem 1.3rem; color:var(--gold-light); font-size:0.9rem;">
        ✨ Chanting sacred verses &amp; consulting the Bhagavad Gita...
      </div>
    </div>
  `;
  chatBox.insertAdjacentHTML('beforeend', loadingHtml);
  chatBox.scrollTop = chatBox.scrollHeight;

  if (sendBtn) {
    sendBtn.disabled = true;
    sendBtn.innerText = 'Consulting the Gita... 🕉️';
  }

  try {
    const res = await fetch('/gita/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, message: problem })
    });
    const data = await res.json();
    document.getElementById(loadingId)?.remove();

    if (data.success) {
      const botResponseHtml = `
        <div style="display:flex; gap:10px; margin:1.2rem 0; align-items:flex-start;">
          <div style="font-size:1.6rem;">🕉️</div>
          <div style="background:rgba(108,63,197,0.15); border:1px solid rgba(245,176,65,0.35); border-radius:18px 18px 18px 0; padding:1.4rem; max-width:88%; color:#f0f0f5; line-height:1.75; box-shadow:0 8px 30px rgba(0,0,0,0.4);">
            <div style="display:inline-block; background:rgba(245,176,65,0.15); color:var(--gold); font-size:0.78rem; font-weight:700; padding:0.25rem 0.8rem; border-radius:50px; margin-bottom:0.8rem;">
              📜 ${data.reference || 'Bhagavad Gita'}
            </div>
            <div style="font-family:'Cinzel',serif; font-size:1.15rem; color:var(--gold-light); margin-bottom:0.6rem; font-weight:600;">
              ${data.sloka}
            </div>
            ${data.transliteration ? `<div style="font-style:italic; font-size:0.85rem; color:#aaa; margin-bottom:0.8rem;">${data.transliteration}</div>` : ''}
            <div style="background:rgba(255,255,255,0.04); padding:1rem; border-radius:10px; margin-bottom:1rem; font-size:0.92rem;">
              <strong style="color:var(--gold);">🇮🇳 हिंदी भावार्थ:</strong> ${data.hindi}<br><br>
              <strong style="color:#48c9b0;">🇬🇧 English Translation:</strong> ${data.english}
            </div>
            <div style="font-size:0.93rem; color:#e0e0ee; line-height:1.8;">
              ${(data.guidance || '').replace(/\\n/g, '<br>')}
            </div>
          </div>
        </div>
      `;
      chatBox.insertAdjacentHTML('beforeend', botResponseHtml);
      probInput.value = '';
    } else {
      chatBox.insertAdjacentHTML('beforeend', `<div style="color:#ff6b6b; margin:1rem 0;">Lord Krishna's wisdom is always with you: Focus on action without attachment to results.</div>`);
    }
  } catch (err) {
    document.getElementById(loadingId)?.remove();
    chatBox.insertAdjacentHTML('beforeend', `<div style="color:#ff6b6b; margin:1rem 0;">Error connecting to Gita Guidance. Please try again.</div>`);
  } finally {
    if (sendBtn) {
      sendBtn.disabled = false;
      sendBtn.innerText = '🕉️ Seek Divine Guidance';
    }
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}


