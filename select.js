const yearButtons = [...document.querySelectorAll('.pill')];
const deptItems = [...document.querySelectorAll('.dept-item')];
const continueBtn = document.getElementById('continueBtn');
const resetBtn = document.getElementById('resetBtn');

let selectedYear = 'FE';
let selectedDept = null;

function syncContinue() {
    continueBtn.disabled = !(selectedYear && selectedDept);
}

yearButtons.forEach(b => {
    b.addEventListener('click', () => {
        yearButtons.forEach(x => x.classList.remove('is-primary'));
        b.classList.add('is-primary');
        selectedYear = b.dataset.year;
        syncContinue();
    });
});

deptItems.forEach(li => {
    li.addEventListener('click', () => {
        deptItems.forEach(x => x.style.outline = 'none');
        li.style.outline = '2px solid var(--ring)';
        selectedDept = li.dataset.dept;
        syncContinue();
    });
});

continueBtn.addEventListener('click', () => {
    const params = new URLSearchParams({ year: selectedYear, dept: selectedDept });
    // Route to your feedback form or next step
    window.location.href = `feedback.html?${params.toString()}`;
});

resetBtn.addEventListener('click', () => {
    selectedDept = null;
    deptItems.forEach(x => x.style.outline = 'none');
    syncContinue();
});