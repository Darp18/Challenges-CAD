document.addEventListener('DOMContentLoaded', function() {
    // Fade out welcome after 3 seconds, show form after 1 second
    setTimeout(() => {
      document.getElementById('welcome').classList.add('fade-out');
      setTimeout(() => {
        document.getElementById('main-content').classList.add('visible');
      }, 1000);
    }, 3000);
  
    // Dark mode toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    darkModeToggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      darkModeToggle.textContent = body.classList.contains('dark-mode') ? '☀' : '☾';
    });
  
    // Handle form submission => pass data to Page 2
    const form = document.getElementById('journeyForm');
    const mainContent = document.getElementById('main-content');
  
    form.addEventListener('submit', function(e) {
      e.preventDefault();
  
      const terms = document.getElementById('terms');
      if (!terms.checked) {
        alert("Please agree to the Terms & Conditions before proceeding.");
        return;
      }
  
      // Collect user data
      const firstName = document.getElementById('firstName').value.trim();
      const lastName  = document.getElementById('lastName').value.trim();
      const email     = document.getElementById('email').value.trim();
  
      // Slide-up animation
      document.body.classList.add('fade-out-active');
  
      // After 1 second, redirect to Page 2 with URL params
      setTimeout(() => {
        // Adjust path to your second page
        // We'll add ?firstName=..., etc.
        const url = `Challenges Page/index.html`
          + `?firstName=${encodeURIComponent(firstName)}`
          + `&lastName=${encodeURIComponent(lastName)}`
          + `&email=${encodeURIComponent(email)}`;
  
        window.location.href = url;
      }, 1000);
    });
  });
  