let WIDTH = 10
let HEIGHT = 40
let screen_x = 5
let screen_y = 1
let SCREEN_WIDTH = 5
let SCREEN_HEIGHT = 5
let my_points: number[][] = [[1, 2], [2, 3], [3, 4]]

function relative_pos(x: number, y: number) {
	return [x - screen_x, y - screen_y]
}

function draw() {
	basic.clearScreen()
	for (let i = 0; i < my_points.length; i++) {
		let point: number[] = my_points[i]
		let rel: number[] = relative_pos(point[0], point[1])
		led.plot(rel[0], rel[1])
	}
	basic.pause(100)
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
	draw()
	handle_input()
})
