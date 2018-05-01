// const locals = require('../../server.js')
const currentColors = [];
const lockedColors = [];
let projects = [];
let currentProject;

$('.new-palette-btn').on('click', colorsArray);
$('.color-section').on('click', '.lock-btn', toggleLock);
$('.save-project-btn').on('click', saveProject);
// $('.save-project-btn').on('click', getProjects);
$('.save-palette-btn').on('click', savePalette);
$('#drop-down-menu').on('change', changeProject)
  
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
      lockedClass = "lock";
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
      projectId: currentProject.projectId
    }

    console.log(palette)

    const response = await fetch('/api/v1/palettes', {
      method: 'POST',
      body: JSON.stringify(palette),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();
    $('.palette-name-input').val('');
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
      <option>${project.projectName}</option>
    `);
  });
}

function displayProjects() {
  $('.display-projects').empty();

  projects.forEach(project => {
    console.log(project)
    $('.display-projects').append(`
      <ul>${project.projectName}
        <li></li>
      </ul>
    `)
  })
}

function displayPalette() {
  
}













