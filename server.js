const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.set('port', process.env.PORT || 3000);

app.locals.projects = [];
app.locals.palettes = [];
app.locals.title = 'Palette Picker';

app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/api/v1/palettes', (request, response) => {
  
  response.status(200).json(app.locals.palettes);
});

app.get('/api/v1/projects', (request, response) => {
  response.status(200).json(app.locals.projects);
});

app.post('/api/v1/palettes', (request, response) => {

  app.locals.palettes.push(request.body);
  response.status(201).json(app.locals.palettes);
});

app.post('/api/v1/projects', (request, response) => {

  app.locals.projects.push(request.body);
  response.status(200).json(app.locals.projects);
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on localhost:${app.get('port')}.`);
});

