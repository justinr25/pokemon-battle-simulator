// imports

import {
    battle,
    fadeOutVictoryMusic,
    toggleBattleMusic,
    healthbar1,
    healthbar2,
    canvas,
    ctx,
    pokemon1,
    pokemon2,
} from './battle.js'


// get DOM elements

const mainContainer = document.querySelector('[data-main-container]')
const pokemonInputForm = document.querySelector('[data-pokemon-input-form]')
const pokemonInputs = document.querySelectorAll('[data-pokemon-input]')
const pokemonInput1 = pokemonInputs[0]
const pokemonInput2 = pokemonInputs[1]
const pokemonInputSubmitBtn = document.querySelector('[data-pokemon-input-submit-btn]')
const pokemonValidIndicator1 = document.querySelector('[data-pokemon-input-1][data-valid-pokemon-indicator]')
const pokemonInvalidIndicator1 = document.querySelector('[data-pokemon-input-1][data-invalid-pokemon-indicator]')
const pokemonValidIndicator2 = document.querySelector('[data-pokemon-input-2][data-valid-pokemon-indicator]')
const pokemonInvalidIndicator2 = document.querySelector('[data-pokemon-input-2][data-invalid-pokemon-indicator]')
const canvasContainer = document.querySelector('[data-canvas-container]')
const pokemonText1 = document.querySelector('[data-pokemon-text-1]')
const pokemonText2 = document.querySelector('[data-pokemon-text-2]')
const victoryText = document.querySelector('[data-victory-text]')


// create globals

const POKEMON_API_URL = 'https://pokeapi.co/api/v2/pokemon/'
let isPokemon1Valid = false
let isPokemon2Valid = false
let isLastResponseOk
let lastValidPokemonName


// define functions

// define function to clear inputs
function clearInputs() {
    pokemonInputs.forEach((pokemonInput) => {
        pokemonInput.value = '';
    })
}

// define function to fetch response on specific pokemon
async function fetchPokemonResponse(pokemonName) {
    const response = await fetch(`${POKEMON_API_URL}${pokemonName}`)
    return response
}

// define function to get pokemon specific data
async function getPokemonData(response) {
    try {
        const data = await response.json()
        return data
    }
    catch(error) {
        console.error(error)
    }
}

// define function to check if pokemon is valid
function checkValidPokemon(response, pokemonInput, isPokemon1) {
    if (response.ok && pokemonInput.value != '') {
        if (isPokemon1) {
            pokemonValidIndicator1.classList.add('active')
            pokemonInvalidIndicator1.classList.remove('active')
            isPokemon1Valid = true
        } else {
            pokemonValidIndicator2.classList.add('active')
            pokemonInvalidIndicator2.classList.remove('active')
            isPokemon2Valid = true
        }

        isLastResponseOk = true
        lastValidPokemonName = pokemonInput.value.toLowerCase()
    } else {
        if (isPokemon1) {
            pokemonValidIndicator1.classList.remove('active')
            pokemonInvalidIndicator1.classList.add('active')
            isPokemon1Valid = false
        } else {
            pokemonValidIndicator2.classList.remove('active')
            pokemonInvalidIndicator2.classList.add('active')
            isPokemon2Valid = false
        }

        isLastResponseOk = false
    }
}

// define function to check if both pokemon are valid
function checkBothValid() {
    if (isPokemon1Valid && isPokemon2Valid) {
        enableBattleBtn()
        // console.log('both valid pokemon!')
    } else {
        disableBattleBtn()
    }
}

// define function to handle input changes
async function handleInputChanges(pokemonInput) {
    const pokemonName = pokemonInput.value.toLowerCase()
    const response = await fetchPokemonResponse(pokemonName)
    const isPokemon1 = 'pokemonInput-1' in pokemonInput.dataset
    
    if (lastValidPokemonName === pokemonInput.value.toLowerCase() && isLastResponseOk) return
    checkValidPokemon(response, pokemonInput, isPokemon1)
    checkBothValid()
}

// define function to toggle battle button
function enableBattleBtn() {
    pokemonInputSubmitBtn.classList.add('active')
}

// define function to disable battle button
function disableBattleBtn() {
    pokemonInputSubmitBtn.classList.remove('active')
}

// define function to toggle main container visibility
function toggleMainContainerVisibility() {
    mainContainer.classList.toggle('visible')
}

// define function to toggle main container usability
function toggleMainContainerUsability() {
    mainContainer.classList.toggle('usable')
    pokemonInputs.forEach((pokemonInput) => {
        pokemonInput.readOnly = !pokemonInput.readOnly
    })
    pokemonInputSubmitBtn.disabled = !pokemonInputSubmitBtn.disabled
}

// define function to toggle main container
function toggleMainContainer() {
    mainContainer.classList.toggle('visible')
    mainContainer.classList.toggle('usable')
    pokemonInputs.forEach((pokemonInput) => {
        pokemonInput.readOnly = !pokemonInput.readOnly
    })
    pokemonInputSubmitBtn.disabled = !pokemonInputSubmitBtn.disabled
}

// define function to toggle canvas container
function toggleCanvasContainer() {
    canvasContainer.classList.toggle('active')
}

// define function to write pokemon names on canvas
function writePokemonNames () {
    const pokemonName1 = pokemonInput1.value
    const pokemonName2 = pokemonInput2.value

    pokemonText1.innerText = pokemonName1.toUpperCase()
    pokemonText2.innerText = pokemonName2.toUpperCase()
}

// define function to reset the healthbars
function resetHealthbars() {
    healthbar1.style.width = '100%'
    healthbar2.style.width = '100%'
}

// define function to enable victory text
function enableVictoryText() {
    const winnerName = pokemon1.hp > 0 ? pokemon1.name.toUpperCase() : pokemon2.name.toUpperCase()
    victoryText.innerText = `${winnerName} WINS`
    victoryText.classList.add('active')
    // console.log('victory text enabled')
}

// define function to disable victory text
function disableVictoryText() {
    victoryText.classList.remove('active')
    // console.log('victory text disabled')
}


// add event listeners

// handle input fields changing
pokemonInputs.forEach((pokemonInput) => {
    pokemonInput.addEventListener('input', async () => {
        await handleInputChanges(pokemonInput)
    })
})

// handle form submission
pokemonInputForm.addEventListener('submit', async (event) => {
    event.preventDefault()
    if (!(isPokemon1Valid && isPokemon2Valid)) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const pokemonName1 = pokemonInput1.value
    const pokemonName2 = pokemonInput2.value
    let pokemonResponse1
    let pokemonResponse2
    let pokemonData1
    let pokemonData2
    
    pokemonResponse1 = await fetchPokemonResponse(pokemonName1)
    pokemonResponse2 = await fetchPokemonResponse(pokemonName2)
    pokemonData1 = await getPokemonData(pokemonResponse1)
    pokemonData2 = await getPokemonData(pokemonResponse2)

    // OFFLINE STUFF
    // pokemonResponse1 = await fetchLocalPokemonResponse(pokemonName1)
    // pokemonResponse2 = await fetchLocalPokemonResponse(pokemonName2)
    // pokemonData1 = await getPokemonData(pokemonResponse1)
    // pokemonData2 = await getPokemonData(pokemonResponse2)
    
    toggleMainContainerUsability()
    setTimeout(toggleMainContainerVisibility, 1000)
    setTimeout(toggleCanvasContainer, 3500)
    writePokemonNames()
    toggleBattleMusic()
    resetHealthbars()

    await new Promise(resolve => setTimeout(resolve, 4000))
    await battle(pokemonData1, pokemonData2)
    enableVictoryText()
    // console.log('FIGHT FINISHED')
    setTimeout(toggleCanvasContainer, 6000)
    await new Promise(resolve => {
        setTimeout(() => {
            toggleMainContainer()
            resolve()
        }, 7000)
    })
    disableVictoryText()
    fadeOutVictoryMusic()
})


// implementation

// check if pokemon names are valid
pokemonInputs.forEach((pokemonInput) => {
    handleInputChanges(pokemonInput)
})






// OFFLINE STUFF
// async function fetchLocalPokemonResponse(pokemonName) {
//     const path = `../json/${pokemonName}.json`
//     const response = await fetch(path)
//     return response
// }

// async function handleOfflineInputChanges(pokemonInput) {
//     const pokemonName = pokemonInput.value.toLowerCase()
//     const response = await fetchLocalPokemonResponse(pokemonName)
//     const isPokemon1 = 'pokemonInput-1' in pokemonInput.dataset
    
//     checkValidPokemon(response, pokemonInput, isPokemon1)
//     checkBothValid()
// }

// pokemonInputs.forEach((pokemonInput) => {
//     handleOfflineInputChanges(pokemonInput)
// })