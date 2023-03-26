/* Get the filters element */
const resetBtn = document.getElementById('reset-btn');
const checkboxes = document.querySelectorAll('input[type="checkbox"]');
const radios = document.querySelectorAll('input[type="radio"]');
const player_all = document.getElementById('cb-all');

resetBtn.addEventListener('click', () => {
  // Reset checkboxes and generate an event to update the filters
  checkboxes.forEach(checkbox => {
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
  });
  // Reset the radio buttons
  radios.forEach(radio => {
    if (radio.checked) {
      radio.checked = false;
    }
  });
  // Reset player number to all and generate an event to update the filters
  player_all.checked = true;
  player_all.dispatchEvent(new Event('change'));
});