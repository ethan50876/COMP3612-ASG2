


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';


// INITIAL SETUP SECTION

// Genre JSON parsing into JS object
let parsedGenreData;

fetch('genres.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
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
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });


// Artist JSON parsing into JS object
let parsedArtistData;

fetch('artists.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
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
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });



// Song API fetching/parsing to JS object
let parsedSongData;
const storedSongs = localStorage.getItem('songs.json');

if (!storedSongs) {
  fetch(api)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('songs.json', JSON.stringify(data));
      parsedSongData = data;
      console.log('Parsed Song Data:', parsedSongData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
} else {
  parsedSongData = JSON.parse(storedSongs);
  console.log('Parsed Song Data:', parsedSongData);
}

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
let playlist = [];

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

    // No sorting for undefined values
    if (valueA === undefined || valueB === undefined) {
      return 0; 
    }

    return String(valueA).localeCompare(String(valueB));
  });
}


// Function to update the search results in the UI
function updateSearchResults(sortedSongs) {
  const resultsList = document.getElementById('results-list');
  const playlistButtonsContainer = document.getElementById('playlist-buttons');
  const yearList = document.getElementById('year-list');

  // Clear previous results and buttons
  resultsList.innerHTML = '';
  playlistButtonsContainer.innerHTML = '';
  yearList.innerHTML = '';

  // Iterate over sortedSongs and append details to respective containers
  sortedSongs.forEach(song => {
    // container for each song's details
    const listItemContainer = document.createElement('div');
    
    // results list container
    listItemContainer.innerHTML += `<li>${formatSongTitle(song.title)}</li>`;
    
    // event listener to open single song view
    listItemContainer.addEventListener('click', () => openSingleSongView(song));
    
    // append the container to the main results list
    resultsList.appendChild(listItemContainer);
  });
}

// Function to update the lists (artist, genre, year) in the UI
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
  // Update the UI 
  updateSearchResults(filteredSongs); 
  updateAdditionalList(filteredSongs, song => song.artist.name, 'artist');
  updateAdditionalList(filteredSongs, song => song.genre.name, 'genre');
  updateAdditionalList(filteredSongs, song => song.year, 'year');

  // Update the sortedSongsMap with the current sort field
  sortedSongsMap[currentSortField] = sortedSongs;

  // Add a button for each displayed song
  const playlistButtonsContainer = document.getElementById('playlist-buttons');
  playlistButtonsContainer.innerHTML = ''; // Clear previous buttons
  
  const resultsList = document.getElementById('results-list');
  resultsList.childNodes.forEach((result, index) => {
    const song = filteredSongs[index];
    const addToPlaylistButton = document.createElement('button');
    addToPlaylistButton.textContent = '+';
    addToPlaylistButton.onclick = () => addToPlaylist(song);
    playlistButtonsContainer.appendChild(addToPlaylistButton);
  });
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


function formatSongTitle(title) {
  if (title.length > 25) {
    const shortTitle = `${title.substring(0, 25)}&hellip;`;
    const fullTitle = title;

    return `<span title="${fullTitle}">${shortTitle}</span>`;
  }
  return title;
}

function showFullTitle(title) {
  const tooltip = document.getElementById('tooltip');
  tooltip.textContent = title;
  tooltip.style.display = 'block';

  setTimeout(() => {
    tooltip.style.display = 'none';
  }, 5000);
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
  // Re-update all sorted lists
  updateAllSortedLists(); 
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

  updatePlaylistButtons(sortedSongsMap[currentSortField]);
}



function resetSearch() {
  document.getElementById('title').value = '';
  document.getElementById('artist').value = '';
  document.getElementById('genre').value = '';

  document.getElementById('title-radio').checked = true;
  document.getElementById('artist-radio').checked = false;
  document.getElementById('genre-radio').checked = false;

  // Reset other variables or state as needed

  filteredSongs = [];
  // Reset sorting direction to ascending and sort titles alphabetically
  ascending = false;
  // Set the default sorting field
  currentSortField = 'title'; 
  sortList('title');
}


function addToPlaylist(song) {
    playlist.push(song);
    showSnackbar();
    console.log('Current Playlist:', playlist);
}

function showSnackbar() {
  const snackbar = document.getElementById('snackbar');
  snackbar.style.display = 'block';

  // Hide the snackbar after 3 seconds
  setTimeout(() => {
    snackbar.style.display = 'none';
  }, 3000);
}

function updatePlaylistButtons(sortedSongs) {
  const playlistButtonsContainer = document.getElementById('playlist-buttons');
  playlistButtonsContainer.innerHTML = '';

  if (sortedSongs) {
    // Iterate over sortedSongs and append "+" button for each song
    sortedSongs.forEach(song => {
      const addToPlaylistButton = document.createElement('button');
      addToPlaylistButton.textContent = '+';
      addToPlaylistButton.onclick = () => addToPlaylist(song);
      playlistButtonsContainer.appendChild(addToPlaylistButton);
    });
  }
}

// end of search/browse functions

// start of single song view functions

let singleSongViewOpen = false;
let radarChartCreated;


function openSingleSongView(song) {
  // Check if the single song view is not already open
  if (!singleSongViewOpen) {
    // Hide the search/browse view
    const searchBrowseView = document.getElementById('search-view');
    searchBrowseView.style.display = 'none';

    // Show the single song view
    const singleSongView = document.getElementById('single-song-view');
    singleSongView.style.display = 'block';

    // Update the view state
    singleSongViewOpen = true;

    const formattedDuration = formatDuration(song.details.duration);

    // Update the single song view content with the song details
    const songDetailsElement = document.getElementById('song-details');
    songDetailsElement.innerHTML = `
      <p>Song Name: ${song.title}</p>
      <p>Artist: ${song.artist.name}</p>
      <p>Genre: ${song.genre.name}</p>
      <p>Year: ${song.year}</p>
      <p>Duration: ${formattedDuration}</p>
      <br>
      <p><strong>Analytics Data:</strong></p>
      <p>BPM: ${song.details.bpm}</p>
      <p>Energy: ${song.analytics.energy}</p>
      <p>Danceability: ${song.analytics.danceability}</p>
      <p>Liveness: ${song.analytics.liveness}</p>
      <p>Valence: ${song.analytics.valence}</p>
      <p>Acousticness: ${song.analytics.acousticness}</p>
      <p>Speechiness: ${song.analytics.speechiness}</p>
      <p>Popularity: ${song.details.popularity}</p>


    `;
  
    console.log('Open Single Song View for:', song);
    createRadarChart(song);
  }
}

function closeSingleSongView() {
  // Check if the single song view is open
  if (singleSongViewOpen) {
    // Hide the single song view
    const singleSongView = document.getElementById('single-song-view');
    singleSongView.style.display = 'none';

    // Show the search/browse view
    const searchBrowseView = document.getElementById('search-view');
    searchBrowseView.style.display = 'block';

    // Update the view state
    singleSongViewOpen = false;
  }
}

function formatDuration(durationInSeconds) {
  const minutes = Math.floor(durationInSeconds / 60);
  const seconds = durationInSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function createRadarChart(song) {
  if (radarChartCreated) {
    radarChartCreated.destroy();
  }
  const radarData = {
    labels: ['Energy', 'Danceability', 'Valence', 'Liveness', 'Acousticness', 'Speechiness'],
    datasets: [
      {
        label: 'Song Properties',
        data: [
          song.analytics.energy,
          song.analytics.danceability,
          song.analytics.valence,
          song.analytics.liveness,
          song.analytics.acousticness,
          song.analytics.speechiness,
        ],
      }
    ]
  };

  const radarOptions = {
    scale: {
      ticks: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const radarChartCanvas = document.getElementById('radar-chart');
  radarChartCreated = new Chart(radarChartCanvas, {
    type: 'radar',
    data: radarData,
    options: radarOptions
  });
}


// end of single song view functions









document.addEventListener('DOMContentLoaded', function () {
  // Call the search function when the DOM is fully loaded
  search();
  document.getElementById('title').addEventListener('input', search);
  document.getElementById('artist').addEventListener('change', search);
  document.getElementById('genre').addEventListener('change', search);

});
