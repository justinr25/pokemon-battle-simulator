// imports

import Pokemon from './classes/Pokemon.js'
import LeftPokemon from './classes/LeftPokemon.js'


// get DOM elements
export const healthbar1 = document.querySelector('[data-healthbar-1]')
export const healthbar2 = document.querySelector('[data-healthbar-2]')


// setup canvas
export const canvas = document.querySelector('[data-canvas]')
export const ctx = canvas.getContext('2d')
canvas.width = 1440
canvas.height = 810


// define globals

const MIN_ATK_DELAY = 500
const MAX_ATK_DELAY = 2000
export let pokemon1
export let pokemon2
let animationId
let isMovePokemonInFrame
let isBattleMusicPlaying = false
let isVictoryMusicPlaying = false
const BATTLE_MUSIC = new Audio('./assets/music/1-15. Battle (Vs. Trainer).mp3')
const VICTORY_MUSIC = new Audio('./assets/music/1-16. Victory (Vs. Trainer).mp3')


// define functions

// define function for animation loop
function movePokemonInFrame() {
    pokemon1.position.x -= 8
    pokemon2.position.x -= 8
}

function animate() {
    animationId = requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (isMovePokemonInFrame) movePokemonInFrame()

    pokemon1.update()
    pokemon2.update()
}

// define function to generate random attack delay
function generateRandomAtkDelay() {
    const atkDelay = Math.random() * (MAX_ATK_DELAY - MIN_ATK_DELAY) + MIN_ATK_DELAY
    // console.log('random atk delay:', atkDelay)
    return atkDelay
}

// define function to update healthbars
function updateHealthbars() {
    if (pokemon1.hp <= 0) {
        healthbar1.style.width = `0`
    } else if (pokemon2.hp <= 0) {
        healthbar2.style.width = `0`
    } else {
        healthbar1.style.width = `${(pokemon1.hp / pokemon1.maxHp) * 100}%`
        healthbar2.style.width = `${(pokemon2.hp / pokemon2.maxHp) * 100}%`
    }

    // console.log(`healthbar %: ${(pokemon1.hp / pokemon1.maxHp) * 100}`)
    // console.log(`healthbar %: ${(pokemon2.hp / pokemon2.maxHp) * 100}`)
}

// define function to toggle battle music 
export function toggleBattleMusic() {
    if (!isBattleMusicPlaying) {
    BATTLE_MUSIC.volume = 0.2
        BATTLE_MUSIC.play()
        isBattleMusicPlaying = true
    } else {
        BATTLE_MUSIC.pause()
        BATTLE_MUSIC.volume = 0
        BATTLE_MUSIC.currentTime = 0
        isBattleMusicPlaying = false
    }
}

// define function to toggle victory music
function toggleVictoryMusic() {
    if (!isVictoryMusicPlaying) {
        VICTORY_MUSIC.volume = 0.2
        VICTORY_MUSIC.play()
        isVictoryMusicPlaying = true
    } else {
        VICTORY_MUSIC.pause()
        VICTORY_MUSIC.volume = 0
        VICTORY_MUSIC.currentTime = 0
        isVictoryMusicPlaying = false
    }
}

// define function to fade out victory music
export function fadeOutVictoryMusic() {
    function temp () {
        VICTORY_MUSIC.pause()
        VICTORY_MUSIC.currentTime = 0
        isVictoryMusicPlaying = false
    }
    gsap.to(VICTORY_MUSIC, {
        duration: 8,
        ease: 'ease-out',
        volume: 0,
        onComplete: temp
    })
}

// define function to start fight
function startFight() {
    return new Promise((resolve) => {
        let isBattleEnded = false

        // define function to check if fight over
        function isFightOver() {
            if (pokemon1.hp <= 0 || pokemon2.hp <= 0) {
                if (!isBattleEnded) {
                    isBattleEnded = true
                    if (isBattleMusicPlaying) toggleBattleMusic()
                    if (!isVictoryMusicPlaying) toggleVictoryMusic()
                }
                resolve()
                return true
            }
            return false
        }

        // define function for pokemon 1 attack loop
        function pokemon1Attack() {
            if (isFightOver()) return
    
            setTimeout(() => {
                if (isFightOver()) return

                pokemon1.attackEnemy(pokemon2)
                updateHealthbars()
    
                console.log(`${pokemon1.name} attacked ${pokemon2.name}!`)
                // console.log(`${pokemon1.name} hp: ${pokemon1.hp}`)
                // console.log(`${pokemon2.name} hp: ${pokemon2.hp}`)
                // console.log()
    
                pokemon1Attack()
            }, generateRandomAtkDelay())
        }
    
        // define function for pokemon 2 attack loop
        function pokemon2Attack() {
            if (isFightOver()) return
    
            setTimeout(() => {
                if (isFightOver()) return
                
                pokemon2.attackEnemy(pokemon1)
                updateHealthbars()
    
                console.log(`${pokemon2.name} attacked ${pokemon1.name}!`)
                // console.log(`${pokemon1.name} hp: ${pokemon1.hp}`)
                // console.log(`${pokemon2.name} hp: ${pokemon2.hp}`)
                // console.log()
    
                pokemon2Attack()
            }, generateRandomAtkDelay())
        }
    
        // start attack loops for both pokemon
        pokemon1Attack()
        pokemon2Attack()
        if (isFightOver()) {
            resolve()
        }
    })
}

// define function for battle sequence
export function battle(pokemonData1, pokemonData2) {
    return new Promise(async (resolve) => {
        // console.log(pokemonData1)
        // console.log(pokemonData2)
        
        // get pokemon attributes
        const pokemonName1 = pokemonData1.species.name
        const pokemonName2 = pokemonData2.species.name
        const pokemonHp1 = pokemonData1.stats[0].base_stat
        const pokemonHp2 = pokemonData2.stats[0].base_stat
        const pokemonAttack1 = pokemonData1.stats[1].base_stat
        const pokemonAttack2 = pokemonData2.stats[1].base_stat
        const pokemonImgSrc1 = pokemonData1.sprites.front_default
        const pokemonImgSrc2 = pokemonData2.sprites.front_default
    
        // console.log('pokemon 1 hp:', pokemonHP1)
        // console.log('pokemon 1 attack:', pokemonAttack1)
        // console.log('pokemon 1 img src:', pokemonImgSrc1)
        // console.log('pokemon 2 hp:', pokemonHP2)
        // console.log('pokemon 2 attack:', pokemonAttack2)
        // console.log('pokemon 2 img src:', pokemonImgSrc2)
    
        // instantiate pokemon objects
        pokemon1 = new LeftPokemon({
            name: pokemonName1,
            position: {
                x: 500,
                y: canvas.height / 2 - 50
            },
            maxHp: pokemonHp1,
            hp: pokemonHp1,
            attack: pokemonAttack1,
            imgSrc: pokemonImgSrc1,
        })
        pokemon2 = new Pokemon({
            name: pokemonName2,
            position: {
                x: canvas.width + 200,
                y: canvas.height / 2 - 50
            },
            maxHp: pokemonHp2,
            hp: pokemonHp2,
            attack: pokemonAttack2,
            imgSrc: pokemonImgSrc2,
        })
    
        // draw pokemon to canvas
        setTimeout(animate, 500)
        isMovePokemonInFrame = true
        setTimeout(() => {
            isMovePokemonInFrame = false
        }, 1125)
    
        await new Promise(resolve => setTimeout(resolve, 1000))
        await startFight()
        cancelAnimationFrame(animationId)
        resolve()
    })

}


// add event listeners


// implementation