// script.js (Social folder)

// Image Array with Categories
const images = [
  // Easy
  { category: 'easy',   image: "../images/Social_1.png" },
  { category: 'easy',   image: "../images/Social_2.png" },
  { category: 'easy',   image: "../images/Social_3.png" },
  { category: 'easy',   image: "../images/Social_4.png" },

  // Medium
  { category: 'medium', image: "../images/Social_5.png" },
  { category: 'medium', image: "../images/Social_6.png" },
  { category: 'medium', image: "../images/Social_7.png" },
  { category: 'medium', image: "../images/Social_8.png" },

  // Hard
  { category: 'hard',   image: "../images/Social_9.png" },
  { category: 'hard',   image: "../images/Social_10.png" },
  { category: 'hard',   image: "../images/Social_11.png" },
  { category: 'hard',   image: "../images/Social_12.png" }
];

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Select nPerCategory from each category (easy, medium, hard)
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
  // 1) Read any existing images from the URL so we can merge them
  const urlParams = new URLSearchParams(window.location.search);
  const existingImagesStr = urlParams.get('images') || "";
  const existingImages = existingImagesStr ? existingImagesStr.split(',') : [];

  // We'll use "Social" as the category name (mirroring Physical's approach)
  const category = "Social";

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
  const topImages = selectedImages.slice(0, 3);
  const bottomImages = selectedImages.slice(3, 6);

  // Helper: create a card
  function createCard(imageObj, index) {
    // Outer card
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('aria-label', `Card ${index + 1}`);

    // Inner wrapper
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Front face
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.style.backgroundImage = "url('../images/Social.png')";

    // Back face
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('${imageObj.image}')`;

    // Append
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // Left-click => flip or select
    card.addEventListener('click', (event) => {
      if (event.button === 0) {
        if (!card.classList.contains('flipped')) {
          card.classList.add('flipped');
        } else {
          card.classList.toggle('selected');
        }
      }
    });

    // Right-click => flip back
    card.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      card.classList.toggle('flipped');
    });

    // Keyboard accessibility (Enter)
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
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
  topImages.forEach((imgObj, i) => {
    const card = createCard(imgObj, i);
    topCardsContainer.appendChild(card);
  });
  bottomImages.forEach((imgObj, i) => {
    const card = createCard(imgObj, i + 3);
    bottomCardsContainer.appendChild(card);
  });

  // Helper: get newly selected filenames
  function getSelectedFilenames() {
    const selectedCards = document.querySelectorAll('.card.selected');
    return Array.from(selectedCards).map(card => {
      const backStyle = card.querySelector('.card-back').style.backgroundImage;
      const match = backStyle.match(/url\(["']?(.+?)["']?\)/);
      if (match && match[1]) {
        const fullPath = match[1];
        return fullPath.substring(fullPath.lastIndexOf('/') + 1);
      }
      return null;
    }).filter(Boolean);
  }

  // 4) Explore More => merge + back to category page
  const exploreBtn = document.querySelector('.explore-button');
  exploreBtn.addEventListener('click', () => {
    const newlySelected = getSelectedFilenames();
    const merged = [...existingImages, ...newlySelected];
    const unique = [...new Set(merged)];

    const imagesParam = encodeURIComponent(unique.join(','));
    window.location.href = `../index.html?category=${category}&images=${imagesParam}`;
  });

  // 5) I Commit => merge + go to signUp page (only sending category + images)
  const commitBtn = document.querySelector('.commit-button');
  commitBtn.addEventListener('click', () => {
    const newlySelected = getSelectedFilenames();
    if (!newlySelected.length && !existingImages.length) {
      alert("Please select at least one challenge card.");
      return;
    }
    const merged = [...existingImages, ...newlySelected];
    const unique = [...new Set(merged)];

    const imagesParam   = encodeURIComponent(unique.join(','));
    const categoryParam = encodeURIComponent(category);
    const signUpURL = `../signUp.html?category=${categoryParam}&images=${imagesParam}`;

    window.location.href = signUpURL;
  });
});
