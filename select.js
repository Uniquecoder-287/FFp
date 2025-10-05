document.addEventListener('DOMContentLoaded', () => {
  // Year radios (hidden) and year labels
  const yearRadios = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3'),
    document.getElementById('option4'),
  ];
  const yearLabels = Array.from(document.querySelectorAll('.pills .pill'));

  // Department list items
  const deptItems = Array.from(document.querySelectorAll('.depts .dot'));

  // Buttons and inner anchor
  const continueBtn = document.getElementById('continueBtn');
  const continueLink = continueBtn ? continueBtn.querySelector('a') : null;
  const resetBtn = document.getElementById('resetBtn');

  // State
  let selectedYear = getYearFromChecked();
  let selectedDept = null;

  // Visually reflect the default checked year and filter departments
  updateYearUI();
  filterDepartments();

  // Year selection by clicking labels
  yearLabels.forEach((label, idx) => {
    label.addEventListener('click', () => {
      // Toggle the corresponding hidden radio
      if (yearRadios[idx]) {
        yearRadios[idx].checked = true;
        selectedYear = getYearFromChecked();
        selectedDept = null; // reset department on year change
        updateYearUI();
        filterDepartments();
        clearDeptSelection();
      }
    });
  });

  // Department click selection (single-select)
  deptItems.forEach((li) => {
    li.addEventListener('click', (e) => {
      // Ignore clicks on <a> inside; still select the li for state
      selectedDept = e.currentTarget.textContent.trim();
      markDeptSelected(e.currentTarget);
    });
  });

  // Prevent default navigation on the inner anchor; JS controls the flow
  if (continueLink) {
    continueLink.addEventListener('click', (e) => e.preventDefault());
  }

  // Continue logic
  if (continueBtn) {
    continueBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      // Validate selection
      if (!selectedYear) {
        alert('Please select your educational year.');
        return;
      }
      if (!selectedDept) {
        alert('Please select your department.');
        return;
      }

      // Persist locally for the next page (so select_teacher.html can use it)
      try {
        localStorage.setItem('selectedYear', selectedYear);
        localStorage.setItem('selectedDepartment', selectedDept);
      } catch (_) {}

      // BACKEND: Send the selection to the database (commented out as requested)
      /*
      try {
        const res = await fetch('/api/student/selection', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // if using cookies/session
          body: JSON.stringify({
            year: selectedYear,       // e.g., "FE", "SE", "TE", "BE"
            department: selectedDept, // e.g., "AIML"
            submittedAt: new Date().toISOString()
          })
        });
        if (!res.ok) {
          const msg = await res.text();
          console.warn('Failed to save selection:', msg);
          // Optionally keep navigating but show a toast for the failure
        }
      } catch (err) {
        console.warn('Network error while saving selection:', err);
        // Optionally keep navigating but show a toast
      }
      */

      // Navigate to the next page
      window.location.assign('select_teacher.html');
    });
  }

  // Reset logic
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Reset year to none (or to default) and clear UI
      yearRadios.forEach((r) => (r.checked = false));
      selectedYear = null;
      updateYearUI();
      filterDepartments(); // will hide all until a year is chosen
      clearDeptSelection();
    });
  }

  // Helpers

  function getYearFromChecked() {
    if (yearRadios[0]?.checked) return 'FE';
    if (yearRadios[1]?.checked) return 'SE';
    if (yearRadios[2]?.checked) return 'TE';
    if (yearRadios[3]?.checked) return 'BE'; // Final Year
    return null;
  }

  function updateYearUI() {
    // Add a selected class to the active pill to match your visuals
    yearLabels.forEach((label, idx) => {
      const active = yearRadios[idx]?.checked;
      label.classList.toggle('pill--active', !!active);
    });
  }

  function filterDepartments() {
    // Show only departments for the selected year based on li classes (option1..option4)
    const map = { FE: 'option1', SE: 'option2', TE: 'option3', BE: 'option4' };
    const activeClass = map[selectedYear] || null;

    deptItems.forEach((li) => {
      if (!activeClass) {
        li.style.display = 'none';
        return;
      }
      // li has classes like "option1 dot"
      const isForYear = li.classList.contains(activeClass);
      li.style.display = isForYear ? '' : 'none';
    });
  }

  function clearDeptSelection() {
    deptItems.forEach((li) => li.classList.remove('dept--active'));
    selectedDept = null;
  }

  function markDeptSelected(el) {
    deptItems.forEach((li) => li.classList.remove('dept--active'));
    el.classList.add('dept--active');
  }
});

const deptItems = Array.from(document.querySelectorAll('.depts .dot'));
deptItems.forEach(li=>{
  li.addEventListener('click', ()=>{
    deptItems.forEach(n=>n.classList.remove('dept--active')); // single-select
    li.classList.add('dept--active'); // adds the green border/glow
  });
});

