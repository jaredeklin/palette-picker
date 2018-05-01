// const locals = require('../../server.js')
const currentColors = [];
const lockedColors = [];
let projects = [];

$('.new-palette-btn').on('click', colorsArray);
$('.color-section').on('click', '.lock-btn', toggleLock);
$('.save-project-btn').on('click', saveProject);
// $('.save-project-btn').on('click', getProjects);

$('.save-palette-btn').on('click', savePalette);
$('#drop-down-menu').on('click', changeProject)
  
colorsArray();

function randomColor() {
  let hexColor = '';
  while(hexColor.length < 6) {
    hexColor += (Math.random()).toString(16).substr(-6).substr(-1).toUpperCase()
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
}

async function saveProject(event) {
  event.preventDefault();
  const newProject = {
    projectName: $('.project-name-input').val()
  }

  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: { 'Content-Type': 'application/json' }
  });

  const projectData = await response.json();

  projects.length = 0;
  projects = [...projectData]
  populateDropdown();
}

async function getProjects(event) {
  event.preventDefault()
  const response = await fetch('/api/v1/projects');
  const projectData = await response.json();
  
  projects.push(projectData);
  populateDropdown();
}


async function savePalette(event) {
  event.preventDefault();

  const palette = {
    name: $('.palette-name-input').val(),
    colors: currentColors
  }

  const response = await fetch('/api/v1/palettes', {
    method: 'POST',
    body: JSON.stringify(palette),
    headers: { 'Content-Type': 'application/json' }
  });

  const data = await response.json();
  console.log(data)
  // return data;
}


function changeProject() {
  console.log('yolo')
}

function populateDropdown() {
  $('#drop-down-menu').empty();

  projects.forEach((project, index) => {
    console.log(project)
    $('#drop-down-menu').append(`
      <option>${project.projectName}</option>
    `)  
  })
}














