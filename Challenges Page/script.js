document.addEventListener('DOMContentLoaded', () => {
  // Grab data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const firstName = urlParams.get('firstName');
  const lastName  = urlParams.get('lastName');
  const email     = urlParams.get('email');

  const buttons = document.querySelectorAll('.category-button');
  const motivationTextBar = document.getElementById('motivation-text-bar');
  const motivationText = document.getElementById('motivation-text');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const body = document.body;

  // Some motivational text for each category
  const motivationMap = {
    Physical: "Physical: Challenge your body and feel stronger every day!",
    Social: "Social: Connect with friends and build meaningful relationships.",
    Emotional: "Emotional: Embrace your emotions and grow from within.",
    Spiritual: "Spritual: Find inner peace and nurture your soul.",
    Creative: "Creative: Unleash your imagination and create something beautiful.",
    Travel: "Travel: Explore new horizons and broaden your perspective."
  };

  // Hover events: show/hide text
  buttons.forEach(button => {
    const category = button.getAttribute('data-category');

    button.addEventListener('mouseenter', () => {
      motivationText.textContent = motivationMap[category] || '';
      motivationTextBar.style.opacity = '1';
    });

    button.addEventListener('mouseleave', () => {
      motivationTextBar.style.opacity = '0';
    });

    // Click event: pass all data (firstName, lastName, email) + chosen category to Page 3
    button.addEventListener('click', () => {
      // e.g. "Social" -> "Social/index.html"
      const folderName = category; // Make sure folder matches
      const nextPage   = `${folderName}/index.html`;

      const url = `${nextPage}?firstName=${encodeURIComponent(firstName)}`
                + `&lastName=${encodeURIComponent(lastName)}`
                + `&email=${encodeURIComponent(email)}`
                + `&social=${encodeURIComponent(category)}`;

      window.location.href = url;
    });
  });

  // Dark mode toggle
  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    darkModeToggle.textContent = body.classList.contains('dark-mode') ? '☀' : '☾';
  });

  // Subtitle Text Animation
  const changingSubtitle = document.getElementById('changing-subtitle');
  const subtitleTexts = [
    "Energize",
    "Connect",
    "Embrace",
    "Awaken",
    "Innovate",
    "Traverse",
    "Grow",
    "Thrive",
    "Evolve",
    "Achieve",
    "Transform",
    "Flourish"
  ];

  const subtitleColors = {
    "Grow": "#ff6347",  // Red
    "Thrive": "#d9a527",  // Yellow
    "Evolve": "#00bcd4",  // Aqua
    "Achieve": "#9c27b0",  // Purple
    "Transform": "#ff9800",  // Orange
    "Flourish": "#4caf50",  // Green
    "Energize": "#ff6347",  // Red
    "Connect": "#d9a527",  // Yellow
    "Embrace": "#00bcd4",  // Aqua
    "Awaken": "#9c27b0",  // Purple
    "Innovate": "#ff9800",  // Orange
    "Traverse": "#4caf50"  // Green
  };

  let subtitleIndex = 0;
  let subtitleCharIndex = 0;
  let isDeleting = false;
  const typingDelay = 150;
  const erasingDelay = 100;
  const newTextDelay = 2000; // 2 seconds pause

  function typeSubtitle() {
    const currentText = subtitleTexts[subtitleIndex];
    changingSubtitle.style.color = subtitleColors[currentText]; // Set the color dynamically

    if (!isDeleting) {
      changingSubtitle.textContent = currentText.substring(0, subtitleCharIndex + 1);
      subtitleCharIndex++;
      if (subtitleCharIndex === currentText.length) {
        isDeleting = true;
        setTimeout(typeSubtitle, newTextDelay);
      } else {
        setTimeout(typeSubtitle, typingDelay);
      }
    } else {
      changingSubtitle.textContent = currentText.substring(0, subtitleCharIndex - 1);
      subtitleCharIndex--;
      if (subtitleCharIndex === 0) {
        isDeleting = false;
        subtitleIndex = (subtitleIndex + 1) % subtitleTexts.length;
        setTimeout(typeSubtitle, typingDelay);
      } else {
        setTimeout(typeSubtitle, erasingDelay);
      }
    }
  }

  // Initialize the subtitle typing effect
  setTimeout(typeSubtitle, 1000); // Start after 1 second
});
