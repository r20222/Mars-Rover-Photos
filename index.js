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
  const url = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.marsRoverKey}`;

  fetchJson(url).then((data) => {
    response.render('rover', {data: data})
  })
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