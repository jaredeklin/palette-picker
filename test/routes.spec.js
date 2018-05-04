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
    return database.migrate.rollback()
    .then( () => {
      return database.migrate.latest()
      .then( () => {
        return database.seed.run()
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

  it('should POST a project', () => {
    return chai.request(app)
      .post('/api/v1/projects')
      .send({ name: 'Wow' })
      .then(response => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2)
        response.body.should.have.property('name');
        response.body.name.should.equal('Wow');
      })
      .catch(error => {
        throw error;
      })
  });

  it('should not create a project with invalid input', () => {
    return chai.request(app)
      .post('/api/v1/projects')
      .send({ nope: 'nope' })
      .then(response => {
        response.should.have.status(500);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('error')
      })
  })

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

  it('should POST a new palette', () => {
    return chai.request(app)
      .post('/api/v1/palettes')
      .send({
        name: 'Yikes',
        color1: '#A616E2',
        color2: '#7FBF5E',
        color3: '#11599C',
        color4: '#441E7E',
        color5: '#AA61AE',
        project_id: 1
      })
      .then(response => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        response.body.should.have.property('name');
        response.body.name.should.equal('Yikes');
        response.body.should.have.property('color1');
        response.body.color1.should.equal('#A616E2');        
        response.body.should.have.property('color5');
        response.body.color5.should.equal('#AA61AE');
        response.body.should.have.property('project_id');
        response.body.project_id.should.equal(1);
      })
  })

  it('should not POST a palette if request is invalid', () => {
    return chai.request(app)
      .post('/api/v1/palettes')
      .send({ names: 'nope'})
      .then(response => {
        response.should.have.status(500);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('error');
      })
  })

  it('should DELETE a palette', () => {
    return chai.request(app)
      .delete('/api/v1/palettes')
      .send({ id: 3 })
      .then(response => {
        response.should.have.status(204);
        response.should.be.an('object');
      })
  })

  it('should return an error if invalid request', () => {
    return chai.request(app)
      .delete('/api/v1/palettes')
      .send({ id: 'nope'})
      .then(response => {
        response.should.have.status(500);
        response.should.be.json;
        response.body.should.be.an('object');
        response.body.should.have.property('error');
      })
  })
});