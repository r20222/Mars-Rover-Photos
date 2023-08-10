// does browser support popover ?
elementSupportsAttribute("popover")

function elementSupportsAttribute(attribute) {
  var popover = document.querySelectorAll('.popover');

  popover.forEach(popover => {
    if (attribute in popover) {
      console.log(true);
    } else {
      console.log(false);
   popover.classList.add('popover-not-working')
    }
  })
  
};
