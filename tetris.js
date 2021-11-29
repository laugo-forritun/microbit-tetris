let WIDTH = 10
let HEIGHT = 20
let screen_x = 5
let screen_y = 1
let SCREEN_WIDTH = 5
let SCREEN_HEIGHT = 5
let BLOCK_FALL_SPEED = 1
let score = 0
let fall_counter = 0
let lock = false
let my_points: number[][] = [[1, 2], [2, 3], [3, 4]]
let blocks: number[][][] = [ // Possible block shapes, spawning from the centre
    [[4, -2], [5, -2], [7, -2], [6, -2]], // ▄▄
    [[4, -2], [5, -2], [5, -1], [6, -2]], // ▜▘
    [[4, -1], [5, -1], [5, -2], [6, -1]], // ▟▖
    [[4, -2], [5, -2], [4, -1], [5, -1]], // █
    // Add more blocks, e.g. square, L, and rotations of it
]
let block: number[][] = []
let field: number[][] = []

function relative_pos(x: number, y: number): number[] {
    return [x - screen_x, y - screen_y]
}
function draw_block(block: number[][], brightness: number = 255) {
    for (let i = 0; i < block.length; i++) {
        let point: number[] = block[i]
        let rel: number[] = relative_pos(point[0], point[1])
        led.plotBrightness(rel[0], rel[1], brightness)
    }
}
function draw() {
    basic.clearScreen()
    for (let i = 0; i < 5; i++) {
        // Left wall
        let rel: number[] = []
        rel = relative_pos(-1, screen_y + i)
        led.plotBrightness(rel[0], rel[1], 64)
        // Right wall
        rel = relative_pos(WIDTH, screen_y + i)
        led.plotBrightness(rel[0], rel[1], 64)
        // Ceiling
        for (let j = 0; j < 5; j++) {
            rel = relative_pos(screen_x + i, -1-j)
            led.plotBrightness(rel[0], rel[1], 64)
        }
        // Floor
        for (let j = 0; j < 5; j++) {
            rel = relative_pos(screen_x + i, HEIGHT+j)
            led.plotBrightness(rel[0], rel[1], 64)
        }
    }
    draw_block(block)
    draw_block(my_points, 200)
    draw_block(field)
    basic.pause(100)
}

function spawn_block() {
    if (block.length == 0) {
        // No block currently in use
        let b = blocks[Math.randomRange(0,blocks.length-1)]
        for (let i = 0; i < b.length; i++) block.push([b[i][0], b[i][1]])

        screen_x = 3
        screen_y = -3

        console.log(`Score: ${score}`)
        score += 1
    }
}

function add_to_field(block: number[][]) {
    for (let i = 0; i < block.length; i++) field.push(block[i])
}

function check_collision(x: number = 0, y: number = 1) {
    for (let i = 0; i < block.length; i++) {
        if (block[i][1]+y >= HEIGHT) return true
        console.log(`Number of items in field: ${field.length}`)
        for (let j = 0; j < field.length; j++) {
            if (field[j][0] == block[i][0] + x
                && field[j][1] == block[i][1] + y
            ) {
                console.log(`Collision! field: (${field[j][0]},${field[j][1]}) == (${block[i][0] + x},${block[i][1] + y})`)
                return true
            }
        }
    }
    return false
}

function move_block(x: number,y: number) {
    for (let i = 0; i < block.length; i++) {
        block[i][0] += x
        block[i][1] += y
    }
}

function block_fall() {
    if (check_collision()) {
        for (let i = 0; i < block.length; i++)
            if (block[i][1] < 0) {
                game.setScore(score)
                game.gameOver()
            }
        add_to_field(block)
        block = []
        return
    }
    fall_counter += 1
    if (fall_counter % (10-BLOCK_FALL_SPEED) == 0) {
        move_block(0, 1)
        screen_y += 1
    }
}

function handle_input() {
    if (input.acceleration(Dimension.X) < 0) {
        for (let i = 0; i < block.length; i++) if (block[i][0] == 0) return
        screen_x -= 1
        move_block(-1, 0)
    }
    if (input.acceleration(Dimension.X) > 0) {
        for (let i = 0; i < block.length; i++) if (block[i][0] == WIDTH - 1) return
        screen_x += 1
        move_block(1, 0)
    }
}

input.onShake(function () {
    lock = true
    let space = 0
    while (! check_collision(0, space)) space++
    move_block(0,space-1)
    add_to_field(block)
    block = []
    spawn_block()
    lock = false
})

basic.forever(function () {
    while (lock) pause(100)
    handle_input()
    block_fall()
    spawn_block()
    draw()
})

