const PDFDocument = require('pdfkit');
const { READINGS } = require('../readings.js');

async function generatePDF(userDetails, packageType, readingData, faceAnalysisText, astrologyAnalysisText) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const lp = READINGS.lifePathReadings[readingData.lifePath] || READINGS.lifePathReadings[1];
      const dst = READINGS.lifePathReadings[readingData.destiny] || READINGS.lifePathReadings[1];
      const mob = READINGS.mobileVibrations[readingData.mobileVib] || READINGS.mobileVibrations[1];
      const py = READINGS.personalYearReadings[readingData.personalYear] || READINGS.personalYearReadings[1];

      // ── PAGE 1: TITLE & CORE BLUEPRINT ──
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).stroke('#D4AF37');
      
      doc.moveDown(2);
      doc.fontSize(24).fillColor('#6c3fc5').text('PATH GUIDER PREMIUM', { align: 'center' });
      doc.fontSize(14).fillColor('#D4AF37').text('Master Numerology & Cosmic Blueprint Report', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).fillColor('#333333');
      doc.text(`Prepared Exclusively For: ${userDetails.name}`, { align: 'center' });
      doc.text(`Date of Birth: ${userDetails.dob}  |  Mobile: ${userDetails.mobile}`, { align: 'center' });
      doc.text(`Report Date: ${new Date().toLocaleDateString('en-IN')}`, { align: 'center' });
      doc.moveDown(2);

      // Core Numbers Summary Table
      doc.fontSize(14).fillColor('#6c3fc5').text('Your Sacred Numerical Frequencies', { underline: true });
      doc.moveDown(0.8);

      doc.fontSize(11).fillColor('#222222');
      doc.text(`• Life Path Number: ${readingData.lifePath} — ${lp.title} (${lp.tagline})`);
      doc.text(`• Destiny (Expression) Number: ${readingData.destiny} — ${dst.title}`);
      doc.text(`• Soul Urge Number: ${readingData.soulUrge} — Inner Heart's Craving`);
      doc.text(`• Personality Number: ${readingData.personality} — Outer Aura & Perception`);
      doc.text(`• 2026 Personal Year Cycle: Year ${readingData.personalYear || 1} (${py.theme})`);
      doc.text(`• Mobile Phone Vibration: ${readingData.mobileVib} — ${mob.title}`);
      doc.moveDown(1.5);

      doc.fontSize(13).fillColor('#D4AF37').text('Daily Power Affirmation:');
      doc.fontSize(11).fillColor('#444444').font('Helvetica-Oblique').text(`"${lp.powerAffirmation || 'I lead with courage and truth.'}"`);
      doc.font('Helvetica');

      // ── PAGE 2: LIFE PATH DEEP DIVE & CAREER ──
      doc.addPage();
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke('#D4AF37');
      doc.moveDown(2);

      doc.fontSize(18).fillColor('#6c3fc5').text(`Life Path ${readingData.lifePath}: ${lp.title}`, { align: 'left' });
      doc.moveDown(0.5);

      doc.fontSize(11).fillColor('#333333');
      doc.text(lp.personality, { align: 'justify' });
      doc.moveDown(1);

      doc.fontSize(14).fillColor('#D4AF37').text('💼 Career & Wealth Magnetism');
      doc.moveDown(0.4);
      doc.fontSize(11).fillColor('#333333').text(lp.skills, { align: 'justify' });
      doc.moveDown(0.5);
      doc.text(`Prime Professions: ${lp.career}`, { align: 'justify' });
      if (lp.wealthMagnetism) {
        doc.moveDown(0.5);
        doc.text(`Wealth Archetype: ${lp.wealthMagnetism}`, { align: 'justify' });
      }

      doc.moveDown(1);
      doc.fontSize(14).fillColor('#D4AF37').text('❤️ Love Life & Compatibility');
      doc.moveDown(0.4);
      doc.fontSize(11).fillColor('#333333').text(lp.love, { align: 'justify' });

      // ── PAGE 3: 2026 FORECAST & KARMIC LESSONS ──
      doc.addPage();
      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke('#D4AF37');
      doc.moveDown(2);

      doc.fontSize(16).fillColor('#6c3fc5').text(`⏳ 2026 Personal Year Forecast: Year ${readingData.personalYear || 1}`);
      doc.moveDown(0.4);
      doc.fontSize(12).fillColor('#D4AF37').text(`Theme: ${py.theme}`);
      doc.moveDown(0.5);
      doc.fontSize(11).fillColor('#333333').text(py.forecast, { align: 'justify' });
      doc.moveDown(0.5);
      doc.text(`Strategic Guidance: ${py.advice}`, { align: 'justify' });

      doc.moveDown(1.5);
      doc.fontSize(16).fillColor('#6c3fc5').text('🔮 Karmic Debts & Soul Lessons');
      doc.moveDown(0.5);

      if (readingData.karmicDebts && readingData.karmicDebts.length > 0) {
        readingData.karmicDebts.forEach(kd => {
          const info = READINGS.karmicDebtReadings[kd.number] || {};
          doc.fontSize(11).fillColor('#C0392B').text(`⚠️ ${info.title || 'Karmic Debt ' + kd.number}`);
          doc.fontSize(10).fillColor('#333').text(`Lesson: ${info.lesson || '-'}`);
          doc.text(`Remedy: ${info.remedy || '-'}`);
          doc.moveDown(0.5);
        });
      } else {
        doc.fontSize(11).fillColor('#27AE60').text('✨ Clear Karmic Slate: No major karmic debt blockages detected.');
        doc.moveDown(0.5);
      }

      if (readingData.karmicLessons && readingData.karmicLessons.length > 0) {
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#D4AF37').text('Qualities to Cultivate (Missing Numbers):');
        doc.moveDown(0.3);
        readingData.karmicLessons.forEach(num => {
          doc.fontSize(10).fillColor('#444').text(`• ${READINGS.karmicLessonReadings[num] || 'Number ' + num}`);
        });
      }

      // ── OPTIONAL FACE ANALYSIS ──
      if (packageType === 'advanced' || packageType === 'mastery') {
        doc.addPage();
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke('#D4AF37');
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#6c3fc5').text('Face Reading & Physiognomy Analysis', { align: 'center' });
        doc.moveDown(1);

        if (userDetails.photoBase64) {
          try {
            const base64Data = userDetails.photoBase64.replace(/^data:image\/\w+;base64,/, "");
            const imgBuffer = Buffer.from(base64Data, 'base64');
            doc.image(imgBuffer, (doc.page.width - 160) / 2, doc.y, { fit: [160, 160], align: 'center' });
            doc.moveDown(13);
          } catch (e) {
            console.error("Failed to embed image in PDF", e);
          }
        }

        doc.fontSize(11).fillColor('#333333').text(faceAnalysisText || 'Based on your facial geometry, high cheekbones and balanced forehead reflect intuitive perception and natural leadership...', { align: 'justify' });
      }

      // ── OPTIONAL ASTROLOGY ANALYSIS ──
      if (packageType === 'mastery') {
        doc.addPage();
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke('#D4AF37');
        doc.moveDown(2);
        doc.fontSize(18).fillColor('#6c3fc5').text('Vedic Astrology Birth Chart Analysis', { align: 'center' });
        doc.moveDown(1);
        doc.fontSize(11).fillColor('#333333').text(astrologyAnalysisText || 'Based on planetary transits at your time of birth, your Moon sign reflects deep emotional intuition, balanced by a solar drive toward purposeful achievement.', { align: 'justify' });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

async function generateSignaturePDF(name, traits, analysis) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const bufs = [];
      doc.on('data', b => bufs.push(b));
      doc.on('end', () => resolve(Buffer.concat(bufs)));

      doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(2).stroke('#D4AF37');
      doc.moveDown(2);

      doc.fontSize(22).fillColor('#6c3fc5').text('PATH GUIDER AI', { align: 'center' });
      doc.fontSize(15).fillColor('#D4AF37').text('Premium Graphology & Signature Reading', { align: 'center' });
      doc.moveDown(1.5);

      doc.fontSize(12).fillColor('#333').text('Prepared For: ' + (name || 'Seeker'), { align: 'center' });
      doc.text('Date: ' + new Date().toLocaleDateString('en-IN'), { align: 'center' });
      doc.moveDown(2);

      const section = (title, text) => {
        if (!text) return;
        doc.fontSize(14).fillColor('#D4AF37').text(title);
        doc.moveDown(0.4);
        doc.fontSize(11).fillColor('#333').text(text, { align: 'justify' });
        doc.moveDown(1.2);
      };

      section('✨ Destiny & Fortune Reading', analysis.destiny);
      section('🧠 Deep Psychological Profile', analysis.personality);
      section('❤️ Love & Emotional Expressiveness', analysis.love);

      if (traits) {
        doc.addPage();
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1).stroke('#D4AF37');
        doc.moveDown(2);
        doc.fontSize(16).fillColor('#6c3fc5').text('Graphological Stroke Analysis', { underline: true });
        doc.moveDown(1);
        doc.fontSize(11).fillColor('#444');
        doc.text('• Size & Proportion: ' + (traits.size_vs_writing || traits.size || 'Medium balanced'));
        doc.text('• Slant & Direction: ' + (traits.slant_direction || traits.slant || 'Upward progressive'));
        doc.text('• Baseline & Underline: ' + (traits.underline || traits.baseline || 'Confident single baseline'));
        doc.text('• Legibility & Clarity: ' + (traits.legibility || 'Highly distinct and clear'));
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDF, generateSignaturePDF };
