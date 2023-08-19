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

// Voeg dit toe aan je bestaande JavaScript-code of een apart JavaScript-bestand

// const chatForm = document.getElementById('chat-form');
// const userInput = document.getElementById('user-input');
// const chatOutput = document.getElementById('chat-output');

// chatForm.addEventListener('submit', async (event) => {
//   event.preventDefault();

//   const userMessage = userInput.value;

  // Voer hier de code uit om de chatbot-aanroep te doen en de reactie te verkrijgen
  // Gebruik de eerder besproken API-aanroep en verwerk de chatbot-reactie

  // Voeg de gebruikersinvoer en chatbot-reactie toe aan de pagina
  // chatOutput.innerHTML += `
  //   <div class="user-message">${userMessage}</div>
  //   <div class="bot-message">${chatOutput}</div>
  // `;

  // Wis het invoerveld
//   userInput.value = '';
// });
