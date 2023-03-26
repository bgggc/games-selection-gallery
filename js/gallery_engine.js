////////////////////////////////////////
//         Generate the gallery       //
////////////////////////////////////////

// Select the shuffle gallery that will contain all the games
const gallery_container = document.querySelector("#game-shuffle");

// Add each image in the gallery by building the html
for (const game of shuffle_array(games_db)) {
  // Create a figure element with the game data
  const filter_data = document.createElement("figure");
  filter_data.classList.add("js-item", "column", "shuffle-item", "shuffle-item-visible");
  filter_data.setAttribute("data-category", game.category_filter);
  filter_data.setAttribute("data-player", game.player_filter);
  filter_data.setAttribute("data-type", game.type_filter);
  filter_data.setAttribute("data-duration", game.duration_filter);

  // Create the game description data
  const popup_data = document.createElement("div");
  popup_data.classList.add("popup-data");
  popup_data.setAttribute("popup-title", game.title);  
  popup_data.setAttribute("popup-image", game.image);
  popup_data.setAttribute("popup-player", game.player_nb);
  popup_data.setAttribute("popup-duration", game.duration_min);
  popup_data.setAttribute("popup-category", game.category);
  popup_data.setAttribute("popup-desc", game.goal);

  // Create aspect divs
  const aspect_ratio = document.createElement("div");
  const aspect_inner = document.createElement("div");
  aspect_ratio.classList.add("aspect", "aspect--" + game.aspect);
  aspect_inner.classList.add("aspect__inner");

  // Create the image
  const game_image = document.createElement("img");
  game_image.src = game.image;
  game_image.setAttribute("alt",game.title);

  // Create the hierarchy
  aspect_inner.appendChild(game_image);
  aspect_ratio.appendChild(aspect_inner);
  popup_data.appendChild(aspect_ratio);
  filter_data.appendChild(popup_data);
  gallery_container.appendChild(filter_data);
}


////////////////////////////////////////
//         Filters management          //
////////////////////////////////////////

var Shuffle = window.Shuffle;

// ES7 will have Array.prototype.includes.
function arrayIncludes(array, value) {
  return array.indexOf(value) !== -1;
}

// Convert an array-like object to a real array.
function toArray(thing) {
  return Array.prototype.slice.call(thing);
}

var Library = function (element) {
  this.categories = toArray(document.querySelectorAll('.js-categories input'));
  this.players = toArray(document.querySelectorAll('.js-players input'));
  this.types = toArray(document.querySelectorAll('.js-types input'));
  this.durations = toArray(document.querySelectorAll('.js-durations input'));
 
  this.shuffle = new Shuffle(element, {
    easing: 'cubic-bezier(0.165, 0.840, 0.440, 1.000)', // easeOutQuart
    sizer: '.the-sizer',
  });

  this.filters = {
    categories: [],
    players: "",
    types: [],
    durations: [],
  };

  this._bindEventListeners();
};

/**
 * Bind event listeners for when the filters change.
 */
Library.prototype._bindEventListeners = function () {
  this._onCategoryChange = this._handleCheckBoxChange.bind(this, "categories");
  this._onPlayerChange = this._handleRadioChange.bind(this, "players");
  this._onTypeChange = this._handleCheckBoxChange.bind(this, "types");
  this._onDurationChange = this._handleCheckBoxChange.bind(this, "durations");

  this.categories.forEach(function (input) {
    input.addEventListener('change', this._onCategoryChange);
  }, this);

  this.players.forEach(function (button) {
    button.addEventListener('change', this._onPlayerChange);
  }, this);

  this.types.forEach(function (input) {
    input.addEventListener('change', this._onTypeChange);
  }, this);
  
  this.durations.forEach(function (input) {
    input.addEventListener('change', this._onDurationChange);
  }, this);
};

/**
 * Get the values of the `active` radio button.
 * @param {Array<radio>} radios The radios of the filter to inspect.
 * @return {array<string>}
 */
Library.prototype._getCurrentRadioValues = function (radios) {
  return radios.filter(function (button) {
    return button.classList.contains('active');
  }).map(function (button) {
    return button.getAttribute('radio-value');
  });
};

/**
 * Get the values of each checked input.
 * @param {Array<checkbox>} checkboxes The checkboxes of the filter to inspect.
 * @return {Array.<string>}
 */
Library.prototype._getCurrentCheckBoxValues = function (checkboxes) {
  return checkboxes.filter(function (input) {
    return input.checked;
  }).map(function (input) {
    return input.value;
  });
};

/**
 * A input check state changed, update the current filters and filter
 * @param {string} filter Name of the checkbox filter.
 */
Library.prototype._handleCheckBoxChange = function (filter) {
  
  switch (filter) {
    case "categories":
      this.filters.categories = this._getCurrentCheckBoxValues(this.categories);
      break;
    case "types":
      this.filters.types = this._getCurrentCheckBoxValues(this.types);
      break;
    case "durations":
      this.filters.durations = this._getCurrentCheckBoxValues(this.durations);
      break;
    default:
      console.log("Unknown CheckBox filter: " + filter);
  }  
  this.filter();
};

/**
 * A radio button was clicked. Update filters and display.
 * @param {string} filter Name of the checkbox filter.
 * @param {Event} evt Click event object.
 */
Library.prototype._handleRadioChange = function (filter, evt) {
  var button = evt.currentTarget;

  // only 1 can be selected.
  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    this.players.forEach(function (btn) {
      btn.classList.remove('active');
    });

    button.classList.add('active');
  }

  switch (filter) {
    case "players":
      this.filters.players = this._getCurrentRadioValues(this.players);
      break;
    default:
      console.log("Unknown radio filter: " + filter);
  }
  this.filter();
};


/**
 * Filter shuffle based on the current state of filters.
 */
Library.prototype.filter = function () {
  if (this.hasActiveFilters()) {
    this.shuffle.filter(this.itemPassesFilters.bind(this));
  } else {
    this.shuffle.filter(Shuffle.ALL_ITEMS);
  }
};

/**
 * If any of the arrays in the `filters` property have a length of more than zero,
 * that means there is an active filter.
 * @return {boolean}
 */
Library.prototype.hasActiveFilters = function () {
  return Object.keys(this.filters).some(function (key) {
    return this.filters[key].length > 0;
  }, this);
};

/**
 * Determine whether an element passes one of the current filters.
 * @param {array<string>} element_data data of the element to test.
 * @param {array<string>} filter_data data of the filter to test the element against.
 * @return {boolean} Whether it satisfies all current filters.
 */
Library.prototype.itemPassesOneFilter = function (element_data, filter_data) {
  
  if (filter_data.length == 0) {
    return true;
  }

  if (element_data.length == 0) {
    // Should not happen
    console.log("No element data");
    return false;
  }
  
  // Matching all the filter data
  for (let i = 0; i < filter_data.length; i++) {
    if (!arrayIncludes(element_data, filter_data[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Determine whether an element passes the current filters.
 * @param {Element} element Element to test.
 * @return {boolean} Whether it satisfies all current filters.
 */
Library.prototype.itemPassesFilters = function (element) {
  var categories = this.filters.categories;
  var players = this.filters.players;  
  var types = this.filters.types;
  var durations = this.filters.durations;
  var category_data = element.getAttribute('data-category').split(',');
  var player_data = element.getAttribute('data-player').split(',');  
  var type_data = element.getAttribute('data-type').split(',');  
  var duration_data = element.getAttribute('data-duration').split(',');
  
  return (  this.itemPassesOneFilter(category_data, categories) 
         && this.itemPassesOneFilter(player_data, players)
         && this.itemPassesOneFilter(type_data, types)
         && this.itemPassesOneFilter(duration_data, durations));
};

document.addEventListener('DOMContentLoaded', function () {
  window.demo = new Library(document.querySelector('#game-shuffle'));
});