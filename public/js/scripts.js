const currentColors = [];
const lockedColors = [];

$('.new-palette-btn').on('click', colorsArray);
$('.color-section').on('click', '.lock-btn', toggleLock);
  
colorsArray();
appendColors();

function randomColor() {
  let hexColor = '';
  while(hexColor.length < 6) {
    hexColor += (Math.random()).toString(16).substr(-6).substr(-1)
  }
  return `#${hexColor}`
}

function colorsArray() {
  for(let index = 0; index < 5; index++) {
    let color = randomColor();

    if(!lockedColors.includes(currentColors[index])) {
      currentColors.splice(index, 1, color);
    } 
  }
  appendColors();
}

function appendColors() {
  $('.color-section').empty();

  currentColors.forEach(color => {
    let lockedClass = "";

    if(lockedColors.includes(color)) {
      lockedClass = "lock"
    }

    $('.color-section').append(`
      <article class="colors" style="background-color:${color}">
        <div>
          <button class="lock-btn ${lockedClass}"></button>
          <p>${color}</p>
        </div>
      </article>
    `);
  });
}

function toggleLock() {
  $(this).toggleClass('lock');
  let color = $(this).next().text();

  if (lockedColors.includes(color)) {
    lockedColors.splice(lockedColors.indexOf(color), 1);
  } else {
    lockedColors.push(color);
  }
  // return lockedColors.includes(color) ? lockedColors.splice(lockedColors.indexOf(color), 1) : lockedColors.push(color)
}





