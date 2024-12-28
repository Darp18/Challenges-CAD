// Big Logos/Challenges Page/Emotional/script.js

// Image Array with Categories (easy, medium, hard)
const images = [
  // Easy
  { category: 'easy',   image: "../images/Emotional_1.png" },
  { category: 'easy',   image: "../images/Emotional_2.png" },
  { category: 'easy',   image: "../images/Emotional_3.png" },
  { category: 'easy',   image: "../images/Emotional_4.png" },

  // Medium
  { category: 'medium', image: "../images/Emotional_5.png" },
  { category: 'medium', image: "../images/Emotional_6.png" },
  { category: 'medium', image: "../images/Emotional_7.png" },
  { category: 'medium', image: "../images/Emotional_8.png" },

  // Hard
  { category: 'hard',   image: "../images/Emotional_9.png" },
  { category: 'hard',   image: "../images/Emotional_10.png" },
  { category: 'hard',   image: "../images/Emotional_11.png" },
  { category: 'hard',   image: "../images/Emotional_12.png" }
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

  // Hard-code category to "Emotional"
  const category = "Emotional";

  // Identify containers
  const topCardsContainer    = document.getElementById('top-cards');
  const bottomCardsContainer = document.getElementById('bottom-cards');

  // Decide how many images
  const imagesPerCategory = 2; // 2 easy, 2 medium, 2 hard => total 6
  const totalImagesNeeded = 6;

  let selectedImages = selectRandomFromEachCategory(images, imagesPerCategory);
  const leftoverCount = totalImagesNeeded - selectedImages.length;
  if (leftoverCount > 0) {
    const leftoverPool = shuffleArray(images.filter(i => !selectedImages.includes(i)));
    selectedImages = selectedImages.concat(leftoverPool.slice(0, leftoverCount));
  }

  // Shuffle final set
  selectedImages = shuffleArray(selectedImages);

  // Split top/bottom
  const topImages    = selectedImages.slice(0, 3);
  const bottomImages = selectedImages.slice(3, 6);

  function createCard(imgObj, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('aria-label', `Card ${index + 1}`);

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Front => Emotional.png
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.style.backgroundImage = "url('../images/Emotional.png')";

    // Back => actual challenge
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('${imgObj.image}')`;

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

  // Render top
  topImages.forEach((img, i) => {
    topCardsContainer.appendChild(createCard(img, i));
  });
  // Render bottom
  bottomImages.forEach((img, i) => {
    bottomCardsContainer.appendChild(createCard(img, i + 3));
  });

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

  // Explore More => merges newly selected + existing => back to category page
  const exploreBtn = document.querySelector('.explore-button');
  exploreBtn.addEventListener('click', () => {
    const newlySelected = getSelectedFilenames();
    const merged = [...existingImages, ...newlySelected];
    const unique = [...new Set(merged)];
    const imagesParam = encodeURIComponent(unique.join(','));

    window.location.href = `../index.html?category=${encodeURIComponent(category)}&images=${imagesParam}`;
  });

  // I Commit => go to signUp page, passing only category + images
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
