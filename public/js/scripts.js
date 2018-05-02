// const locals = require('../../server.js')
const currentColors = [];
const lockedColors = [];
let projects = [];
let palettes = [];
let currentProject;

$('.new-palette-btn').on('click', colorsArray);
$('.color-section').on('click', '.lock-btn', toggleLock);
$('.save-project-btn').on('click', saveProject);
// $('.save-project-btn').on('click', getProjects);
$('.save-palette-btn').on('click', savePalette);
$('#drop-down-menu').on('change', changeProject);
$('.display-projects').on('click', 'button', deletePalette)
  
colorsArray();

function randomColor() {
  let hexColor = '';
  while(hexColor.length < 6) {
    hexColor += (Math.random()).toString(16).substr(-6).substr(-1).toUpperCase()
  }

  return `#${ hexColor }`
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
      lockedClass = "lock";
    }

    $('.color-section').append(`
      <article class="colors" style="background-color:${ color }">
        <div>
          <button class="lock-btn ${ lockedClass }"></button>
          <p>${ color }</p>
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
    projectName: $('.project-name-input').val(),
    projectId: Date.now()
  }

  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: { 'Content-Type': 'application/json' }
  });

  const projectData = await response.json();

  projects.length = 0;
  projects = [...projectData];
  populateDropdown();
  displayProjects();
  // displayPalette();
  $('.project-name-input').val('');
}

// async function getProjects(event) {
//   event.preventDefault()
//   const response = await fetch('/api/v1/projects');
//   const projectData = await response.json();
  
//   projects.push(projectData);
//   populateDropdown();
// }


async function savePalette(event) {
  event.preventDefault();
  if(currentProject) {
    const palette = {
      name: $('.palette-name-input').val(),
      colors: currentColors,
      projectId: currentProject.projectId,
      id: Date.now()
    }

    console.log(palette)

    const response = await fetch('/api/v1/palettes', {
      method: 'POST',
      body: JSON.stringify(palette),
      headers: { 'Content-Type': 'application/json' }
    });

    const paletteData = await response.json();

    palettes.length = 0;
    palettes = [...paletteData];
    $('.palette-name-input').val('');
    displayProjects();
  } else {
    alert('Please select a project')
  }
}


function changeProject() {
  currentProject = projects.find(project => project.projectName === $(this).val())
  console.log(currentProject)
}

function populateDropdown() {
  $('.select-project').nextAll().remove()

  projects.forEach(project => {
    $('#drop-down-menu').append(`
      <option>${ project.projectName }</option>
    `);
  });
}

function displayProjects() {
  $('.display-projects').empty();

  projects.forEach(project => {
    $('.display-projects').append(`
      <article class="project-list">Project: ${ project.projectName }
      ${ displayPalette(project.projectId) }
      </article>
    `);
  });
}

function displayPalette(id) {
  const match = palettes.filter(project => project.projectId === id);
  const projectPalettes = match.map(palette => `<div class="project-colors" data-id=${palette.id}>${ palette.name } - ${ displayProjectColors(palette.colors) }<button></button></div>`);
  
  return projectPalettes.join('');
}

function displayProjectColors(colors) {
  const displayPalette = colors.map(color => `<div class='palette-colors' style="background-color:${ color }"></div>`);
  
  return displayPalette.join('');
}

async function deletePalette() {
  // console.log($(this).parent().data('id'))
  const id = {id: $(this).parent().data('id')};

  const response = await fetch('/api/v1/palettes', {
    method: 'DELETE',
    body: JSON.stringify(id),
    headers: { 'Content-Type': 'application/json' }
  });

  const deleteData = await response.json();
  palettes.length = 0;
  palettes = [...deleteData];

  $(this).parent().remove();

  console.log(palettes)
}












