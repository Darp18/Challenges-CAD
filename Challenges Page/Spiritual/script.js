// Big Logos/Challenges Page/Spiritual/Spiritual.js

// Image Array with Categories
const images = [
  // Easy
  { category: 'easy', image: "../images/Spiritual_1.png" },
  { category: 'easy', image: "../images/Spiritual_2.png" },
  { category: 'easy', image: "../images/Spiritual_3.png" },
  { category: 'easy', image: "../images/Spiritual_4.png" },

  // Medium
  { category: 'medium', image: "../images/Spiritual_5.png" },
  { category: 'medium', image: "../images/Spiritual_6.png" },
  { category: 'medium', image: "../images/Spiritual_7.png" },
  { category: 'medium', image: "../images/Spiritual_8.png" },

  // Hard
  { category: 'hard', image: "../images/Spiritual_9.png" },
  { category: 'hard', image: "../images/Spiritual_10.png" },
  { category: 'hard', image: "../images/Spiritual_11.png" },
  { category: 'hard', image: "../images/Spiritual_12.png" }
];

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function selectRandomFromEachCategory(array, nPerCategory) {
  const categories = [...new Set(array.map(item => item.category))];
  let selected = [];

  categories.forEach(category => {
    const filtered = array.filter(item => item.category === category);
    const shuffled = shuffleArray(filtered);
    const selectedItems = shuffled.slice(0, nPerCategory);
    selected = selected.concat(selectedItems);
  });

  return selected;
}

document.addEventListener('DOMContentLoaded', () => {
  // Retrieve data from URL
  const urlParams = new URLSearchParams(window.location.search);
  const firstName = urlParams.get('firstName');
  const lastName  = urlParams.get('lastName');
  const email     = urlParams.get('email');
  const social    = urlParams.get('social'); // e.g. "Social"

  const topCardsContainer = document.getElementById('top-cards');
  const bottomCardsContainer = document.getElementById('bottom-cards');

  // Define how many images to select per category
  const imagesPerCategory = 2;
  const totalCategories = [...new Set(images.map(img => img.category))].length;
  const totalImagesNeeded = 6; // for 6 cards
  const perCategory = Math.floor(totalImagesNeeded / totalCategories);

  // 1) Select random images from each category
  let selectedImages = selectRandomFromEachCategory(images, perCategory);

  // If we still need more images to total 6, fill them from the leftover pool
  const remaining = totalImagesNeeded - selectedImages.length;
  if (remaining > 0) {
    const leftoverPool = shuffleArray(images.filter(img => !selectedImages.includes(img)));
    selectedImages = selectedImages.concat(leftoverPool.slice(0, remaining));
  }

  // Shuffle the final set of images
  selectedImages = shuffleArray(selectedImages);

  // Split half & half for top/bottom
  const topImages = selectedImages.slice(0, 3);
  const bottomImages = selectedImages.slice(3, 6);

  // Helper: create a card
  function createCard(imageObj, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('aria-label', `Image Card ${index + 1}`);

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    // Front face
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.style.backgroundImage = `url('../images/Spiritual.png')`; // Assuming 'Social.png' is in the same directory

    // Back face
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('${imageObj.image}')`; // Now only filename

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    // Left-click
    card.addEventListener('click', function(event) {
      if (event.button === 0) { // left click
        if (!card.classList.contains('flipped')) {
          // flip the card
          card.classList.add('flipped');
        } else {
          // toggle "selected"
          card.classList.toggle('selected');
        }
      }
    });

    // Right-click => toggle flip
    card.addEventListener('contextmenu', function(event) {
      event.preventDefault();
      card.classList.toggle('flipped');
    });

    // Keyboard accessibility
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(event) {
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

  // Create top row
  topImages.forEach((imgObj, index) => {
    const card = createCard(imgObj, index);
    topCardsContainer.appendChild(card);
  });

  // Create bottom row
  bottomImages.forEach((imgObj, index) => {
    const card = createCard(imgObj, index + 3);
    bottomCardsContainer.appendChild(card);
  });

  // "I Commit" => gather selected images & open new blank page with all data
  const commitButton = document.querySelector('.accept-button');
  commitButton.addEventListener('click', () => {
    const selectedCards = document.querySelectorAll('.card.selected');
    if (selectedCards.length === 0) {
      alert("Please select at least one challenge card before proceeding.");
      return;
    }
    // Extract the .card-back background image for each selected
    const selectedImageURLs = Array.from(selectedCards).map(card => {
      const backStyle = card.querySelector('.card-back').style.backgroundImage;
      // e.g. backgroundImage: url("../images/Social_5.png")
      const match = backStyle.match(/url\(["']?(.+?)["']?\)/);
      if (match && match[1]) {
        const fullImagePath = match[1]; // e.g., "../images/Social_5.png"
        // Extract only the filename with extension
        const imageName = fullImagePath.substring(fullImagePath.lastIndexOf('/') + 1).toLowerCase(); // "social_5.png"
        return imageName;
      }
      return null; 
    }).filter(Boolean);

    // Build final data in URL => final.html
    const finalUrl = "../final.html"
      + `?firstName=${encodeURIComponent(firstName)}`
      + `&lastName=${encodeURIComponent(lastName)}`
      + `&email=${encodeURIComponent(email)}`
      + `&social=${encodeURIComponent(social)}`
      + `&images=${encodeURIComponent(selectedImageURLs.join(","))}`;

    // Open final page in the same tab (as per original code)
    window.location.href = finalUrl;
  });
});
