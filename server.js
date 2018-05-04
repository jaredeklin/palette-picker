// pulling express in
const express = require('express');
// naming your server app using express method
const app = express();
// allows server receive parsed json from response
const bodyParser = require('body-parser');

// setting the environment to the NODE_ENV value or defauling to development
const environment = process.env.NODE_ENV || 'development';
// setting the configuration based on the environment
const configuration = require('./knexfile')[environment];
// setting the database based on the config
const database = require('knex')(configuration);

// setting the server port based on the PORT value or 3000 as a default
app.set('port', process.env.PORT || 3000);

// assign a value to the built in variable app.locals
app.locals.title = 'Palette Picker';

// telling to the server to use bodyParser to json
app.use(bodyParser.json());
// telling the server use the public directory
app.use(express.static('public'));


// telling the server to make GET request to the palettes endpoint
app.get('/api/v1/palettes', (request, response) => {
  // using the select method on the palettes table from the database
  database('palettes').select()
  //returning the response when status is 200 with json'd palettes data
    .then(palettes => response.status(200).json(palettes))
    // returns response status 404 with an error object
    .catch(error => response.status(404).json({error}))
});

// telling the server to make GET request to the projects endpoint
app.get('/api/v1/projects', (request, response) => {
  // using the select method on the projects table from the database
  database('projects').select()
  //returning the response when status is 200 with json'd projects data
    .then(projects => response.status(200).json(projects))
    // returns response status 404 with an error object
    .catch(error => response.status(404).json({error}))
});

// telling the server to make POST request to the palettes endpoint
app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;
  const data = ['id', 'name', 'color1', 'color2', 'color3', 'color4', 'color5', 'project_id'];
  // using the insert method add data to the palettes table
  database('palettes').insert(palette, data)
    // return the response when staus 201 with the inserted json'd palette data
    .then(palette => response.status(201).json(palette[0]))
    // returns response status 500 with an error object
    .catch(error => response.status(500).json({error}))
});

// telling the server to make POST request to the palettes endpoint
app.post('/api/v1/projects', (request, response) => {
  const project = request.body
  // using the insert method add data to the palettes table
  database('projects').insert(project, ['id', 'name'])
  // return the response when status 201 with the inserted json'd project data
    .then(project => response.status(201).json(project[0]))
    // returns response status 500 with an error object
    .catch(error => response.status(500).json({error}))
});

// telling the server to make DELETE request to the palettes endpoint
app.delete('/api/v1/palettes', (request, response) => {
  const id = request.body.id;
  // using the where and delete methods to delete a specific id from the palettes table
  database('palettes').where('id', id).del()
  // returns json'd response object with status 204, which is empty
    .then(palette => response.status(204).json(palette))
    // returns response status 500 with an error object
    .catch(error => response.status(500).json({error}))
})


// tells the server to what port value to run on
app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} running on localhost:${app.get('port')}.`);
});

// exporting the server and the database for testing
module.exports = { app, database };

