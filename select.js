document.addEventListener('DOMContentLoaded', () => {
  // 1) Element refs: years, departments, and buttons
  const yearRadios = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3'),
    document.getElementById('option4'),
  ];
  const yearLabels = Array.from(document.querySelectorAll('.pills .pill'));
  const deptItems  = Array.from(document.querySelectorAll('.depts .dot'));

  const continueBtn  = document.getElementById('continueBtn');
  const continueLink = continueBtn ? continueBtn.querySelector('a') : null;
  const resetBtn     = document.getElementById('resetBtn');

  // 2) State
  let selectedYear = getYearFromChecked();
  let selectedDept = null;

  // 3) Initialize UI based on default checked year
  updateYearUI();
  filterDepartments();

  // 4) Year selection via pills (labels)
  yearLabels.forEach((label, idx) => {
    label.addEventListener('click', () => {
      if (yearRadios[idx]) {
        yearRadios[idx].checked = true;
        selectedYear = getYearFromChecked();
        selectedDept = null;
        updateYearUI();
        filterDepartments();
        clearDeptSelection();
      }
    });
  });

  // 5) Department single-select via item clicks
  deptItems.forEach((li) => {
    li.addEventListener('click', (e) => {
      selectedDept = e.currentTarget.textContent.trim();
      markDeptSelected(e.currentTarget);
    });
  });

  // 6) Neutralize default anchor navigation inside Continue
  continueLink?.addEventListener('click', (e) => e.preventDefault());

  // 7) Continue: validate → save → navigate
  continueBtn?.addEventListener('click', async (e) => {
    e.preventDefault();

    if (!selectedYear) {
      alert('Please select your educational year.');
      return;
    }
    if (!selectedDept) {
      alert('Please select your department.');
      return;
    }

    try {
      localStorage.setItem('selectedYear', selectedYear);
      localStorage.setItem('selectedDepartment', selectedDept);
    } catch (_) {}

    // Backend call intentionally commented (as provided)

    window.location.assign('select_teacher.html');
  });

  // 8) Reset: clear year/dept and UI
  resetBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    yearRadios.forEach((r) => (r.checked = false));
    selectedYear = null;
    updateYearUI();
    filterDepartments(); // hides all until a year is chosen
    clearDeptSelection();
  });

  // -------- Helpers --------
  function getYearFromChecked() {
    if (yearRadios[0]?.checked) return 'FE';
    if (yearRadios[1]?.checked) return 'SE';
    if (yearRadios[2]?.checked) return 'TE';
    if (yearRadios[3]?.checked) return 'BE';
    return null;
  }

  function updateYearUI() {
    yearLabels.forEach((label, idx) => {
      const active = yearRadios[idx]?.checked;
      label.classList.toggle('pill--active', !!active);
    });
  }

  function filterDepartments() {
    const map = { FE: 'option1', SE: 'option2', TE: 'option3', BE: 'option4' };
    const activeClass = map[selectedYear] || null;

    deptItems.forEach((li) => {
      if (!activeClass) {
        li.style.display = 'none';
        return;
      }
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

// 9) Global single-select enhancer (kept from original, unchanged in logic)
// Ensures clicking any department enforces single-select styles.
const deptItems = Array.from(document.querySelectorAll('.depts .dot'));
deptItems.forEach(li => {
  li.addEventListener('click', () => {
    deptItems.forEach(n => n.classList.remove('dept--active')); // single-select
    li.classList.add('dept--active'); // adds the green border/glow
  });
});
