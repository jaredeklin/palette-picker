
exports.seed = function(knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all palettes first
    .then(() => knex('projects').del()) // delete all projects

    // Now that we have a clean slate, we can re-insert our project data
    .then(() => {
      return Promise.all([
        
        // Insert a single project, return the project ID, insert 3 palettes
        knex('projects').insert(
        { name: 'DAMN!!!!' }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { name: 'Yes',
              color1: '#A616E1',
              color2: '#7FBF5C',
              color3: '#11599C',
              color4: '#441E7E',
              color5: '#AA61AE',
              project_id: project[0]
            },
            { name:' Nope',
              color1: '#D916D6',
              color2: '#649231',
              color3: '#9A4C9E',
              color4: '#1C5FBF',
              color5: '#AA61AE',
              project_id: project[0]
            }, 
            { name: 'Boom boom!',
              color1: '#E6B42D',
              color2: '#7DE188',
              color3: '#E8DDDD',
              color4: '#DA2F1D',
              color5: '#46514A',
              project_id: project[0]
            }                       
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
