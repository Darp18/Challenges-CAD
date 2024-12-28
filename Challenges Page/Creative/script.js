// Big Logos/Challenges Page/Creative/script.js

// Image Array with Categories
const images = [
  // Easy
  { category: 'easy',   image: "../images/Creative_1.png" },
  { category: 'easy',   image: "../images/Creative_2.png" },
  { category: 'easy',   image: "../images/Creative_3.png" },
  { category: 'easy',   image: "../images/Creative_4.png" },

  // Medium
  { category: 'medium', image: "../images/Creative_5.png" },
  { category: 'medium', image: "../images/Creative_6.png" },
  { category: 'medium', image: "../images/Creative_7.png" },
  { category: 'medium', image: "../images/Creative_8.png" },

  // Hard
  { category: 'hard',   image: "../images/Creative_9.png" },
  { category: 'hard',   image: "../images/Creative_10.png" },
  { category: 'hard',   image: "../images/Creative_11.png" },
  { category: 'hard',   image: "../images/Creative_12.png" }
];

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Select n random images per sub-category
function selectRandomFromEachCategory(array, nPerCategory) {
  const categories = [...new Set(array.map(item => item.category))];
  let selected = [];

  categories.forEach(category => {
    const filtered = array.filter(item => item.category === category);
    const shuffled = shuffleArray(filtered);
    selected = selected.concat(shuffled.slice(0, nPerCategory));
  });

  return selected;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) Read any existing images from the URL for "accumulate" flow
  const urlParams = new URLSearchParams(window.location.search);
  const existingImagesStr = urlParams.get('images') || "";
  const existingImages = existingImagesStr ? existingImagesStr.split(',') : [];

  // Hard-code category to "Creative"
  const category = "Creative";

  // Identify containers
  const topCardsContainer    = document.getElementById('top-cards');
  const bottomCardsContainer = document.getElementById('bottom-cards');

  // Decide how many images per category to pick
  const imagesPerCategory  = 2; // 2 easy, 2 medium, 2 hard => total 6
  const totalImagesNeeded  = 6;
  
  // 2) Select random images
  let selectedImages = selectRandomFromEachCategory(images, imagesPerCategory);

  // If we still need more to reach 6
  const leftoverCount = totalImagesNeeded - selectedImages.length;
  if (leftoverCount > 0) {
    const leftoverPool = shuffleArray(
      images.filter(img => !selectedImages.includes(img))
    );
    const extras = leftoverPool.slice(0, leftoverCount);
    selectedImages = selectedImages.concat(extras);
  }

  // Shuffle the final set
  selectedImages = shuffleArray(selectedImages);

  // Split into two rows
  const topImages    = selectedImages.slice(0, 3);
  const bottomImages = selectedImages.slice(3, 6);

  // Helper: create a card
  function createCard(imageObj, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('aria-label', `Image Card ${index + 1}`);
    card.setAttribute('role', 'button');

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Front face => "Creative.png"
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.style.backgroundImage = "url('../images/Creative.png')";

    // Back face => actual challenge
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('${imageObj.image}')`;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // Left-click => flip or select
    card.addEventListener('click', (evt) => {
      if (evt.button === 0) {
        if (!card.classList.contains('flipped')) {
          card.classList.add('flipped');
        } else {
          card.classList.toggle('selected');
        }
      }
    });

    // Right-click => flip
    card.addEventListener('contextmenu', (evt) => {
      evt.preventDefault();
      card.classList.toggle('flipped');
    });

    // Keyboard => flip or select
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (evt) => {
      if (evt.key === 'Enter' || evt.key === ' ') {
        evt.preventDefault();
        if (!card.classList.contains('flipped')) {
          card.classList.add('flipped');
        } else {
          card.classList.toggle('selected');
        }
      }
    });

    return card;
  }

  // 3) Render top/bottom cards
  topImages.forEach((imgObj, idx) => {
    topCardsContainer.appendChild(createCard(imgObj, idx));
  });
  bottomImages.forEach((imgObj, idx) => {
    bottomCardsContainer.appendChild(createCard(imgObj, idx + 3));
  });

  // Helper: get all selected filenames
  function getSelectedFilenames() {
    const selectedCards = document.querySelectorAll('.card.selected');
    return Array.from(selectedCards).map(card => {
      const backStyle = card.querySelector('.card-back').style.backgroundImage;
      const match = backStyle.match(/url\(["']?(.+?)["']?\)/);
      if (match && match[1]) {
        return match[1].substring(match[1].lastIndexOf('/') + 1).toLowerCase();
      }
      return null;
    }).filter(Boolean);
  }

  // 4) Explore More => merge selected + existing, back to category page
  const exploreBtn = document.querySelector('.explore-button');
  exploreBtn.addEventListener('click', () => {
    const newlySelected = getSelectedFilenames();
    const merged = [...existingImages, ...newlySelected];
    const unique = [...new Set(merged)];

    const imagesParam = encodeURIComponent(unique.join(','));
    window.location.href = `../index.html?category=${encodeURIComponent(category)}&images=${imagesParam}`;
  });

  // 5) I Commit => gather selected + existing, then proceed to sign-up
  const commitBtn = document.querySelector('.commit-button'); // Updated class selector
  commitBtn.addEventListener('click', () => {
    const newlySelected = getSelectedFilenames();
    if (!newlySelected.length && !existingImages.length) {
      alert("Please select at least one challenge card.");
      return;
    }
    const merged = [...existingImages, ...newlySelected];
    const unique = [...new Set(merged)];

    const finalUrl = `../signUp.html`
      + `?category=${encodeURIComponent(category)}`
      + `&images=${encodeURIComponent(unique.join(','))}`;

    window.location.href = finalUrl;
  });
});
