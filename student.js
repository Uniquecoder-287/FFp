document.addEventListener('DOMContentLoaded', () => {
  // 1) Cache core elements
  const inputs    = document.querySelectorAll('.inp');        // [PRN, password]
  const loginBtn  = document.querySelectorAll('.cta')[0];     // first button
  const backBtn   = document.querySelectorAll('.cta')[1];     // second button
  const loginLink = loginBtn?.querySelector('a');
  const backLink  = backBtn?.querySelector('a');

  // 2) Prevent anchors from hard-navigating; JS controls routing
  loginLink?.addEventListener('click', (e) => e.preventDefault());
  backLink?.addEventListener('click',  (e) => e.preventDefault());

  // 3) Keyboard accessibility for pseudo-buttons
  [loginBtn, backBtn].forEach(btn => {
    if (!btn) return;
    btn.setAttribute('tabindex','0');
    btn.setAttribute('role','button');
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  // 4) Input references
  const prnInput  = inputs[0];
  const passInput = inputs[1];

  // 5) Login flow
  loginBtn?.addEventListener('click', async (e) => {
    e.preventDefault();

    const prn = prnInput?.value.trim();
    const password = passInput?.value;

    if (!prn || !password) {
      alert('Please enter PRN and Password.');
      (prn ? passInput : prnInput)?.focus();
      return;
    }

    // Persist PRN for downstream pages
    try { localStorage.setItem('studentPRN', prn); } catch(_) {}

    // ============================
    // BACKEND REQUIRED (commented)
    // ============================
    /*
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // if using cookies/session
        body: JSON.stringify({ prn, password })
      });

      if (!res.ok) {
        const msg = await res.text();
        alert(msg || 'Invalid PRN or Password.');
        return;
      }

      const data = await res.json(); // { ok, completedAll, remainingCount }
      if (data.completedAll) {
        alert('Your response is already submitted.');
        window.location.assign('index.html');
        return;
      }
      window.location.assign('select.html');
      return;
    } catch (err) {
      alert('Network error. Please try again.');
      return;
    }
    */

    // =============================================
    // Client-side fallback (until backend exists)
    // =============================================
    const teacherList = getTeacherList();
    const done = new Set(getCompletedTeachers());
    const remaining = teacherList.filter(t => !done.has((t || '').trim()));

    if (teacherList.length > 0 && remaining.length === 0) {
      alert('Your response is already submitted.');
      window.location.assign('index.html');
    } else {
      window.location.assign('select.html');
    }
  });

  // 6) Back flow
  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign('index.html');
  });

  // 7) Helpers
  function getTeacherList() {
    try {
      const list = JSON.parse(localStorage.getItem('teacherList') || '[]');
      return Array.isArray(list) ? list.map(s => (s || '').trim()) : [];
    } catch { return []; }
  }
  function getCompletedTeachers() {
    try { return JSON.parse(localStorage.getItem('completedTeachers') || '[]'); }
    catch { return []; }
  }
});
