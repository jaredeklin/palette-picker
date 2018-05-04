const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, database } = require('../server')

chai.use(chaiHttp);

describe('client routes', () => {
  it('should return the homepage', () => {
    return chai.request(app)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
      })
      .catch(error => {
        throw error;
      })
  });

  it('should return a 404 for a route that doesnt exist', () => {
    return chai.request(app)
      .get('/sadpath')
      .then(response => {
        response.should.have.status(404);
      })
      .catch(error => {
        throw error;
      })    
  })
})

describe('API routes', () => {

  beforeEach( () => {
    database.migrate.rollback()
    .then( () => {
      database.migrate.latest()
      .then( () => {
        return database.seed.run()
        .then( () => {
          done();
        });
      });
    });
  });

  it('should GET all projects', () => {
    return chai.request(app)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('DAMN!!!!');
        
      })
      .catch(error => {
        throw error;
      })
  });

  // it('should POST a project', (done) => {
  //   return chai.request(app)
  //     .post('/api/v1/projects')
  //     .send({ name: 'Wow' })
  //     .then(response => {
  //       response.should.have.status(201);
  //       response.should.be.json;
  //       response.body.should.be.an('object');
  //       // response.body.length.should.equal(2);
  //       // response.body[1].should.have.property('name');
  //       // response.body[1].name.should.equal('Wow');
  //       done()
  //     })
  //     .catch(error => {
  //       throw error;
  //     })
  // })

  it('should GET all palettes', () => {
    return chai.request(app)
      .get('/api/v1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.an('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Yes');
        response.body[0].should.have.property('color1');
        response.body[0].color1.should.equal('#A616E1');        
        response.body[0].should.have.property('color5');
        response.body[0].color5.should.equal('#AA61AE');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
      })
      .catch(error => {
        throw error;
      })
  });

  // it('should POST a new palette', () => {
  //   return chai.request(app)
  //     .post('/api/v1/palettes')
  //     .send({
  //       name: 'Yikes',
  //       color1: '#A616E2',
  //       color2: '#7FBF5E',
  //       color3: '#11599C',
  //       color4: '#441E7E',
  //       color5: '#AA61AE',
  //       project_id: project[0]
  //     })
  //     .then(response => {
  //       response.should.have.status(201);
  //       response.should.be.json;
  //       response.body.should.be.an('object');
  //       response.body.length.should.equal(4);
  //       response.body[4].should.have.property('name');
  //       response.body[4].name.should.equal('Yes');
  //       response.body[4].should.have.property('color1');
  //       response.body[4].color1.should.equal('#A616E2');        
  //       response.body[4].should.have.property('color5');
  //       response.body[4].color5.should.equal('#AA61AE');
  //       response.body[4].should.have.property('project_id');
  //       response.body[4].project_id.should.equal(1);
  //     })
  // })
});