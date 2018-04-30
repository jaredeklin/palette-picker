let currentColors = [];

function randomColors() {
  let hexColor = '';
  while(hexColor.length < 6) {
    hexColor += (Math.random()).toString(16).substr(-6).substr(-1)
  }
  return `#${hexColor}`
}

function appendColors() {
  $('.color-section').empty();

  for(let i = 0; i < 5; i++) {
    let color = randomColors();
    currentColors.push(color)
    $('.color-section').append(`
      <article class="colors" style="background-color:${color}">color${i}</article>
    `);
  }
}


$('.new-palette-btn').on('click', appendColors);

appendColors();
