// ==UserScript==

// @name         Blum

// @version      1.1

// @namespace    Blum Bot

// @author       Blum Bot

// @match        https://telegram.blum.codes/*

// @grant        none

// @icon         http://notcryptoz.unaux.com/IMG_20240831_075948_151.jpg

// @updateURL    http://notcryptoz.unaux.com/BlumBot.js

// @downloadURL  http://notcryptoz.unaux.com/BlumBot.js

// ==/UserScript==



let GAME_SETTINGS = {

    BombHits: Math.floor(Math.random() * 2),

    IceHits: Math.floor(Math.random() * 2) + 2,

    flowerSkipPercentage: Math.floor(Math.random() * 11) + 15,

    minDelayMs: 2000,

    maxDelayMs: 5000,

};



let isGamePaused = true;

let isSettingsOpen = false;



try {

    console.log('Script started');



    let gameStats = {

        score: 0,

        bombHits: 0,

        iceHits: 0,

        flowersSkipped: 0,

        isGameOver: false,

    };



    const originalPush = Array.prototype.push;

    Array.prototype.push = function (...items) {

        if (!isGamePaused) {

            items.forEach(item => handleGameElement(item));

        }

        return originalPush.apply(this, items);

    };



    function handleGameElement(element) {

        if (!element || !element.item) return;



        const { type } = element.item;

        switch (type) {

            case "CLOVER":

                processFlower(element);

                break;

            case "BOMB":

                processBomb(element);

                break;

            case "FREEZE":

                processIce(element);

                break;

        }

    }



    function processFlower(element) {

        const shouldSkip = Math.random() < (GAME_SETTINGS.flowerSkipPercentage / 100);

        if (shouldSkip) {

            gameStats.flowersSkipped++;

        } else {

            gameStats.score++;

            clickElement(element);

        }

    }



    function processBomb(element) {

        if (gameStats.bombHits < GAME_SETTINGS.BombHits) {

            gameStats.score = 0;

            clickElement(element);

            gameStats.bombHits++;

        }

    }



    function processIce(element) {

        if (gameStats.iceHits < GAME_SETTINGS.IceHits) {

            clickElement(element);

            gameStats.iceHits++;

        }

    }



    function clickElement(element) {

        element.onClick(element);

        element.isExplosion = true;

        element.addedAt = performance.now();

    }



    function checkGameCompletion() {

        const rewardElement = document.querySelector('#app > div > div > div.content > div.reward');

        if (rewardElement && !gameStats.isGameOver) {

            gameStats.isGameOver = true;

            logGameStats();

            resetGameStats();

            if (window.__NUXT__.state.$s$0olocQZxou.playPasses > 0) {

                startNewGame();

            }

        }

    }



    function logGameStats() {

        console.log(`Game Over. Stats: Score: ${gameStats.score}, Bombs: ${gameStats.bombHits}, Ice: ${gameStats.iceHits}, Flowers Skipped: ${gameStats.flowersSkipped}`);

    }



    function resetGameStats() {

        gameStats = {

            score: 0,

            bombHits: 0,

            iceHits: 0,

            flowersSkipped: 0,

            isGameOver: false,

        };

    }



    function getRandomDelay() {

        return Math.random() * (GAME_SETTINGS.maxDelayMs - GAME_SETTINGS.minDelayMs) + GAME_SETTINGS.minDelayMs;

    }



    function startNewGame() {

        setTimeout(() => {

            const newGameButton = document.querySelector("#app > div > div > div.buttons > button:nth-child(2)");

            if (newGameButton) {

                newGameButton.click();

            }

            gameStats.isGameOver = false;

        }, getRandomDelay());

    }



    const observer = new MutationObserver(mutations => {

        for (const mutation of mutations) {

            if (mutation.type === 'childList') {

                checkGameCompletion();

            }

        }

    });



    const appElement = document.querySelector('#app');

    if (appElement) {

        observer.observe(appElement, { childList: true, subtree: true });

    }



    const controlsContainer = document.createElement('div');

    controlsContainer.style.position = 'fixed';

    controlsContainer.style.top = '0';

    controlsContainer.style.left = '50%';

    controlsContainer.style.transform = 'translateX(-50%)';

    controlsContainer.style.zIndex = '9999';

    controlsContainer.style.backgroundColor = 'black';

    controlsContainer.style.padding = '10px 20px';

    controlsContainer.style.borderRadius = '10px';

    document.body.appendChild(controlsContainer);



    const OutGamePausedTrue = document.createElement('a');

    OutGamePausedTrue.href = atob('aHR0cHM6Ly90Lm1lL0luc3RhbnRfRWFybjc3');

    OutGamePausedTrue.textContent = atob('SU5TVEFOVCBFQVJO');

    OutGamePausedTrue.style.color = 'white';

    controlsContainer.appendChild(OutGamePausedTrue);



    const lineBreak = document.createElement('br');

    controlsContainer.appendChild(lineBreak);



    const pauseButton = document.createElement('button');

    pauseButton.textContent = 'START';

    pauseButton.style.padding = '4px 8px';

    pauseButton.style.backgroundColor = '#5d2a8f';

    pauseButton.style.color = 'white';

    pauseButton.style.border = 'none';

    pauseButton.style.borderRadius = '10px';

    pauseButton.style.cursor = 'pointer';

    pauseButton.style.marginRight = '5px';

    pauseButton.onclick = toggleGamePause;

    controlsContainer.appendChild(pauseButton);



    const settingsButton = document.createElement('button');

    settingsButton.textContent = atob('U2V0dGluZ3M=');

    settingsButton.style.padding = '4px 8px';

    settingsButton.style.backgroundColor = '#5d2a8f';

    settingsButton.style.color = 'white';

    settingsButton.style.border = 'none';

    settingsButton.style.borderRadius = '10px';

    settingsButton.style.cursor = 'pointer';

    settingsButton.onclick = toggleSettings;

    controlsContainer.appendChild(settingsButton);



    const settingsContainer = document.createElement('div');

    settingsContainer.style.display = 'none';

    settingsContainer.style.marginTop = '10px';

    controlsContainer.appendChild(settingsContainer);



    function createSettingInput(label, settingName, min, max) {

        const settingDiv = document.createElement('div');

        settingDiv.style.marginBottom = '5px';

        settingDiv.style.color = 'white';



        const labelElement = document.createElement('label');

        labelElement.textContent = label;

        labelElement.style.display = 'block';

        labelElement.style.color = 'white';

        settingDiv.appendChild(labelElement);



        const inputElement = document.createElement('input');

        inputElement.type = 'number';

        inputElement.value = GAME_SETTINGS[settingName];

        inputElement.min = min;

        inputElement.max = max;

        inputElement.style.width = '50px';

        inputElement.addEventListener('input', () => {

            GAME_SETTINGS[settingName] = parseInt(inputElement.value, 10);

        });

        settingDiv.appendChild(inputElement);



        return settingDiv;

    }



    function toggleSettings() {

        isSettingsOpen = !isSettingsOpen;

        if (isSettingsOpen) {

            settingsContainer.style.display = 'block';

            settingsContainer.innerHTML = '';

            settingsContainer.appendChild(createSettingInput('Bomb:', 'BombHits', 0, 10));

            settingsContainer.appendChild(createSettingInput('Ice:', 'IceHits', 0, 10));

            settingsContainer.appendChild(createSettingInput('Flower Skip %:', 'flowerSkipPercentage', 0, 100));

        } else {

            settingsContainer.style.display = 'none';

        }

    }



    function toggleGamePause() {

        isGamePaused = !isGamePaused;

        pauseButton.textContent = isGamePaused ? 'START' : 'PAUSE';

    }



} catch (e) {

    console.log('Failed to initiate the game script');

}

