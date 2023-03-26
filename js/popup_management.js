// Get popup and close button
const popup = document.getElementById("my-popup");
const closeBtn = popup.querySelector(".close");

// Add event to close the popup
closeBtn.addEventListener("click", function() {
  popup.style.display = "none";
});

// Close the modal if you clic around the modal
window.addEventListener('click', (event) => {
  if (event.target === popup) {
    popup.style.display = "none";
  }
});

// Get all the images 
const items = document.querySelectorAll('.popup-data');

// Loop on each image to add a click listener
items.forEach(item => {
  item.addEventListener('click', () => {

    // Change the popup content according to the item
    document.querySelector('#popup-title').innerHTML = item.getAttribute("popup-title");
    document.querySelector('#popup-image').src = item.getAttribute("popup-image");
    document.querySelector('#popup-player').innerHTML = item.getAttribute("popup-player");
    document.querySelector('#popup-duration').innerHTML = item.getAttribute("popup-duration");
    document.querySelector('#popup-category').innerHTML = item.getAttribute("popup-category");
    document.querySelector('#popup-desc').innerHTML = item.getAttribute("popup-desc");

    // Display the popup
    popup.style.display = 'block';
  });
});