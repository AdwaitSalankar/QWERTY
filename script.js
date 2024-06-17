document.addEventListener('DOMContentLoaded', async () => {
    let currentGuess = '';
    let currentRow = 0;
    let gameEnded = false;
    let validWords = [];
    let word = '';

    const board = document.querySelector('.board');
    const keyboard = document.querySelector('.keyboard');
    const popup = document.getElementById('popup');
    const popupMessage = document.getElementById('popup-message');
    const popuphow = document.getElementById("popuphow");
    const helpButtonhow = document.getElementById("helpButtonhow");
    const closeButton = document.getElementById("closeButton");
    const closeButtonFinal = document.getElementById("closeButtonFinal");
    const popupFinal = document.getElementById('popupFinal');
    const popupMessageFinal = document.getElementById('popup-messageFinal');

    try {
        const response = await fetch('./one_line.txt'); // Adjust the path to your file
        const text = await response.text();
        validWords = text.split('\n').map(word => word.trim().toLowerCase());

        word = validWords[Math.floor(Math.random() * validWords.length)];
        
    } catch (error) {
        alert('Failed to load the list of valid words');
    }

    // Create the board (6 rows, 5 columns)
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            board.appendChild(tile);
        }
    }

    // Create the keyboard only once
    const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
    rows.forEach((row, rowIndex) => {
        const rowDiv = document.createElement('div');
        rowDiv.classList.add('row');
        row.split('').forEach(letter => {
            const key = document.createElement('div');
            key.classList.add('key');
            key.setAttribute('data-key', letter); // Add data attribute
            key.textContent = letter.toUpperCase();
            key.addEventListener('click', () => onKeyPress(letter));
            rowDiv.appendChild(key);
        });

        // Add the "Backspace" key next to the "m" key in the last row
        if (rowIndex === 2) {
            const backspaceKey = document.createElement('div');
            backspaceKey.classList.add('key', 'large');
            backspaceKey.setAttribute('data-key', 'Backspace');
            backspaceKey.textContent = '<';
            backspaceKey.addEventListener('click', onBackspace);
            rowDiv.appendChild(backspaceKey);
        }

        // Add the "Enter" key at the start of the first row
        if (rowIndex === 2) {
            const enterKey = document.createElement('div');
            enterKey.classList.add('key', 'large');
            enterKey.setAttribute('data-key', 'Enter');
            enterKey.textContent = 'ENTER';
            enterKey.addEventListener('click', onSubmit); // Add event listener for Enter key
            rowDiv.insertBefore(enterKey, rowDiv.firstChild);
        }

        
        keyboard.appendChild(rowDiv);
    });

    helpButtonhow.onclick = function() {
        popuphow.style.display = "block";
    }
    
    // When the user clicks on <span> (x), close the popup
    closeButton.onclick = function() {
        popuphow.style.display = "none";
    }
    
    // Close the popup if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == popuphow) {
            popuphow.style.display = "none";
        }
    }

    closeButtonFinal.onclick = function() {
        popupFinal.style.display = "none";
    }
    
    // Close the popup if the user clicks outside of it
    window.onclick = function(event) {
        if (event.target == popupFinal) {
            popupFinal.style.display = "none";
        }
    }

    document.addEventListener('keydown', (event) => {
        if (gameEnded) return; // Do nothing if the game has ended

        const key = event.key.toLowerCase();
        if (key === 'enter') {
            onSubmit();
        } else if (key === 'backspace') {
            onBackspace();
        } else if (/^[a-z]$/.test(key)) { // Check if it's a letter
            onKeyPress(key);
        }
    });

    function onKeyPress(letter) {
        if (currentGuess.length < 5) {
            currentGuess += letter;
            updateBoard();
        }
    }

    function onBackspace() {
        if (currentGuess.length > 0) {
            currentGuess = currentGuess.slice(0, -1);
            updateBoard();
        }
    }

    function onSubmit() {
        if (currentGuess.length === 5) {
            if (validWords.includes(currentGuess)) {
                checkGuess();
            } else {
                showPopup('Invalid Word');
            }
        } else {
            showPopup('Not Enough Letters');
        }
    }

    function updateBoard() {
        const tiles = document.querySelectorAll('.tile');
        const startIdx = currentRow * 5;
        for (let i = 0; i < 5; i++) {
            tiles[startIdx + i].textContent = currentGuess[i] || '';
        }
    }

    function checkGuess() {
        const tiles = document.querySelectorAll('.tile');
        const startIdx = currentRow * 5;

        let allCorrect = true;

        currentGuess.split('').forEach((letter, index) => {
            const key = document.querySelector(`.key[data-key="${letter}"]`);
            if (letter === word[index]) {
                tiles[startIdx + index].classList.add('correct');
                key.classList.add('correct');
            } else if (word.includes(letter)) {
                tiles[startIdx + index].classList.add('present');
                if (!key.classList.contains('correct')) {
                    key.classList.add('present');
                }
                allCorrect = false;
            } else {
                tiles[startIdx + index].classList.add('absent');
                if (!key.classList.contains('correct') && !key.classList.contains('present')) {
                    key.classList.add('absent');
                }
                allCorrect = false;
            }
        });

        if (!allCorrect) {
            currentGuess = ''; 
            currentRow++;
        }

        if (allCorrect) {
            gameEnded = true;
            showPopupFinal('CONGRATS!');
        } else if (currentRow === 6 && !allCorrect) {
            gameEnded = true;
            showPopupFinal(`The Word was "${word.toUpperCase()}"`);
        }
    }

    function showPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = 'block';

        setTimeout(() => {
            popup.style.display = 'none';
        }, 1000);
    }

    function showPopupFinal(message) {
        popupMessageFinal.textContent = message;
        popupFinal.style.display = 'block';
    }
});
