let tiles =document.querySelectorAll('.tiles div');
let restart = document.querySelector('.restart');
let gameover = document.querySelector('.gameover');
let tryAgain = document.querySelector('.tryAgain');
let theGrids = document.querySelector('.grids');
let bonus = document.querySelector('.bonus');
let resetScore = document.querySelector('.undo');
let filledTiles = [];
let emptyTiles = [];
let starters = [];
let myScore = 0;
let globalScore = parseInt(document.querySelector('.yourScore').innerHTML);
let yourBestScore = document.querySelector('.yourBestScore');

window.onload = gameStart()

// window.onreload = function () {
//     if(window.confirm('Are you sure you want to restart?') === true) {
//         gameStart();
//     }
// }

if (window.localStorage.bestScore) {
    document.querySelector('.yourBestScore').innerHTML = `${window.localStorage.bestScore}`;
}

// Function to animate the bonus
function bonusAnimation (element) {
    element.animate(
        [
            {bottom: '-15px'},
            {bottom: '-10px'},
            {bottom: '-5px'},
            {bottom: '0px'},
            {bottom: '5px'},
            {bottom: '10px'},
            {bottom: '15px', opacity: 0.7},
            {bottom: '20px', opacity: 0.6},
            {bottom: '25px', opacity: 0.5},
            {bottom: '30px', opacity: 0.4},
            {bottom: '35px', opacity: 0.3},
            {bottom: '40px', opacity: 0.2},
        ],
        {
            duration: 700,
            easing: 'ease-in'
        }
    ).onfinish = function() {
        element.style.visibility = 'hidden'; // Hide the element
        // element.style.display = 'none'; // Hide and remove the element from layout
    };
}

// Function to animate the tiles the moment they appear on the board OR when two tiles are mushed together
function tilePopupAnimation (element) {
    element.animate(
        [
            { scale: 0},
            { scale: 0.2},
            { scale: 0.4},
            { scale: 0.6},
            { scale: 0.8},
            { scale: 1},
            { scale: 1.2},
            { scale: 1}
        ],
        {
            duration: 250,
            easing: 'ease-in-out'
        }
    );
}

// When the game starts, this function is responsible for the appearance of the starting tiles
function gameStart () {
    let random1 = Math.floor(Math.random() * 16);
    do {
        var random2 = Math.floor(Math.random() * 16);
    } while (random2 === random1);
    let randomNum = Math.ceil(Math.random()*2)*2;
    tiles[random1].innerHTML = "2"
    tiles[random1].style.zIndex = '1';
    tilePopupAnimation(tiles[random1]);
    tiles[random2].innerHTML = `${randomNum}`
    tiles[random2].style.zIndex = '1';
    tilePopupAnimation(tiles[random2]);
    globalScore = 0;
    document.querySelector('.yourScore').innerHTML = '0';
    tileFormat();
}

// EventListener to restart the game when clicking on restart button
restart.addEventListener('click', function () {
    Array.from(tiles).filter(element => {
        element.innerHTML = '';
        element.removeAttribute('style');
        gameover.style = 'z-index: -2; display: none';
        theGrids.style = 'opacity: 1';
        resetScore.removeAttribute('style')
    })
    gameStart ();
})

// EventListener to start a new game after gameover
tryAgain.addEventListener('click', function () {
    Array.from(tiles).filter(element => {
        element.innerHTML = '';
        element.removeAttribute('style');
        gameover.style = 'z-index: -2; display: none';
        theGrids.style = 'opacity: 1';
        resetScore.removeAttribute('style')
    })
    gameStart ();
})

// Reset the best score
resetScore.addEventListener('click', function () {
    if(window.localStorage) {
        window.localStorage.clear();
        yourBestScore.innerHTML = '0'
    }
})

// Display the grid in a matrix
function matrix () {
    let theGrid = [];

    // Initialize the grid as an empty 4x4 matrix
    for (let i = 0; i < 4; i++) {
        theGrid.push([0, 0, 0, 0]);
    }
    
    let k = 0;
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            theGrid[i][j] = tiles[k].textContent;
            k++;
        }
    }

    return theGrid;
}

// Function to handle sliding and colliding
function verticalSlide(arr) {
    const currentScore = [0, 0, 0, 0]
    const nonEmpty = arr.filter(item => item !== '');
    // Combine adjacent elements with equal values
    for (let i = 0; i < nonEmpty.length - 1; i++) {
        if (parseInt(nonEmpty[i]) === parseInt(nonEmpty[i + 1])) {
            nonEmpty[i] = (parseInt(nonEmpty[i]) + parseInt(nonEmpty[i + 1])).toString();
            currentScore[i] = parseInt(nonEmpty[i])
            nonEmpty[i + 1] = '';
        }
    }

    for (let i = 0; i < 4; i++) {
        myScore += currentScore[i]
    }
    // Filter out empty elements from nonEmpty array
    const result = nonEmpty.filter(item => item !== '');

    // Calculate the number of empty elements
    const emptyCount = arr.length - result.length;

    // Add empty elements at the end
    for (let i = 0; i < emptyCount; i++) {
        result.push('');
    }
    return result;
}

// check if all tiles are filled and there are no adjacent tiles with the same value
function isGameOver(tiles, board) {
    let hasEmptyTile = false;
    let hasVerticalMatch = false;
    let hasHorizontalMatch = false;

    // Split the board into vertical and horizontal vectors to check for adjacent match
    let y1 = [board[0][0], board[1][0], board[2][0], board[3][0]];
    let y2 = [board[0][1], board[1][1], board[2][1], board[3][1]];
    let y3 = [board[0][2], board[1][2], board[2][2], board[3][2]];
    let y4 = [board[0][3], board[1][3], board[2][3], board[3][3]];

    let x1 = [board[0][0], board[0][1], board[0][2], board[0][3]];
    let x2 = [board[1][0], board[1][1], board[1][2], board[1][3]];
    let x3 = [board[2][0], board[2][1], board[2][2], board[2][3]];
    let x4 = [board[3][0], board[3][1], board[3][2], board[3][3]];


    for (let tile of tiles) {
        if (tile.innerHTML === '') {
            hasEmptyTile = true;
            break; // Exit the loop as soon as an empty tile is found
        }
    }
    function hasMatch (v1, v2, v3, v4) {
        let matchFound = false;
        let array = [v1, v2, v3, v4];
        outerLoop: for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                if (array[i][j] === array[i][j + 1]) {
                    matchFound = true;
                    break outerLoop;  // This breaks the outer loop
                }
            }
        }
        return matchFound
    }
    if(!hasEmptyTile) {
        hasVerticalMatch = hasMatch(y1, y2, y3, y4);
        if(hasVerticalMatch === false) {
            hasHorizontalMatch = hasMatch(x1, x2, x3, x4);
        }
    }
    // If there's an empty tile or the score is not zero, the game is not over
    return !(hasEmptyTile || (hasVerticalMatch || hasHorizontalMatch));
}


// Tiles movement
document.onkeydown = checkKey;

function checkKey(e) {

    e = e;

    if (e.keyCode >= 37 && e.keyCode <= 40) {
        // Create a virtual board in a form of a matrix to manipulate the tiles
        let myGrid = matrix();

        if (e.keyCode == '38') {
            // // up arrow
    
            let y1 = [myGrid[0][0], myGrid[1][0], myGrid[2][0], myGrid[3][0]];
            let y2 = [myGrid[0][1], myGrid[1][1], myGrid[2][1], myGrid[3][1]];
            let y3 = [myGrid[0][2], myGrid[1][2], myGrid[2][2], myGrid[3][2]];
            let y4 = [myGrid[0][3], myGrid[1][3], myGrid[2][3], myGrid[3][3]];
    
            let Y1 = verticalSlide(y1);
            let Y2 = verticalSlide(y2);
            let Y3 = verticalSlide(y3);
            let Y4 = verticalSlide(y4);

            myGrid = [
                [Y1[0], Y2[0], Y3[0], Y4[0]],
                [Y1[1], Y2[1], Y3[1], Y4[1]],
                [Y1[2], Y2[2], Y3[2], Y4[2]],
                [Y1[3], Y2[3], Y3[3], Y4[3]]
            ]
        }
        else if (e.keyCode == '40') {
            // down arrow
            let y1 = [myGrid[0][0], myGrid[1][0], myGrid[2][0], myGrid[3][0]].reverse();
            let y2 = [myGrid[0][1], myGrid[1][1], myGrid[2][1], myGrid[3][1]].reverse();
            let y3 = [myGrid[0][2], myGrid[1][2], myGrid[2][2], myGrid[3][2]].reverse();
            let y4 = [myGrid[0][3], myGrid[1][3], myGrid[2][3], myGrid[3][3]].reverse();
    
            let Y1 = verticalSlide(y1);
            let Y2 = verticalSlide(y2);
            let Y3 = verticalSlide(y3);
            let Y4 = verticalSlide(y4);

            myGrid = [
                [Y1[3], Y2[3], Y3[3], Y4[3]],
                [Y1[2], Y2[2], Y3[2], Y4[2]],
                [Y1[1], Y2[1], Y3[1], Y4[1]],
                [Y1[0], Y2[0], Y3[0], Y4[0]]
            ]
    
        }else if (e.keyCode == '39') {
           // Right arrow
    
            let y1 = [myGrid[0][0], myGrid[0][1], myGrid[0][2], myGrid[0][3]].reverse();
            let y2 = [myGrid[1][0], myGrid[1][1], myGrid[1][2], myGrid[1][3]].reverse();
            let y3 = [myGrid[2][0], myGrid[2][1], myGrid[2][2], myGrid[2][3]].reverse();
            let y4 = [myGrid[3][0], myGrid[3][1], myGrid[3][2], myGrid[3][3]].reverse();
    
            let Y1 = verticalSlide(y1);
            let Y2 = verticalSlide(y2);
            let Y3 = verticalSlide(y3);
            let Y4 = verticalSlide(y4);

            myGrid = [
                [Y1[3], Y1[2], Y1[1], Y1[0]],
                [Y2[3], Y2[2], Y2[1], Y2[0]],
                [Y3[3], Y3[2], Y3[1], Y3[0]],
                [Y4[3], Y4[2], Y4[1], Y4[0]]
            ]
        }
        else if (e.keyCode == '37') {
            // Left arrow
            let y1 = [myGrid[0][0], myGrid[0][1], myGrid[0][2], myGrid[0][3]];
            let y2 = [myGrid[1][0], myGrid[1][1], myGrid[1][2], myGrid[1][3]];
            let y3 = [myGrid[2][0], myGrid[2][1], myGrid[2][2], myGrid[2][3]];
            let y4 = [myGrid[3][0], myGrid[3][1], myGrid[3][2], myGrid[3][3]];
    
            let Y1 = verticalSlide(y1);
            let Y2 = verticalSlide(y2);
            let Y3 = verticalSlide(y3);
            let Y4 = verticalSlide(y4);

            myGrid = [
                [Y1[0], Y1[1], Y1[2], Y1[3]],
                [Y2[0], Y2[1], Y2[2], Y2[3]],
                [Y3[0], Y3[1], Y3[2], Y3[3]],
                [Y4[0], Y4[1], Y4[2], Y4[3]]
            ]
        }
        tiles.forEach(element => {
            // element.textContent = '';
            element.style.backgroundColor = 'transparent'
        })
    
        for (let i = 0; i < myGrid.length; i++) {
            for (let j = 0; j < myGrid[i].length; j++) {
                // Assuming you want to skip tiles with a value of 0
                if (myGrid[i][j] !== 0) {
                    tiles[i * 4 + j].textContent = myGrid[i][j].toString();
                }
            }
        }
        tileFormat()
    
    
        globalScore += myScore;
        if(myScore !== 0) {
            bonus.innerHTML = `+${myScore}`;
            bonus.style.visibility = 'visible';
            bonusAnimation(bonus);
    
        }
        document.querySelector('.yourScore').innerHTML = `${globalScore}`;
        myScore = 0;
    
        // Extract all the filled tiles in order to avoid adding new tiles on top of them
        for (let i = 0; i < tiles.length; i++) {
            if(tiles[i].textContent !== '') {
                filledTiles.push(i)
            } else {continue}
        }
    
        // Add a new tile randomly in an empty space on the board
        if(filledTiles.length < 16) {
            do {
                newRandom = Math.floor(Math.random() * 16);
            } while(filledTiles.includes(newRandom))
            if(!filledTiles.includes(newRandom)) {
                var randomNum = Math.ceil(Math.random()*2)*2;
                filledTiles.push(newRandom);
                tiles[newRandom].innerHTML = `${randomNum}`
                tiles[newRandom].style.zIndex = '1';
                tileFormat();
                tilePopupAnimation(tiles[newRandom]);
            }
        }
        filledTiles = [];
    
        myGrid = matrix();
        if (isGameOver(tiles, myGrid)) {
            gameover.style = 'display: flex; z-index : 2';
            theGrids.style = 'Opacity: 0.4';
            resetScore.style.opacity = '1';
            resetScore.style.pointerEvents = 'all'
        }
    
        if (window.localStorage.bestScore) {
            if(parseInt(window.localStorage.bestScore) < parseInt(document.querySelector('.yourScore').innerHTML)) {
                window.localStorage.bestScore = parseInt(document.querySelector('.yourScore').innerHTML);
                document.querySelector('.yourBestScore').innerHTML = `${parseInt(document.querySelector('.yourScore').innerHTML)}`;
            } else {document.querySelector('.yourBestScore').innerHTML = `${window.localStorage.bestScore}`}
        } else {
            window.localStorage.bestScore = parseInt(document.querySelector('.yourScore').innerHTML);
        }
    }

}

// Assign the corresponding colors for each tile according to the number inside it
function tileFormat () {
    tiles.forEach(element => {
        if (element.innerHTML === "2") {
            element.style.backgroundColor = '#EEE4DA';
            element.style.color = '#776E65';
            element.style.zIndex = '1';
        } else if (element.innerHTML === "4") {
            element.style.backgroundColor = '#EEE1C9';
            element.style.color = '#776E65';
            element.style.zIndex = '1';
        } else if (element.innerHTML === "8") {
            element.style.backgroundColor = '#F3B27A';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "16") {
            element.style.backgroundColor = '#F69664';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "32") {
            element.style.backgroundColor = '#F77D5F';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "64") {
            element.style.backgroundColor = '#F7603B';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "128") {
            element.style.backgroundColor = '#EDD073';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "256") {
            element.style.backgroundColor = '#EDD073';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "512") {
            element.style.backgroundColor = '#EDC950';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "1024") {
            element.style.backgroundColor = '#EDC53F';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "2048") {
            element.style.backgroundColor = '#EDC22E';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }else if (element.innerHTML === "4096") {
            element.style.backgroundColor = '#3C3A33';
            element.style.color = 'white';
            element.style.zIndex = '1';
        }
    });
}

