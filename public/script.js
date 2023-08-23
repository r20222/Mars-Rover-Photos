// does browser support popover ?
elementSupportsAttribute("popover")

function elementSupportsAttribute(attribute) {
  var popover = document.querySelectorAll('.popover');

  popover.forEach(popover => {
    if (attribute in popover) {
      const popoverButton = document.querySelectorAll('.mars-popover-available-button')

      console.log(true);
      popoverButton.forEach(button => {
        button.classList.add('popover-available-pointer')
      })
    } else {
      console.log(false);
   popover.classList.add('popover-not-working')
    }
  })
  
};



// openai testest

const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatOutput = document.getElementById('chat-output');


chatForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // voorkomt het herladen van de pagina

  const userMessage = userInput.value; // haalt de waarde op die is ingevoerd in het formulier

  // voegt een list item toe aan chatoutput
  chatOutput.innerHTML += `<li class="user-message"><span class="martian">You: </span>${userMessage}</li>`;

  // om automatisch het laatst gestuurde bericht onderin te zetten
  chatOutput.scrollTop = chatOutput.scrollHeight

  // Wis het invoerveld
  userInput.value = '';
  
  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInputForm: userMessage }),
    });

    const data = await response.json();

    const botMessage = data.response;

    // Voeg de gebruikersinvoer en chatbot-reactie toe aan de pagina
    chatOutput.innerHTML += `
    <li class="bot-message"><span class="martian">Martian: </span>${botMessage.content}</li>
    `;
     
     // om automatisch het laatst gestuurde bericht onderin te zetten
    chatOutput.scrollTop = chatOutput.scrollHeight
 
  } catch (error) {
    console.error(error);
  }
});

