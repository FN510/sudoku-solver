const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {

  // Logic handles a valid puzzle string of 81 characters
  test('Logic handles a valid puzzle string of 81 characters', ()=> {
    assert.isTrue(solver.validate('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), true)
    
  })
  // Logic handles a puzzle string with invalid characters (not 1-9 or .)
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', ()=> {
    assert.propertyVal(solver.validate('111111111111111111111111111111111111111111111111111111111111111111111111111111-11'), 'error', 'Invalid characters in puzzle')
  })

  test('Logic handles a puzzle string that is not 81 characters in length', ()=> {
    assert.propertyVal(solver.validate('1111199999999'), 'error', 'Expected puzzle to be 81 characters long')
    
  })
  test('Logic handles a valid row placement', ()=> {
    assert.isTrue(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '7'))
    
  })

  // Logic handles an invalid row placement
  test('Logic handles an invalid row placement', ()=> {
    assert.isFalse(solver.checkRowPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '1'))
    
  })

  test('Logic handles a valid column placement', ()=> {
    assert.isTrue(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '2'))
    
  })

  test('Logic handles an invalid column placement', ()=> {
    assert.isFalse(solver.checkColPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '6'))
    
  })

  test('Logic handles a valid region (3x3 grid) placement', ()=> {
    assert.isTrue(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '1'))
    
  })

  test('Logic handles an invalid region (3x3 grid) placement', ()=> {
    assert.isFalse(solver.checkRegionPlacement('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..', 'A', '1', '2'))
    
  })

  // Valid puzzle strings pass the solver
  test('Valid puzzle strings pass the solver', ()=> {
    assert.notProperty(solver.solve('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'), 'error')
    
  })

  // Invalid puzzle strings fail the solver
  test('Invalid puzzle strings fail the solver', ()=> {
    assert.propertyVal(solver.solve('9.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'), 'error', 'Puzzle cannot be solved')
    
  })


  // Solver returns the expected solution for an incomplete puzzle
  test('Solver returns the expected solution for an incomplete puzzle', ()=> {
    assert.propertyVal(solver.solve('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'), 'solution', '218396745753284196496157832531672984649831257827549613962415378185763429374928561')
    
  })

});