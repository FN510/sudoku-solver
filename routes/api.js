'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let puzzle = req.body.puzzle
      let coordinate = req.body.coordinate;
      let value = req.body.value;
      let coordinateRegex = new RegExp(/^[A-I][1-9]$/)
      let valueRegex = new RegExp(/^[1-9]$/)
      if (!coordinate && !value) {
        res.send({ error: 'Required field(s) missing' })
      } else if (!coordinateRegex.test(coordinate)) {
        res.send({ error: 'Invalid coordinate'});
      } else if (!valueRegex.test(value)) {
        res.send({ error: 'Invalid value' })
      }
      let validation = solver.validate(puzzle)
      if (validation && validation.error) {
        res.send(validation);
      } else {
        console.log(value)
        let rowCheck = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value)
        let colCheck = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value)
        let regionCheck = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value)
        let conflict = [];
        let valid = true;
        if (rowCheck===false) {
          valid = false;
          conflict.push('row')
        }
        if (colCheck===false) {
          valid = false;
          conflict.push('column')
        }
        if (regionCheck===false) {
          valid = false;
          conflict.push('region');
        }
        if (valid) {
          res.send({valid: valid})
        } else {
          res.send({vaild: valid, conflict: conflict});
        }
      }
      

    });
    
  app.route('/api/solve')
    .post((req, res) => {
       let validation = solver.validate(req.body.puzzle)
        if (validation && validation.error) {
          res.send(validation);
        }
        console.log(solver.solve(req.body.puzzle));
        res.send(solver.solve(req.body.puzzle));
 
    });
};
