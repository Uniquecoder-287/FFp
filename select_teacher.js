// select_teacher.js

document.addEventListener('DOMContentLoaded', () => {
  // ---- 1) Cache key DOM elements up front
  const selectEl    = document.getElementById('teacherSelect');
  const continueBtn = document.getElementById('continueBtn');
  const resetBtn    = document.getElementById('resetBtn');
  const backBtn     = document.getElementById('backBtn');

  // ---- 2) Neutralize anchors inside buttons (avoid accidental navigation)
  // Buttons contain <a> tags for markup convenience; prevent their default action so
  // JS can fully control navigation and validation.
  [continueBtn, backBtn].forEach(btn => {
    const a = btn?.querySelector('a');
    if (a) a.addEventListener('click', (e) => e.preventDefault());
  });

  // ---- 3) Optional: snapshot teacher labels into localStorage once
  // Helps other pages retrieve the full list without DOM coupling.
  if (selectEl) {
    const labels = Array.from(selectEl.options)
      .map(o => o.text?.trim())
      .filter(t => t && !t.startsWith('--'));
    if (labels.length) {
      try { localStorage.setItem('teacherList', JSON.stringify(labels)); } catch(_) {}
    }
  }

  // ---- 4) Continue: validate selection → persist label → navigate
  continueBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Guard: ensure a real teacher is selected (index 0 is the placeholder)
    if (!selectEl || selectEl.selectedIndex <= 0 || selectEl.value === "") {
      alert('Please select a teacher first.');
      selectEl?.focus();
      return;
    }

    // Persist the human-readable label so feedback_ques.html can show it
    const label = selectEl.options[selectEl.selectedIndex].text.trim();
    const href  = selectEl.value || 'feedback_ques.html';
    try { localStorage.setItem('selectedTeacherLabel', label); } catch(_) {}

    // Navigate to the selected feedback page (value points to feedback_ques.html)
    window.location.assign(href);
  });

  // ---- 5) Reset: restore placeholder option and clear saved label
  // Using explicit JS for predictable behavior (no form wrapper required).
  resetBtn?.addEventListener('click', (e) => {
    e.preventDefault();               // avoid native reset ambiguity
    if (!selectEl) return;

    // Send the select back to the first option: "-- Select Teacher --"
    selectEl.selectedIndex = 0;

    // Remove any previously saved selection so downstream pages don't read stale data
    try { localStorage.removeItem('selectedTeacherLabel'); } catch(_) {}

    // UX nicety: focus back on the select so users can choose again immediately
    selectEl.focus();
  });

  // ---- 6) Back: return to the selector menu
  backBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign('select.html');
  });

  // ---- 7) TEMP reset data code (dev helper) — safe to delete later
  // Clears common test keys and shows a quick confirmation.
  document.getElementById('reset-test')?.addEventListener('click', () => {
    try {
      ['completedTeachers','feedbackHistory','selectedTeacherLabel'].forEach(k => localStorage.removeItem(k));
      alert('Cleared localStorage test keys.');
    } catch(_) {}
  });
});
