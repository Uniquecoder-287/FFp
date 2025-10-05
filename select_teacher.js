document.addEventListener('DOMContentLoaded', () => {
  const selectEl = document.getElementById('teacherSelect');

  const actions = document.querySelector('.form-actions');
  const continueBtn = actions?.querySelector('.btn.btn-primary');
  const resetBtn    = actions?.querySelector('.btn.btn-sec');
  const backBtn     = actions?.querySelector('.btn.btn-ter');

  // Disable default anchor behavior inside the buttons
  [continueBtn, backBtn].forEach(btn => {
    const a = btn?.querySelector('a');
    if (a) a.addEventListener('click', (e) => e.preventDefault());
  });

  // Optional: initialize the full teacher list once (labels from the select)
  const labels = Array.from(selectEl.options)
    .map(o => o.text?.trim())
    .filter(t => t && !t.startsWith('--'));
  if (labels.length) {
    try { localStorage.setItem('teacherList', JSON.stringify(labels)); } catch(_) {}
  }

  continueBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const idx = selectEl.selectedIndex;
    const opt = selectEl.options[idx];
    const href = opt?.value || 'feedback_ques.html';
    const label = opt?.text?.trim();

    if (!label) {
      alert('Please select a teacher first.');
      selectEl.focus();
      return;
    }

    // Save the label for feedback_ques.html to read
    try { localStorage.setItem('selectedTeacherLabel', label); } catch(_) {}

    // Navigate to the feedback page (value points to feedback_ques.html)
    window.location.assign(href);
  });

  resetBtn?.addEventListener('click', (e) => {
    // Native reset sets select back to first option; also clear the saved label
    setTimeout(() => {
      try { localStorage.removeItem('selectedTeacherLabel'); } catch(_) {}
    }, 0);
  });

  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign('select.html');
  });

  // Optional dev helper for your “Reset test data” button
  document.getElementById('reset-test')?.addEventListener('click', () => {
    try {
      ['completedTeachers','feedbackHistory','selectedTeacherLabel'].forEach(k => localStorage.removeItem(k));
      alert('Cleared localStorage test keys.');
    } catch(_) {}
  });
});
