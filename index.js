// importeer express om het te kunnen gebruiken
import express from 'express'

// Maak een nieuwe express app
const app = express()

// importeer dotenv
import 'dotenv/config'

// om fetch te gebruiken voor online zetten, nodig om op render te zetten
import fetch from 'node-fetch';

// importeer body-parser om gegevens uit de body op te kunnen halen
import bodyParser from 'body-parser'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// openai
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// Maak routes met express naar de views & public 
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(express.static('public'))

// Stel afhandeling van formulieren in
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

  

// post vragen naar openai
app.post('/', async (req, res) => {

  try {
    const userInput = req.body.userInputForm;

    // Voeg de beperkingen toe aan het chatbericht
    const chatMessageWithRestrictions = setChatGPTRestrictions(userInput);

    const chatCompletion1 = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: "user", content: chatMessageWithRestrictions }],
    });

    const generatedMessage = chatCompletion1.data.choices[0].message;
    
    // Log de geposte invoer en de OpenAI-reactie naar de console
    console.log('Gebruikersinvoer:', userInput);
    console.log('OpenAI-reactie:', generatedMessage);
    

    // Stuur de gegenereerde reactie als JSON terug naar de frontend
    res.json({ response: generatedMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Er is een fout opgetreden' });
  }
});

// Functie voor chatgpt beperkingen
function setChatGPTRestrictions(question) {
  return `Restrictions: Only questions about the universe and Mars-related topics will be answered. 
  Keep your response concise, up to a maximum of 250 words. 
  End each response with a random emoji. Answer in english. Question: ${question}`;
}

// Maak een route voor de rover pagina
app.get('/rover.ejs', (request, response) => {
  const rover = request.query.rover;
  const roverUrl = `https://api.nasa.gov/mars-photos/api/v1/manifests/${rover}?api_key=${process.env.marsRoverKey}`;

  const sol = request.query.sol;

  let solUrl = null;

  fetchJson(roverUrl)
    .then(roverData => {
      const maxSol = roverData.photo_manifest.max_sol;
      let page = request.query.page || 1;
      
      if (sol) {
        solUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=${page}&api_key=${process.env.marsRoverKey}`;
      } else {
        // Gebruik maxSol als standaardwaarde
        solUrl = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${maxSol}&page=${page}&api_key=${process.env.marsRoverKey}`;
      }

      return fetchJson(solUrl)
        .then(solData => {
          response.render('rover', { roverData: roverData, solData: solData, rover: rover, sol:sol, page: page });
        });
    })
    .catch(error => {
      console.error('Fout bij het ophalen van gegevens:', error);
      response.render('error', { error: error });
    });
})

// test sitemap

// https://stackoverflow.com/questions/37194630/how-to-generate-a-sitemap-in-expressjs
// https://www.xml-sitemaps.com/details-mars-rover-photos.onrender.com-a2e393bbe.html

app.get('/sitemap.xml', (req, res) => {
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
  http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <!--  created with Free Online Sitemap Generator www.xml-sitemaps.com  -->
  <url>
    <loc>https://mars-rover-photos.onrender.com/</loc>
    <lastmod>2023-08-13T14:04:13+00:00</lastmod>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>https://mars-rover-photos.onrender.com/rover.ejs?rover=curiosity&amp;sol=3916</loc>
    <lastmod>2023-08-13T14:04:13+00:00</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://mars-rover-photos.onrender.com/rover.ejs?rover=opportunity&amp;sol=5111</loc>
    <lastmod>2023-08-13T14:04:13+00:00</lastmod>
    <priority>0.80</priority>
  </url>
  <url>
    <loc>https://mars-rover-photos.onrender.com/rover.ejs?rover=spirit&amp;sol=2208</loc>
    <lastmod>2023-08-13T14:04:13+00:00</lastmod>
    <priority>0.80</priority>
  </url>
</urlset>`;

  res.set('Content-Type', 'text/xml');
  res.send(xmlContent);
});








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
