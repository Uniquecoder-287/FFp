// feedback_ques.js
document.addEventListener('DOMContentLoaded', () => {
  // ---- 1) Constants and element refs
  const QUESTIONS_COUNT = 10;
  const MAX_PER = 5;
  const form      = document.getElementById('ratings_form');
  const submitBtn = document.getElementById('submit-btn');
  const backBtn   = document.getElementById('cancel-btn');
  const teacherEl = document.getElementById('teacherName');

  // ---- 2) Load selected teacher and reflect
  const teacherLabel = localStorage.getItem('selectedTeacherLabel') || 'Selected Teacher';
  teacherEl.textContent = teacherLabel;

  // ---- 3) Guard against duplicate feedback for this teacher
  const completedTeachers = getCompletedTeachers();
  if (completedTeachers.includes(teacherLabel)) {
    alert('Feedback already submitted for this teacher. Redirecting to select another.');
    window.location.assign('select_teacher.html');
    return;
  }

  // ---- 4) Back button: neutralize inner anchor and add keyboard UX
  const backAnchor = backBtn?.querySelector('a');
  if (backAnchor) backAnchor.addEventListener('click', (e) => e.preventDefault());
  backBtn?.setAttribute('role', 'button');
  backBtn?.setAttribute('tabindex', '0');
  backBtn?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      backBtn.click();
    }
  });

  // ---- 5) Back navigation
  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign('select_teacher.html');
  });

  // ---- 6) Form validation and submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 6.1) Require all questions
    const ratingsMap = {};
    for (let i = 1; i <= QUESTIONS_COUNT; i++) {
      const checked = form.querySelector(`input[name="q${i}"]:checked`);
      if (!checked) {
        alert(`Please answer question ${i} before submitting.`);
        const firstInput = form.querySelector(`input[name="q${i}"]`);
        firstInput?.focus();
        return;
      }
      ratingsMap[`q${i}`] = parseInt(checked.value, 10);
    }

    // 6.2) Compute average percentage
    const sum = Object.values(ratingsMap).reduce((a, b) => a + b, 0);
    const avgPercent = (sum / (QUESTIONS_COUNT * MAX_PER)) * 100;

    // 6.3) Prepare payload
    const payload = {
      teacherName: teacherLabel,
      ratings: ratingsMap,
      averagePercent: avgPercent,
      submittedAt: new Date().toISOString()
    };

    // 6.4) Local durability: store submission + append to history
    try {
      localStorage.setItem(`feedback:${teacherLabel}`, JSON.stringify(payload));
      const all = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
      all.push(payload);
      localStorage.setItem('feedbackHistory', JSON.stringify(all));
    } catch (_) {}

    // 6.5) Backend save (intentionally commented out)
    /*
    try {
      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const msg = await res.text();
        console.warn('Server did not accept feedback:', msg);
      }
    } catch (err) {
      console.warn('Network error while submitting feedback:', err);
    }
    */

    // 6.6) Mark this teacher as completed
    addCompletedTeacher(teacherLabel);

    // 6.7) Determine next route
    const teacherList = getTeacherList();
    const left = getRemainingTeachers(teacherList);

    if (left.length === 0) {
      alert('Your feedback is submitted. Thank you!');
      window.location.assign('index.html');
    } else {
      window.location.assign('select_teacher.html');
    }
  });

  // ---- 7) Utilities
  function getCompletedTeachers() {
    try {
      return JSON.parse(localStorage.getItem('completedTeachers') || '[]');
    } catch {
      return [];
    }
  }

  function addCompletedTeacher(name) {
    const set = new Set(getCompletedTeachers());
    set.add(name);
    localStorage.setItem('completedTeachers', JSON.stringify(Array.from(set)));
  }

  // If 'teacherList' was saved earlier, use it to compute remaining teachers.
  function getTeacherList() {
    try {
      const list = JSON.parse(localStorage.getItem('teacherList') || '[]');
      if (Array.isArray(list)) return list;
      return [];
    } catch {
      return [];
    }
  }

  function getRemainingTeachers(all) {
    if (!Array.isArray(all) || all.length === 0) return [];
    const done = new Set(getCompletedTeachers());
    return all.filter((t) => !done.has(t));
  }
});
