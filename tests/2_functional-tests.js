const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);



suite('Functional Tests', () => {

    // Solve a puzzle with valid puzzle string: POST request to /api/solve

     test('Solve a puzzle with valid puzzle string', function(done){
     chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({
        puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.propertyVal(res.body, 'solution', '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
        done();
      });
  });

    // Solve a puzzle with missing puzzle string: POST request to /api/solve

    test('Solve a puzzle with missing puzzle string', function(done){
     chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({
        //puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.propertyVal(res.body, 'error', 'Required field missing');
        done();
      });
  });

    // Solve a puzzle with invalid characters: POST request to /api/solve

    test('Solve a puzzle with invalid characters', function(done){
     chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({
        puzzle: '1-5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle');
        done();
      });
  });

    // Solve a puzzle with incorrect length: POST request to /api/solve

     test('Solve a puzzle with incorrect length', function(done){
     chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({
        puzzle: '1.15..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long');
        done();
      });
  });
    
    // Solve a puzzle that cannot be solved: POST request to /api/solve

    test('Solve a puzzle that cannot be solved', function(done){
     chai.request(server)
      .post('/api/solve')
      .type('form')
      .send({
        puzzle: '1.1..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.propertyVal(res.body, 'error', 'Puzzle cannot be solved');
        done();
      });
  });

    // Check a puzzle placement with all fields: POST request to /api/check

    test('Check a puzzle placement with all fields', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '7'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        assert.propertyVal(res.body, 'valid', true);
        done();
      });
  });
    // Check a puzzle placement with single placement conflict: POST request to /api/check

    test('Check a puzzle placement with single placement conflict', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'D2',
        value: '4'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //console.log(res.body)
        assert.property(res.body, 'valid');
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ['column']);
        done();
      });
  });

    // Check a puzzle placement with multiple placement conflicts: POST request to /api/check

  test('Check a puzzle placement with multiple placement conflicts', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '1'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //assert.equal(res.text, '{"vaild":false,"conflict":["row","column"]}')
        assert.propertyVal(res.body, 'valid', false);
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ['row', 'column']);
        done();
      });
  });

    // Check a puzzle placement with all placement conflicts: POST request to /api/check

    test('Check a puzzle placement with all placement conflicts', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '5'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //assert.equal(res.text, '{"vaild":false,"conflict":["row","column","region"]}')
        assert.propertyVal(res.body, 'valid', false)
        assert.property(res.body, 'conflict');
        assert.isArray(res.body.conflict);
        assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
        done();
      });
  });

    // Check a puzzle placement with missing required fields: POST request to /api/check

    test('Check a puzzle placement with missing required fields', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        //coordinate: 'A1',
        value: '1'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //assert.equal(res.text, '{"vaild":false,"conflict":["row","column"]}')
         assert.propertyVal(res.body, 'error', 'Required field(s) missing')
        done();
      });
  });

    // Check a puzzle placement with invalid characters: POST request to /api/check
    test('Check a puzzle placement with invalid characters', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '-.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '1'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //assert.equal(res.text, '{"vaild":false,"conflict":["row","column"]}')
         assert.propertyVal(res.body, 'error', 'Invalid characters in puzzle')
        // assert.deepEqual(res.body, 'conflict', ['row', 'column']);
        done();
      });
  });
    // Check a puzzle placement with incorrect length: POST request to /api/check

    test('Check a puzzle placement with incorrect length', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '...9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A1',
        value: '1'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //assert.equal(res.text, '{"vaild":false,"conflict":["row","column"]}')
         assert.propertyVal(res.body, 'error', 'Expected puzzle to be 81 characters long')
        // assert.deepEqual(res.body, 'conflict', ['row', 'column']);
        done();
      });
  });

    // Check a puzzle placement with invalid placement coordinate: POST request to /api/check

    test('Check a puzzle placement with incorrect length', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A99',
        value: '1'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
        //assert.equal(res.text, '{"vaild":false,"conflict":["row","column"]}')
         assert.propertyVal(res.body, 'error', 'Invalid coordinate')
        // assert.deepEqual(res.body, 'conflict', ['row', 'column']);
        done();
      });
  });


    // Check a puzzle placement with invalid placement value: POST request to /api/check
    test('Check a puzzle placement with invalid placement value', function(done){
     chai.request(server)
      .post('/api/check')
      .type('form')
      .send({
        puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        coordinate: 'A9',
        value: '0'
      })
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isObject(res.body, 'response should be an object');
         assert.propertyVal(res.body, 'error', 'Invalid value')
        // assert.deepEqual(res.body, 'conflict', ['row', 'column']);
        done();
      });
  });

});

