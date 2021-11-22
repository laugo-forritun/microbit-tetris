let WIDTH = 10
let HEIGHT = 40
let screen_x = 5
let screen_y = 1
let SCREEN_WIDTH = 5
let SCREEN_HEIGHT = 5
let BLOCK_FALL_SPEED = 1
let my_points: number[][] = [[1, 2], [2, 3], [3, 4]]
let block: number[][] = []

function relative_pos(x: number, y: number): number[] {
	return [x - screen_x, y - screen_y]
}

function draw() {
	basic.clearScreen()
	for (let i = 0; i < my_points.length; i++) {
		let point: number[] = my_points[i]
		let rel: number[] = relative_pos(point[0], point[1])
		led.plot(rel[0], rel[1])
	}
	for (let i = 0; i < block.length; i++) {
		let point: number[] = block[i]
		let rel: number[] = relative_pos(point[0], point[1])
		led.plot(rel[0], rel[1])
	}
	basic.pause(100)
}

function spawn_block() {
	if (block.length == 0) {
		// No block currently in use
		console.log("Spawning block")
		block = [[4, 0], [5, 0], [5, 1], [6, 0]]
	}
}

function move_block() {
	for (let i = 0; i < block.length; i++) {
		block[i][1] += BLOCK_FALL_SPEED
	}
}

function handle_input() {
	if (input.buttonIsPressed(Button.A) && screen_x > 0) {
		screen_x -= 1
	}
	if (input.buttonIsPressed(Button.B) && screen_x + SCREEN_WIDTH < WIDTH) {
		screen_x += 1
	}
}

basic.forever(function () {
	handle_input()
	move_block()
	spawn_block()
	draw()
})
