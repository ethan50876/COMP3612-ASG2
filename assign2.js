


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';


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

function search() {
  const titleInput = document.getElementById('title').value.toLowerCase();
  const artistInput = document.getElementById('artist').value.toLowerCase();
  const genreInput = document.getElementById('genre').value.toLowerCase();

  const titleChecked = document.getElementById('title-radio').checked;
  const artistChecked = document.getElementById('artist-radio').checked;
  const genreChecked = document.getElementById('genre-radio').checked;

  const filteredSongs = parsedSongData.filter(song => {
    const titleMatch = titleChecked && song.title.toLowerCase().includes(titleInput);
    const artistMatch = artistChecked && (artistInput === '' || song.artist.name.toLowerCase() === artistInput);
    const genreMatch = genreChecked && (genreInput === '' || song.genre.name.toLowerCase() === genreInput);

    return titleMatch || artistMatch || genreMatch;
  });

  // Sort the filtered songs based on the currentSortField
  filteredSongs.sort((a, b) => a[currentSortField].localeCompare(b[currentSortField]));

  // Update the "results-list" with the filtered and sorted songs
  const searchResults = filteredSongs.map(song => `<li>${formatSongTitle(song.title)}</li>`);
  document.getElementById('results-list').innerHTML = searchResults.join('');
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



// Function to clear search filters
function resetSearch() {
  document.getElementById('title').value = '';
  document.getElementById('artist').value = '';
  document.getElementById('genre').value = '';
  updateRadioButtons('title');
  search();
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

//Unused ATM
function sortList(field) {
  // Implement sorting logic based on the selected field
  // ...

  // For demonstration, let's assume sorting the songs alphabetically
  parsedSongData.sort((a, b) => a[field].localeCompare(b[field]));

  currentSortField = field;
  updateSortIndicator(field);
  search(); // Re-run the search to update the sorted list
}

//Unused ATM
function updateSortIndicator(field) {
  // Add visual cue for sort change, e.g., changing the style of the column header
  // UNUSED ATM

  // For demonstration, let's assume toggling a class for the sorted column header
  const headers = document.querySelectorAll('.sortable');
  headers.forEach(header => header.classList.remove('sorted'));

  const sortedHeader = document.getElementById(`header-${field}`);
  sortedHeader.classList.add('sorted');
}

function clearFilters() {
  filters = { title: true, artist: false, genre: false };
  // Clear and disable any filter-related UI elements
  // ...

  search(); // Re-run the search to remove filters
}

function resetSearch() {
  document.getElementById('title').value = '';
  document.getElementById('artist').value = ''; // Set the default value
  document.getElementById('genre').value = ''; // Set the default value
  clearFilters();
}

// end of search/browse functions







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


document.getElementById('title').addEventListener('input', search);
document.getElementById('artist').addEventListener('change', search);
document.getElementById('genre').addEventListener('change', search);


// Populate the initial list of songs
search();