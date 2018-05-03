let currentColors = [];
const lockedColors = [];
let projects = [];
let palettes = [];
let currentProject;

$('.new-palette-btn').on('click', colorsArray);
$('.color-section').on('click', '.lock-btn', toggleLock);
$('.save-project-btn').on('click', saveProject);
$('.save-palette-btn').on('click', savePalette);
$('#drop-down-menu').on('change', changeProject);
$('.display-projects').on('click', '.delete', deletePalette);
$('.display-projects').on('click', '.project-colors', displayColors);
  
colorsArray();
getProjects();

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
    name: $('.project-name-input').val()
  }

  const response = await fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: { 'Content-Type': 'application/json' }
  });

  const projectData = await response.json();

  projects = [...projects, projectData];
  populateDropdown();
  displayProjects();
  $('.project-name-input').val('');
}

async function getProjects() {
  const response = await fetch('/api/v1/projects');
  const projectData = await response.json();

  projects = [...projectData];

  await getPalettes();
  populateDropdown();
  displayProjects();
}

async function getPalettes() {
  const response = await fetch('/api/v1/palettes');
  const paletteData = await response.json();
  const palette = cleanPalette(paletteData);

  palettes = [...palette];
}

function cleanPalette(paletteData) {
  return paletteData.map(palette => ({
    name: palette.name,
    id: palette.id,
    project_id: palette.project_id,
    colors: [palette.color1, palette.color2, palette.color3, palette.color4, palette.color5]
  }));
}


async function savePalette(event) {
  event.preventDefault();
  if(currentProject) {
    const palette = {
      name: $('.palette-name-input').val(),
      color1: currentColors[0],
      color2: currentColors[1],
      color3: currentColors[2],
      color4: currentColors[3],
      color5: currentColors[4],
      project_id: currentProject.id
    }

    const response = await fetch('/api/v1/palettes', {
      method: 'POST',
      body: JSON.stringify(palette),
      headers: { 'Content-Type': 'application/json' }
    });

    const paletteData = await response.json();
    const newPalette = cleanPalette([paletteData])

    palettes = [...palettes, ...newPalette];
    console.log(palettes)
    $('.palette-name-input').val('');
    displayProjects();
  } else {
    alert('Please select a project');
  }
}


function changeProject() {
  currentProject = projects.find(project => project.name === $(this).val())
  console.log(currentProject)
}

function populateDropdown() {
  $('.select-project').nextAll().remove()

  projects.forEach(project => {
    $('#drop-down-menu').append(`
      <option>${ project.name }</option>
    `);
  });
}

function displayProjects() {
  $('.display-projects').empty();

  projects.forEach(project => {
    $('.display-projects').append(`
      <article class="project-list">
        <h2>Project: ${ project.name }</h2>
        ${ displayPalette(project.id) }
      </article>
    `);
  });
}

function displayPalette(id) {
  const match = palettes.filter(project => project.project_id === id);
  const projectPalettes = match.map(palette => 
    `<div class="project-colors" data-id=${ palette.id }>
      ${ displayProjectColors(palette.colors) }
      ${ palette.name }
      <button class="delete"></button>
    </div>`);
  
  return projectPalettes.join('');
}

function displayProjectColors(colors) {
  const displayPalette = colors.map(color => `<div class='palette-colors' style="background-color:${ color }"></div>`);
  
  return displayPalette.join('');
}

async function deletePalette() {
  const id = { id: $(this).parent().data('id') };
  const response = await fetch('/api/v1/palettes', {
    method: 'DELETE',
    body: JSON.stringify(id),
    headers: { 'Content-Type': 'application/json' }
  });

  const deleteData = await response.json();

  palettes = palettes.filter(palette => palette.id !== id.id)
  $(this).parent().remove();
}

function displayColors(event) {
  const id = parseInt(event.currentTarget.dataset.id);
  const match = palettes.find(palette => palette.id === id);
  
  currentColors.length = 0;
  currentColors = [...match.colors];
  appendColors()
}

