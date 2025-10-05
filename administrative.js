// Hook elements from the current markup (no HTML changes)
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('.inp');
  const loginBtn = document.querySelectorAll('.cta')[0];
  const backBtn = document.querySelectorAll('.cta')[1];
  const loginLink = loginBtn.querySelector('a');
  const backLink = backBtn.querySelector('a');

  // Defensive: ensure expected structure exists
  if (inputs.length < 2 || !loginBtn || !backBtn || !loginLink || !backLink) return;

  const prnInput = inputs[0];
  const passInput = inputs[1];

  // Prevent the inner anchor from hard-navigating; JS will control routing
  loginLink.addEventListener('click', (e) => e.preventDefault());
  backLink.addEventListener('click', (e) => e.preventDefault());

  // Login flow
  loginBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const prn = prnInput.value.trim();
    const password = passInput.value; // keep as-is

    // Minimal client-side validation
    if (!prn || !password) {
      // You can replace alert with a styled toast
      alert('Please enter PRN and Password.');
      return;
    }

    // Persist PRN locally for later steps (e.g., prefill or association)
    try { localStorage.setItem('studentPRN', prn); } catch (_) {}

    // BACKEND/AUTH PLACEHOLDER:
    // Replace the block below with a real API call to validate credentials
    // and establish a session/JWT. Keep it commented for now as requested.

    /*
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // if using cookies/session
        body: JSON.stringify({ prn, password })
      });

      if (!res.ok) {
        // Show an error message to the user based on server response
        const msg = await res.text();
        alert(msg || 'Login failed. Please check your credentials.');
        return;
      }

      // Optionally receive a token and store it securely:
      // const { token } = await res.json();
      // localStorage.setItem('authToken', token);
    } catch (err) {
      alert('Network error. Please try again.');
      return;
    }
    */

    // On success (or while backend is not ready), navigate to next step
    window.location.assign('select.html');
  });

  // Back flow
  backBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.assign('index.html');
  });
});
