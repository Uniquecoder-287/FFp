// feedback_ques.js
document.addEventListener('DOMContentLoaded', () => {
    const QUESTIONS_COUNT = 10;
    const MAX_PER = 5;
    const form = document.getElementById('ratings_form');
    const submitBtn = document.getElementById('submit-btn');
    const backBtn = document.getElementById('cancel-btn');
    const teacherEl = document.getElementById('teacherName');

    // Read the selected teacher from previous page
    const teacherLabel = localStorage.getItem('selectedTeacherLabel') || 'Selected Teacher';
    teacherEl.textContent = teacherLabel;

    // Guard against duplicate attempts (client-side)
    const completedTeachers = getCompletedTeachers();
    if (completedTeachers.includes(teacherLabel)) {
        alert('Feedback already submitted for this teacher. Redirecting to select another.');
        window.location.assign('select_teacher.html');
        return;
    }

    // Ensure the nested anchor in back button doesn’t hijack the click
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

    // Back -> previous page
    backBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.assign('select_teacher.html');
    });

    // Validate and submit
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 1) Require all questions
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

        // 2) Compute average percent
        const sum = Object.values(ratingsMap).reduce((a, b) => a + b, 0);
        const avgPercent = (sum / (QUESTIONS_COUNT * MAX_PER)) * 100;

        // 3) Prepare payload
        const payload = {
            teacherName: teacherLabel,
            ratings: ratingsMap,
            averagePercent: avgPercent,
            submittedAt: new Date().toISOString()
        };

        // 4) Local durability: store the raw submission (per teacher) and append to history
        try {
            localStorage.setItem(`feedback:${teacherLabel}`, JSON.stringify(payload));
            const all = JSON.parse(localStorage.getItem('feedbackHistory') || '[]');
            all.push(payload);
            localStorage.setItem('feedbackHistory', JSON.stringify(all));
        } catch (_) { }

        // 5) BACKEND SAVE (commented out until API exists)
        /*
        try {
          const res = await fetch('/api/feedback/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // if using cookies/session
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const msg = await res.text();
            console.warn('Server did not accept feedback:', msg);
            // Optional: display toast and keep user on this page to retry
          }
        } catch (err) {
          console.warn('Network error while submitting feedback:', err);
          // Optional: display toast and keep user on this page to retry
        }
        */

        // 6) Mark this teacher as completed
        addCompletedTeacher(teacherLabel);

        // 7) Decide where to go next
        // Read the teacher choices that were rendered on select page last time (if you store them)
        // For now, we check from localStorage: 'teacherList' optional; else just route back and let that page hide completed ones.
        const teacherList = getTeacherList(); // optional list of all teachers
        const left = getRemainingTeachers(teacherList);

        if (left.length === 0) {
            alert('Your feedback is submitted. Thank you!');
            window.location.assign('index.html');
        } else {
            window.location.assign('select_teacher.html');
        }
    });

    // Utility: list management in localStorage

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

    // If on the teacher selection page you save the full list into localStorage as 'teacherList',
    // this function will use it; otherwise it returns an empty array and we simply route back.
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
        if (!Array.isArray(all) || all.length === 0) return []; // if not stored, treat as unknown
        const done = new Set(getCompletedTeachers());
        return all.filter((t) => !done.has(t));
    }
});
