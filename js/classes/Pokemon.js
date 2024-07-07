import { ctx } from '../battle.js'

export const SPRITE_HEIGHT = 350
export const SPRITE_WIDTH = SPRITE_HEIGHT
const hitSounds = ['./assets/sounds/Shadow Punch.mp3', './assets/sounds/Flame Wheel part 2.mp3', './assets/sounds/Triple Kick 1hit.mp3', './assets/sounds/Double Kick 1hit.mp3', './assets/sounds/Tackle.mp3', './assets/sounds/Meteor Mash part 2.mp3', './assets/sounds/Pursuit.mp3', './assets/sounds/Mud Slap.mp3', './assets/sounds/Rock Smash.mp3', './assets/sounds/Peck.mp3', './assets/sounds/Low Kick.mp3', './assets/sounds/In-Battle Recall Switch Flee Run.mp3', './assets/sounds/Jump Kick.mp3', './assets/sounds/Hit Weak Not Very Effective.mp3', './assets/sounds/Cut.mp3', './assets/sounds/Comet Punch 1hit.mp3', './assets/sounds/Octazooka.mp3', './assets/sounds/Hit Normal Damage.mp3', './assets/sounds/hit-sound.mp3', './assets/sounds/Howl.mp3', './assets/sounds/Super Fang part 2.mp3', './assets/sounds/Clamp.mp3', './assets/sounds/Thunder Shock part 1.mp3', './assets/sounds/Seismic Toss part 1.mp3', './assets/sounds/Sky Attack part 2.mp3', './assets/sounds/Karate Chop.mp3', './assets/sounds/Slash.mp3', './assets/sounds/Quick Attack.mp3', './assets/sounds/Spore part 2.mp3', './assets/sounds/Pound.mp3', './assets/sounds/In-Battle Recall Switch Pokeball.mp3']

export default class Pokemon {
    constructor({ name, position, maxHp, hp, attack, imgSrc, img }) {
        this.name = name
        this.position = position
        this.maxHp = maxHp
        this.hp = hp
        this.attack = attack
        this.imgSrc = imgSrc
        this.img = new Image()

        this.img.src = this.imgSrc
        this.img.height = SPRITE_HEIGHT
        this.img.width = SPRITE_WIDTH
    }

    attackEnemy(enemy) {
        // decrement enemy pokemon health
        enemy.hp -= this.attack * 0.05
        
        // play hit sound effect
        const hitSoundFile = hitSounds[Math.floor(Math.random() * hitSounds.length)]
        const hitSound = new Audio(hitSoundFile)
        hitSound.volume = 0.7
        hitSound.play()
    
        // animate pokemon attacking
        const oldXPos = this.position.x
        const oldYPos = this.position.y
        const timeline = gsap.timeline()
        // timeline.to(this.position, { x: oldXPos - 100, duration: 0.2 })
        // timeline.to(this.position, { x: oldXPos, duration: 0.5 })
        timeline.to(this.position, {
            x: oldXPos - 100,
            y: oldYPos - 40,
            duration: 0.15,
            ease: 'power4.out'
        })
        timeline.to(this.position, {
            x: oldXPos,
            y: oldYPos,
            duration: 0.5,
            ease: 'power4.out'
        })
    }

    draw() {
        ctx.drawImage(this.img, this.position.x, this.position.y, this.img.width, this.img.height)
    }

    update() {
        this.draw()
    }
}