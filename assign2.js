


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';


// INITIAL SETUP SECTION

// Genre JSON parsing into JS object
let parsedGenreData;
(async () => {
  const jsonGenre = 'genres.json';

  try {
    const response = await fetch(jsonGenre);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Convert to string
    const jsonGenreString = JSON.stringify(data);
    
    // Output the JSON string to the console
    console.log('Genre JSON String:', jsonGenreString);

    // Parse string to JS object
    parsedGenreData = JSON.parse(jsonGenreString);

    // Output the parsed JS object to the console
    console.log('Parsed Genre Data:', parsedGenreData);

    // Populating Genre Dropdown
    const genreDropdown = document.getElementById('genre');
    parsedGenreData.forEach(genre => {
    const option = document.createElement('option');
    option.value = genre.name;
    option.text = genre.name;
    genreDropdown.add(option);
});
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
})();

// Artist JSON parsing into JS object
let parsedArtistData;
(async () => {
  const jsonArtist = 'artists.json';

  try {
    const response = await fetch(jsonArtist);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Convert to string
    const jsonArtistString = JSON.stringify(data);
    
    // Output the JSON string to the console
    console.log('Artist JSON String:', jsonArtistString);

    // Parse string to JS object
    parsedArtistData = JSON.parse(jsonArtistString);

    // Output the parsed JS object to the console
    console.log('Parsed Artist Data:', parsedArtistData);


    // Populating Artist Dropdown
    const artistDropdown = document.getElementById('artist');
    parsedArtistData.forEach(artist => {
    const option = document.createElement('option');
    option.value = artist.name;
    option.text = artist.name;
    artistDropdown.add(option);
});
  } catch (error) {
    // Handle errors
    console.error('Error:', error);
  }
})();


// Song API fetching/parsing to JS object
let parsedSongData;
(async () => {
  const storedSongs = localStorage.getItem('songs.json');
  
  if (!storedSongs) {
    try {
      const response = await fetch(api);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      localStorage.setItem('songs.json', JSON.stringify(data));
      parsedSongData = data;
      console.log('Parsed Song Data:', parsedSongData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  } else {
    parsedSongData = JSON.parse(storedSongs);
    console.log('Parsed Song Data:', parsedSongData);
  }

})();

// Populate the initial list of songs
const sortedSongsMap = {
  title: [...parsedSongData],
  artist: [...parsedSongData],
  genre: [...parsedSongData],
  year: [...parsedSongData],
};



/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/

function showCredits() {
  var popup = document.querySelector("#credits .popup");

  if (!popup.classList.contains("show")) {
    //https://www.w3schools.com/howto/howto_js_popup.asp
    popup.classList.toggle("show")
    setTimeout(() => popup.classList.toggle("show"), 5000);
  }
}

function togglePage(pageName) {
  var currPage = document.querySelector("section#" + pageName);
  var otherPages = document.querySelectorAll("section:not(#" + pageName + ")");

  if (!currPage.classList.contains("show")) {
    
    for(page of otherPages) {
      if(page.classList.contains("show")) {
        page.classList.remove("show");
      }
    }
    currPage.classList.add("show");
  }
}





// search/browse JS methods
let currentSortField = 'title'; // Initial sort field
let filters = { title: true, artist: false, genre: false };
let ascending = false;
let filteredSongs = [];

// Function to filter songs based on user input
function filterSongs(parsedSongData, titleInput, artistInput, genreInput, filters) {
  return parsedSongData.filter(song => {
    const titleMatch = filters.title && song.title.toLowerCase().includes(titleInput);
    const artistMatch = filters.artist && song.artist.name.toLowerCase() === artistInput.toLowerCase();
    const genreMatch = filters.genre && song.genre.name.toLowerCase() === genreInput.toLowerCase();

    return titleMatch || artistMatch || genreMatch;
  });
}

// Function to sort songs based on the current sort field
function sortSongs() {
  return parsedSongData.sort((a, b) => {
    const valueA = getFieldValue(a, currentSortField);
    const valueB = getFieldValue(b, currentSortField);

    if (valueA === undefined || valueB === undefined) {
      return 0; // No sorting for undefined values
    }

    return String(valueA).localeCompare(String(valueB));
  });
}


// Function to update the search results in the UI
function updateSearchResults(sortedSongs) {
  const resultsList = document.getElementById('results-list');

  // Clear previous results
  resultsList.innerHTML = '';

  // Accumulate list items in a string
  const listItems = sortedSongs.map(song => `<li>${formatSongTitle(song.title)}</li>`).join('');

  // Set the innerHTML once after the loop
  resultsList.innerHTML = listItems;
}

// Function to update additional lists (artist, genre, year) in the UI
function updateAdditionalList(filteredSongs) {
  const artistList = document.getElementById('artist-list');
  const genreList = document.getElementById('genre-list');
  const yearList = document.getElementById('year-list');

  // Clear previous results
  artistList.innerHTML = '';
  genreList.innerHTML = '';
  yearList.innerHTML = '';

  // Iterate over filteredSongs and append details to respective lists
  filteredSongs.forEach(song => {
    artistList.innerHTML += `<li>${song.artist.name}</li>`;
    genreList.innerHTML += `<li>${song.genre.name}</li>`;
    yearList.innerHTML += `<li>${song.year}</li>`;
  });
}

// Main search function
function search() {
  const titleInput = document.getElementById('title').value.toLowerCase();
  const artistInput = document.getElementById('artist').value.toLowerCase();
  const genreInput = document.getElementById('genre').value.toLowerCase();

  const filters = {
    title: document.getElementById('title-radio').checked,
    artist: document.getElementById('artist-radio').checked,
    genre: document.getElementById('genre-radio').checked,
  };

  filteredSongs = filterSongs(parsedSongData, titleInput, artistInput, genreInput, filters);
  const sortedSongs = sortSongs(filteredSongs, currentSortField);

  console.log('Filtered Songs:', filteredSongs);
  console.log('Sorted Songs:', sortedSongs);

  // Update the UI for the main list (title)
  updateSearchResults(filteredSongs); 

  // Update additional lists (artist, genre, year)
  updateAdditionalList(filteredSongs, song => song.artist.name, 'artist');
  updateAdditionalList(filteredSongs, song => song.genre.name, 'genre');
  updateAdditionalList(filteredSongs, song => song.year, 'year');

  // Update the sortedSongsMap with the current sort field
  sortedSongsMap[currentSortField] = sortedSongs;
}

// Function to update radio buttons and disable other fields
function updateRadioButtons(field) {
  const titleInput = document.getElementById('title');
  const artistInput = document.getElementById('artist');
  const genreInput = document.getElementById('genre');

  // Disable input fields based on the selected radio button
  titleInput.disabled = field !== 'title';
  artistInput.disabled = field !== 'artist';
  genreInput.disabled = field !== 'genre';

}



// Format the filtered searched songs to a max of 25 chars
function formatSongTitle(title) {
  if (title.length > 25) {
    return `${title.substring(0, 25)}&hellip;`;
  }
  return title;
}

// Unused ATM
function showFullTitle(title) {
  // Display full title in a popup (tooltip) for 5 seconds
  const snackbar = document.getElementById('snackbar');
  snackbar.innerHTML = title;
  snackbar.style.display = 'block';
  setTimeout(() => {
    snackbar.style.display = 'none';
  }, 5000);
}


//Unused ATM
function addToPlaylist(title) {
  // Logic to add the song to the playlist
  // ...

  // Display a snackbar (toast) to inform the user
  const snackbar = document.getElementById('snackbar');
  snackbar.innerHTML = `Added "${title}" to the playlist!`;
  snackbar.style.display = 'block';
  setTimeout(() => {
    snackbar.style.display = 'none';
  }, 3000);
}


// Helper function to get the value of a specific field for a song
function getFieldValue(song, field) {
  if (field === 'title') {
    return song[field];
  } else if (field === 'artist') {
    return song.artist.name; 
  } else if (field === 'genre') {
    return song.genre.name;
  } else if (field === 'year') {
    return song[field].toString();
  }
}

function sortSongsByField(songs, field, isAscending) {
  return [...songs].sort((a, b) => {
    const valueA = getFieldValue(a, field);
    const valueB = getFieldValue(b, field);

    return isAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
  });
}

function sortList(field) {
  // Toggle sort direction for the specific field
  const isAscending = currentSortField === field ? !ascending : true;

  // Sort the songs based on the selected field and direction
  currentSortField = field;
  let sortedSongs;

  if (filteredSongs.length > 0) {
    sortedSongs = sortSongsByField(filteredSongs, field, isAscending);
  } else {
    sortedSongs = sortSongsByField(parsedSongData, field, isAscending);
  }

  sortedSongsMap[currentSortField] = sortedSongs;

  // Update the sort direction
  ascending = isAscending;

  updateAllSortedLists(); // Update all sorted lists
}

// Function to update the sorted list in the UI
function updateSortedList(field) {
  const listContainer = document.getElementById(`${field}-container`);
  const list = listContainer.querySelector('ul');

  // Extract the field data and format it
  const sortedListItems = sortedSongsMap[currentSortField].map(song => {
    let fieldValue = getFieldValue(song, field);

    // Format text if it exceeds 25 characters
    fieldValue = formatSongTitle(fieldValue);

    return `<li>${fieldValue}</li>`;
  });

  // Update the list
  list.innerHTML = sortedListItems.join('');
}

// Function to update all sorted lists
function updateAllSortedLists() {
  updateSortedList('title');
  updateSortedList('artist');
  updateSortedList('genre');
  updateSortedList('year');
}



function resetSearch() {
  document.getElementById('title').value = '';
  document.getElementById('artist').value = ''; // Set the default value
  document.getElementById('genre').value = ''; // Set the default value

  // Reset radio buttons
  document.getElementById('title-radio').checked = true;
  document.getElementById('artist-radio').checked = false;
  document.getElementById('genre-radio').checked = false;

  filteredSongs = [];

  // Reset sorting direction to ascending and sort titles alphabetically
  ascending = false;
  currentSortField = 'title'; // Set the default sorting field
  sortList('title');


}

// end of search/browse functions









document.addEventListener('DOMContentLoaded', function () {
  // Call the resetSearch function when the DOM is fully loaded
  resetSearch();
});
document.getElementById('title').addEventListener('input', search);
document.getElementById('artist').addEventListener('change', search);
document.getElementById('genre').addEventListener('change', search);

search();