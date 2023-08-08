// importeer express om het te kunnen gebruiken
import express from 'express'

// Maak een nieuwe express app
const app = express()

// importeer dotenv
import 'dotenv/config'

// om fetch te gebruiken voor online zetten, nodig om op render te zetten?
// import fetch from 'node-fetch';


// Maak routes met express naar de views & public 
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))


// Maak een route voor de index
app.get('/', (request, response) => {

    const missionManifestUrlCuriosity = `https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${process.env.marsRoverKey}`
    const missionManifestUrlOpportunity = `https://api.nasa.gov/mars-photos/api/v1/manifests/opportunity?api_key=${process.env.marsRoverKey}`
    const missionManifestUrlSpirit = `https://api.nasa.gov/mars-photos/api/v1/manifests/spirit?api_key=${process.env.marsRoverKey}`

    Promise.all([fetchJson(missionManifestUrlCuriosity), fetchJson(missionManifestUrlOpportunity), fetchJson(missionManifestUrlSpirit)])
    .then(([curiosity, opportunity, spirit]) => {
      response.render('index', {curiosity: curiosity, opportunity: opportunity, spirit: spirit})
    })
  })

// Maak een route voor de rover pagina
app.get('/rover.ejs', (request, response) => {
  const rover = request.query.rover;
  const roverUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.marsRoverKey}`;


  const sol = request.query.sol;
  // const solUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.marsRoverKey}`;

  // const solUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.marsRoverKey}`;


  // Promise.all([fetchJson(roverUrl), fetchJson(solUrl)])
  // .then(([roverData, solData]) => {
  //   response.render('index', {roverData: roverData, solData: solData, rover: rover})
  // }) 
  // .catch(error => {
  //   console.error('Fout bij het ophalen van gegevens:', error);
  //   response.render('error', { error: error }); // Toon een foutpagina met de foutinformatie
  // });


  let solUrl = null;

  fetchJson(roverUrl)
    .then(roverData => {
      const maxSol = roverData.photo_manifest.max_sol;

      if (sol) {
        solUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&api_key=${process.env.marsRoverKey}`;
      } else {
        // Gebruik maxSol als standaardwaarde
        solUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${maxSol}&api_key=${process.env.marsRoverKey}`;
      }

      return fetchJson(solUrl)
        .then(solData => {
          response.render('rover', { roverData: roverData, solData: solData, rover: rover });
        });
    })
    .catch(error => {
      console.error('Fout bij het ophalen van gegevens:', error);
      response.render('error', { error: error });
    });
  // fetchJson(roverUrl).then((data) => {
  //   response.render('rover', {data: data, rover: rover})
  //   console.log(data)
  // })
})

// Stel het poortnummer in en start express
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});


// definieer de fetchJson functie
async function fetchJson(url) {
    return await fetch(url)
        .then((response) => response.json())
        .catch((error) => error)
    } 









// hiermee check je het limiet

    fetch(`https://api.nasa.gov/mars-photos/api/v1/manifests/curiosity?api_key=${process.env.marsRoverKey}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
})
.then(response => {
  // Controleer de X-RateLimit-Limit en X-RateLimit-Remaining headers
  const limit = response.headers.get('X-RateLimit-Limit');
  const remaining = response.headers.get('X-RateLimit-Remaining');

  console.log('Limiet:', limit);
  console.log('Resterend:', remaining);

  return response.json(); // Verwerk de API-respons zoals nodig
})
.catch(error => {
  console.error('Fout bij het ophalen van gegevens:', error);
});
