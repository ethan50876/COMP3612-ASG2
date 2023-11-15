


/* url of song api --- https versions hopefully a little later this semester */	
const api = 'http://www.randyconnolly.com/funwebdev/3rd/api/music/songs-nested.php';

// Genre JSON parsing to JS object 
const jsonGenre = 'genres.json';

fetch(jsonGenre)
  .then(response => {
      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
    return response.json();
  })
  .then(data => {
      // convert to string
      const jsonGenreString = JSON.stringify(data);
      
      // output the JSON string to the console
      console.log('Genre JSON String:', jsonGenreString);

      // parse string to JS object
      const parsedGenreData = JSON.parse(jsonGenreString);

      // output the parsed JS object to the console
      console.log('Parsed Genre Data:', parsedGenreData);
  })
  .catch(error => {
      console.error('Error fetching JSON:', error);
  }); 

// Artist JSON parsing to JS object  
const jsonArtist = 'artists.json';

fetch(jsonArtist)
  .then(response => {
      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      const jsonArtistString = JSON.stringify(data);

      console.log('Artist JSON String:', jsonArtistString);

      const parsedArtistData = JSON.parse(jsonArtistString);

      console.log('Parsed Artist Data:', parsedArtistData);
  })
  .catch(error => {
      console.error('Error fetching JSON:', error);
  }); 

// Song API fetching/parsing to JS object

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
        const parsedSongData = JSON.parse(localStorage.getItem('songs.json'));
        console.log('Parsed Song Data:', parsedSongData);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
} else {
  const parsedSongData = JSON.parse(storedSongs);
  console.log('Parsed Song Data:', parsedSongData);
}



/* note: you may get a CORS error if you try fetching this locally (i.e., directly from a
   local file). To work correctly, this needs to be tested on a local web server.  
   Some possibilities: if using Visual Code, use Live Server extension; if Brackets,
   use built-in Live Preview.
*/
