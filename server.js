const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.locals.projects = [];
app.locals.palettes = [];
app.locals.title = 'Palette Picker';

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/v1/palettes', (request, response) => {
  database('palettes').select()
    .then(palettes => response.status(200).json(palettes))
    .catch(error => response.status(404).json({error}))
});

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then(projects => response.status(200).json(projects))
    .catch(error => response.status(404).json({error}))
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  console.log(palette)
  // const data = ['id', 'name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id']
  database('palettes').insert(palette, ['id', 'name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id'])
    .then(palette => response.status(201).json(palette[0]))
    .catch(error => response.status(500).json({error}))
  // app.locals.palettes.push(request.body);,
  // response.status(201).json(app.locals.palettes);
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body
  database('projects').insert(project, ['id', 'name'])
    .then(project => response.status(201).json(project[0]))
    .catch(error => response.status(500).json({error}))
});

app.delete('/api/v1/palettes', (request, response) => {
  // console.log(request.body)
  const id = request.body.id;
  app.locals.palettes.forEach((palette, index) => {
    if(palette.id === id) {
      app.locals.palettes.splice(index, 1)
    }
  })
  response.status(200).json(app.locals.palettes);
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on localhost:${app.get('port')}.`);
});

