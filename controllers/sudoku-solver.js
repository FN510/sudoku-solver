class SudokuSolver {

  validate(puzzleString) {
    let regex = new RegExp(/^[1-9\.]{81}$/)
    if (!puzzleString) {
      return {error: 'Required field missing'}
    } else if (puzzleString.length!=81) {
      return { error: 'Expected puzzle to be 81 characters long' }
    } else if (!regex.test(puzzleString)) {
      return { error: 'Invalid characters in puzzle'}
    } else { // check for invalid initial placement
      let arr = this.createArray(puzzleString);
      for (let i=0; i<arr.length; i++) {
        for (let j=0; j<arr.length; j++) {
          if (arr[i][j]!='.') {
            let row = this.indexToCoordinate(i,j)[0]
            let col = this.indexToCoordinate(i,j)[1]
            let rowCheck = this.checkRowPlacement(puzzleString, row, col, arr[i][j]);
            let colCheck = this.checkColPlacement(puzzleString, row, col, arr[i][j]);
            let regionCheck = this.checkRegionPlacement(puzzleString, row, col, arr[i][j]);
            if (!(rowCheck && colCheck && regionCheck)) {
              return { error: 'Puzzle cannot be solved' };
            }
          }
          
        }
      }
      

    }
    return true;
    
  }

  checkRowPlacement(puzzleString, row, column, value) {
   let arr = this.createArray(puzzleString);
    let index = this.coordinateToIndex(row, column);

    for (let c = 0; c<9; c++) {
      if (c!=index[1]) {
        if (arr[index[0]][c] == value) {
          let coord = this.indexToCoordinate(index[0], c);
          return false;
        }
      }
    }
    return true;


  }

  checkColPlacement(puzzleString, row, column, value) {
    let arr = this.createArray(puzzleString);
    let index = this.coordinateToIndex(row, column);
    //console.log(index)
    for (let r = 0; r<9; r++) {
      if (r!=index[0]) {
        if (arr[r][index[1]] == value) {
          let coord = this.indexToCoordinate(r, index[1]);
          return false;
        }
      }
      
    }
    return true;

  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let arr = this.createArray(puzzleString);
     let regions = {
      one: ['A1', 'A2', 'A3', 'B1','B2', 'B3', 'C1', 'C2', 'C3'],
      two:['A4', 'A5', 'A6', 'B4','B5', 'B6', 'C4', 'C5', 'C6'],
      three:['A7', 'A8', 'A9', 'B7','B8', 'B9', 'C7', 'C8', 'C9'], 
      four:['D1', 'D2', 'D3', 'E1','E2', 'E3', 'F1', 'F2', 'F3'], 
      five: ['D4', 'D5', 'D6', 'E4','E5', 'E6', 'F4', 'F5', 'F6'], 
      six:['D7', 'D8', 'D9', 'E7','E8', 'E9', 'F7', 'F8', 'F9'],
      seven:['G1', 'G2', 'G3', 'H1','H2', 'H3', 'I1', 'I2', 'I3'], 
      eight:['G4', 'G5', 'G6', 'H4','H5', 'H6', 'I4', 'I5', 'I6'], 
      nine:['G7', 'G8', 'G9', 'H7','H8', 'H9', 'I7', 'I8', 'I9']
    }
    let region;
    let position = row +column;
    //console.log('pos is '+position)
    
    // find region
    for (let key in regions) {
      if (regions[key].indexOf(position)>=0) {
        region = regions[key]
      } 
    }
    //console.log(region);
    let noConflict = true;
   region.forEach((p) => {
     if (p != position) {
       let index = this.coordinateToIndex(p[0], p[1]);
       if (arr[index[0]][index[1]]==value) {
        noConflict = false;
       }
     }
   })
   return noConflict;
   
    // check region
    
  }

  coordinateToIndex(row, col) {
    let i = 0;
    let j = 0;
    switch(row) {
      case 'A':
        i=0;
        break;
      case 'B':
        i=1;
        break;
      case 'C':
        i=2;
        break;
      case 'D':
        i=3;
        break;

      case 'E':
        i=4;
        break;
      case 'F':
        i=5;
        break;
      case 'G':
        i=6;
        break;
      case 'H':
        i=7;
        break;
      case 'I':
        i=8;
        break;
      
    }
    j = col-1;
    return [i,j];
  }

  indexToCoordinate(row, col) {
    let i = 0;
    let j = 0;
    switch(row) {
      case 0:
        i='A';
        break;
      case 1:
        i='B';
        break;
      case 2:
        i= 'C';
        break;
      case 3:
        i='D';
        break;

      case 4:
        i='E';
        break;
      case 5:
        i='F';
        break;
      case 6:
        i='G';
        break;
      case 7:
        i='H';
        break;
      case 8:
        i='I';
        break;
      
    }
    j = col+1;
    return [i,j];
  }

  createArray(puzzleString) {
    let arr = [];
    let rowIndex = 0;

    for (let i = 0; i<9; i++) {
      let row = [];
      for (let j=rowIndex; j<rowIndex+9; j++) {
        row.push(puzzleString[j])
      }
      arr.push(row)
      rowIndex+=9;
    }
    //console.log(arr);
    return arr;

  }

  // depth first brute force
  solve(puzzleString) {
    let arr = this.createArray(puzzleString);
    // check for invalid puzzle
    let backtrack = false;
    let num = 1;
    // fill in row by row
    for (let i=0; i<arr.length; i++) {
      if (arr[i].indexOf('.')>=0) {
        for (let j=0; j<arr.length; j++) {
          console.log(i,j)
          if (arr[i][j]=='.' || backtrack) {
            while (backtrack) {
              if (j==0) {
                i--;
                j=8
              } else {
                j--;
              }
              console.log('back', i, j, arr[i][j])
              if (parseInt(arr[i][j])<9) {
                num = parseInt(arr[i][j])+1;
                console.log('back num', num);
                break;
              } else {
                arr[i][j]='.'
                console.log('remove', i, j)
                puzzleString = this.arrayToPuzzleString(arr);
              }
            }

            if (arr[i][j]=='.' ) {
              let oneToNine = [1,2,3,4,5,6,7,8,9].map(e=>e.toString())
              num = parseInt(oneToNine.filter(e=>arr[i].indexOf(e)<0)[0])
            }
          
         
            let coord = this.indexToCoordinate(i,j)
            console.log(coord);
            
            let numString = num.toString();
            //console.log(numString, typeof numString);
            //console.log(arr[i])
            while (arr[i].indexOf(numString)>=0 && num<9) {
              console.log('num is', num)
              num++;
              numString = num.toString()
            }
            //console.log(num)
            let rowCheck = this.checkRowPlacement(puzzleString, coord[0], coord[1], numString);
            console.log(coord[0], coord[1], numString);
            //console.log(rowCheck);
            let colCheck = this.checkColPlacement(puzzleString, coord[0], coord[1], numString);
            //console.log(colCheck);
            let regionCheck = this.checkRegionPlacement(puzzleString, coord[0], coord[1], numString);
            console.log(rowCheck, colCheck, regionCheck)
            while ((rowCheck==false || colCheck==false || regionCheck==false) && num<9) {
              console.log('inc num', num+1)
              num++;
              numString = num.toString();
              rowCheck = this.checkRowPlacement(puzzleString, coord[0], coord[1], numString);
              colCheck = this.checkColPlacement(puzzleString, coord[0], coord[1], numString);
              regionCheck = this.checkRegionPlacement(puzzleString, coord[0], coord[1], numString);
            }
            console.log(rowCheck, colCheck, regionCheck)
            if (rowCheck && colCheck && regionCheck) {
              arr[i][j]=numString;
              console.log('added', numString)
              
              puzzleString = this.arrayToPuzzleString(arr);
              console.log(puzzleString)
              backtrack = false
            } else { // backtrack
              console.log('error solving')
              console.log(puzzleString)
              if (arr[i][j]!='.') {
                console.log('removing', i,j, arr[i][j])
                arr[i][j]='.'
                puzzleString = this.arrayToPuzzleString(arr);
              }
              
              backtrack = true;
              if (j==0) {
                i--;
                j=8;
                if (i==0) {
                  return { error: 'Puzzle cannot be solved' }
                }
              } else {
                j--;
              }
            }
            // if (rowCheck && colCheck && regionCheck) {
            //   arr[i][j] = numString;
            // } else {
            //   num++;
            //   numString = num.toString();
            //   while (arr[i].indexOf(numString)>=0) {
            //     num++;
            //   }

            // }
          }
        }
      }
      
    }

    if (puzzleString.indexOf('.')>=0) {
      return { error: 'Puzzle cannot be solved' }
    } else {
      return {solution: this.arrayToPuzzleString(arr)};
    } 

    // convert array to string
    
    
  }


  solve2(puzzleString) {
    let arr = this.createArray(puzzleString);
    const oneToNine = [1,2,3,4,5,6,7,8,9].map(e=>e.toString());

    while (puzzleString.indexOf('.')>=0) {
      for (let i=0; i<arr.length; i++) {
        for (let j=0; j<arr.length; j++) {
          let possibleNums = [];
          let coord = this.indexToCoordinate(i,j)
          if (arr[i][j]=='.') {
            oneToNine.forEach((e)=> {
              let rowCheck = this.checkRowPlacement(puzzleString, coord[0], coord[1], e);
              let colCheck = this.checkColPlacement(puzzleString, coord[0], coord[1], e);
              let regionCheck = this.checkRegionPlacement(puzzleString, coord[0], coord[1], e);

              if (regionCheck && colCheck && rowCheck) {
                possibleNums.push(e);
              }
            });
            if (possibleNums.length==1) {
              arr[i][j]=possibleNums[0];
              puzzleString = this.arrayToPuzzleString(arr);
            }
          }
        }
      }
    }
   
    if (puzzleString.indexOf('.')>=0) {
      return { error: 'Puzzle cannot be solved' }
    } else {
      return {solution: this.arrayToPuzzleString(arr)};
    } 

    // convert array to string
    
    
  }

  arrayToPuzzleString(arr) {
    let solution = '';
    for (let row = 0; row<arr.length; row++) {
      solution += arr[row].join('');

    }
    return solution;
  }
}

module.exports = SudokuSolver;

