import { ctx } from '../battle.js'
import Pokemon, { SPRITE_HEIGHT, SPRITE_WIDTH } from './Pokemon.js'

export default class LeftPokemon extends Pokemon {
    constructor({ name, position, maxHp, hp, attack, imgSrc, img }) {
        super({ name, position, maxHp, hp, attack, imgSrc, img })
    }

    draw() {
        ctx.save()

        ctx.scale(-1, 1)
        ctx.drawImage(this.img, this.position.x - this.img.width, this.position.y, this.img.width, this.img.height)

        ctx.restore()
    }
}