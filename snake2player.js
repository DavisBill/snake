

var snake_head_class = get_rule('.snake_head') 
var snake_head = [get_rule('#snake_head_0'),get_rule('#snake_head_1')]
var playground = get_rule('#playground')
var playground_w = parseInt(playground.style.width)
var playground_h = parseInt(playground.style.height)

var x;
var y;
var snake_unit = parseInt(snake_head_class.style.width)
var dx = []
var dy = []

var direction = [] 
var dir_lock = [false,false]

var snake_body_id_num = [0,0]
var snake_body_array =[[],[]]

var food_id_num = 0
var food_array =[]

var pause_b = true

var t;
var move = [,]
var player_num;
var grade_lock;
var border_lock;
var pre_move = [[],[]];


var settings = document.setting
for(var i = 0; i < settings.length; i++){
	settings[i].addEventListener("change",restart)
}


function get_rule(name){
	var ss = document.styleSheets[0]
	for (i = 0; i < ss.cssRules.length; i++){
		var rule = ss.cssRules[i]
		if( rule.selectorText == name){
			return rule;
		}
	} 
}

function creat_body(player){
	var pg = document.getElementById("playground")
	var id_name = "snake" + player + "_body" + snake_body_id_num[player]
	var para=document.createElement("DIV");
	pg.append(para);
	para.setAttribute("id", id_name)
	para.setAttribute("class", "snake_body_"+player);
	para.setAttribute("style", "left: "+x[player]+"px; top: "+y[player]+"px; transform:"+ snake_head[player].style.transform +";") 
	snake_body_array[player][snake_body_id_num[player]] = document.getElementById(id_name)
	snake_body_id_num[player] = snake_body_id_num[player] + 1
	score(player)
}

function snake_body_follow(player){	
	for (var i = snake_body_array[player].length - 1; i > 0; i--) {
		snake_body_array[player][i].style.left = snake_body_array[player][i-1].style.left
		snake_body_array[player][i].style.top = snake_body_array[player][i-1].style.top
		snake_body_array[player][i].style.transform = snake_body_array[player][i-1].style.transform 
	}
	if(snake_body_array[player].length > 0){			
		snake_body_array[player][0].style.left = x[player] + 'px'
		snake_body_array[player][0].style.top = y[player] + 'px'
		snake_body_array[player][0].style.transform = snake_head[player].style.transform
	}
	
}

function move_horizontal(player){
	x[player] = parseInt(snake_head[player].style.left)
	var nx = x[player] + dx[player]
	snake_head[player].style.left = nx + 'px'
}

function move_vertical(player){
	y[player] = parseInt(snake_head[player].style.top)
	var ny = y[player] + dy[player]
	snake_head[player].style.top = ny + 'px'
}

function border_dead(player){
	if(border_lock != "true"){
		return false
	}
	if(parseInt(snake_head[player].style.left) + dx[player] > playground_w - snake_unit){
		end(player)
		return true
	}
	if(parseInt(snake_head[player].style.left) + dx[player] < 0){
		end(player)
		return true
	}
	if(parseInt(snake_head[player].style.top)  + dy[player] > playground_h - snake_unit){
		end(player)
		return true
	}
	if(parseInt(snake_head[player].style.top) + dy[player] < 0){
		end(player)
		return true
	}
}

function head_move(player){
	if(pause_b == true){
		return
	}
	turn_direction(player)
	if(bump_into_myself(player) == true || bump_into_other_body(player) == true || border_dead(player) == true){
		
	}else{
		move_horizontal(player)
		move_vertical(player)
		dir_lock[player] = true
		snake_body_follow(player)
		without_border(player)
		eat_food(player)
	}
}

function bump_into_myself(player){

	var x = parseInt(snake_head[player].style.left) + dx[player] 
	var y = parseInt(snake_head[player].style.top) + dy[player] 
	if(border_lock != "true"){
		if (x == playground_w) {x = 0}
		if (x == -snake_unit ) {x = playground_w - snake_unit}
		if (y == playground_h) {y = 0}
		if (y == -snake_unit) {y = playground_h - snake_unit}
	}
	var head_x_going = x + 'px'
	var head_y_going = y  + 'px'
	for(i = 0; i < snake_body_array[player].length; i++){
		if(head_x_going == snake_body_array[player][i].style.left && head_y_going == snake_body_array[player][i].style.top){
			end(player)
			return true
		}
	}

}

function bump_into_other_body(player){
	if(player_num < 2){
		return false
	}
	if(player == 0){
		var opponent = 1
	}else if(player == 1){
		var opponent = 0
	}
	var x = parseInt(snake_head[player].style.left) + dx[player] 
	var y = parseInt(snake_head[player].style.top) + dy[player] 
	
	if(border_lock != "true"){
		if (x == playground_w) {x = 0}
		if (x == -snake_unit ) {x = playground_w - snake_unit}
		if (y == playground_h) {y = 0}
		if (y == -snake_unit) {y = playground_h - snake_unit}
	}
	var head_x_going = x + 'px'
	var head_y_going = y  + 'px'
	for(i = 0; i < snake_body_array[opponent].length; i++){
		
		if(head_x_going == snake_body_array[opponent][i].style.left && head_y_going	== snake_body_array[opponent][i].style.top){
			end(player)
			return true
		}
	
	}
	if (head_x_going == snake_head[opponent].style.left && head_y_going == snake_head[opponent].style.top){
		end(player)
		return true
	}

}


function move_oneway_left(player){
	dx[player] = -snake_unit
	dy[player] = 0
	dir_lock[player] = false
	direction[player] = 37
}

function move_oneway_right(player){
	dx[player] = snake_unit
	dy[player] = 0
	dir_lock[player] = false
	direction[player] = 39
}

function move_oneway_down(player){
	dx[player] = 0
	dy[player] = snake_unit
	dir_lock[player] = false
	direction[player] = 40
}

function move_oneway_up(player){
	dx[player] = 0
	dy[player] = -snake_unit
	dir_lock[player] = false
	direction[player] = 38
}


addEventListener("keydown", keboard_control);
function keboard_control(event){
	switch(event.which){
		case 32:
			pause()
			break;
		case 48://0
			break;
		case 49://1
			restart()
			break;
		case 50://2
			check_value()
			break;
		case 51://3
			creat_food()
			break;
		case 52://4
			recycle_food()
			break;
		case 53://5
			faster(0)
			break;
		case 54://6
			slower()
			break;
		case 55://7
			dead_gray(0)
			break;
		case 56://8
			creat_player2_snake_head()
			break;
		case 57://9
			break;
	}

	if(event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40){
		pre_control(0,event.which)
	}
	if(event.which == 65 || event.which == 68 || event.which == 83 || event.which == 87){
		//a		
		pre_control(1,event.which)	
	}
}


function creat_food(){

	var lx = Math.floor((playground_w/snake_unit)*Math.random())*snake_unit
	var ly = Math.floor((playground_h/snake_unit)*Math.random())*snake_unit
	var pg = document.getElementById("playground")
	var id_name = "food" + food_id_num
	var para=document.createElement("DIV")
	pg.append(para);
	para.setAttribute("id", id_name)
	para.setAttribute("class", "food");
	para.setAttribute("style", "left: "+lx+"px; top: "+ly+"px;")
	food_array[food_array.length] = document.getElementById(id_name)
	food_id_num = food_id_num + 1
}


function eat_food(player){
	for(i = 0; i < food_array.length; i++){
		if(snake_head[player].style.left == food_array[i].style.left && snake_head[player].style.top == food_array[i].style.top){

			var food = food_array[i]
			var pg = document.getElementById("playground")
			pg.removeChild(food)
			food_array.splice(i,1)
			creat_body(player)
			creat_food()
			if(grade_lock == "true"){
				grade(player)
			}
		}
	} 
}
function end(player){
	clearInterval(move[player])
	dir_lock[player] = false
	dead_gray(player)
}

function pause(player){
	pause_b = !pause_b
	dir_lock[player] = false	
}

function restart(){
	for(ii = 0; ii < player_num; ii++){
		end(ii)
		remove_snake_body(ii)
		if(document.getElementById("snake_head_"+ii) != null){
			remove_snake_head(ii)
		}
	}
	for(i = food_array.length-1; i >= 0; i--){
		recycle_food()
	}

	dir_lock = [false,false]

	food_id_num = 0
	food_array =[]
	pause_b = true
	pre_move = [[],[]]

	grade_lock = setting("n_grade")
	border_lock = setting("n_border")	
	t = [setting("n_speed"),setting("n_speed")]
	player_num = setting("n_player")
	for (var i = 0; i < player_num; i++) {
		creat_snake_head(i)
		clearInterval(move[i])
		move[i] = setInterval("head_move("+i+")", t[i])
		size(i)
	}
	for (var i = 0; i < setting("n_food"); i++) {
		creat_food()
	}
}
function remove_snake_body(player){
	var length = snake_body_array[player].length
	for(i = 0; i < length; i++){
		var snake_body = snake_body_array[player][i]
		var pg = document.getElementById("playground")
		pg.removeChild(snake_body);
		snake_body_id_num[player] = snake_body_id_num[player] - 1
	}
	for(var ix = 0; ix < length; ix++){
		snake_body_array[player].splice(0,1)
	}
}
function recycle_food(){
	if (food_array.length < 1) {
		return
	}
	var food = food_array[food_array.length-1]
	var pg = document.getElementById("playground")
	pg.removeChild(food)
	food_array.splice(food_array.length-1,1)
}	
function faster(player){
	t[player] = parseInt(t[player]*0.95)
	clearInterval(move[player])
	move[player] = setInterval("head_move("+player+")", t[player])
	var screen = document.getElementById("speed_screen")
	screen.value = t[player]
}
function slower(player){
	t[player] = parseInt(t[player]*1/0.9)
	clearInterval(move[player])
	move[player] = setInterval("head_move("+player+")", t[player])
	var screen = document.getElementById("speed_screen")
	screen.value = t[player]
}
function score(player){
	var screen = document.getElementById("score_screen")
	screen.value = snake_body_id_num[player]
}
function grade(player){
	if(snake_body_id_num[player] < 5 && t[player] <200){
		return
	}else if(snake_body_id_num[player] < 20 &&  t[player] < 150){
		return
	}else if(snake_body_id_num[player] < 35 && t[player] < 95){
		return
	}else if(snake_body_id_num[player] < 80 && t[player] < 75){
		return
	}else if(snake_body_id_num[player] < 130 && t[player] < 65){
		return
	}else if(snake_body_id_num[player] < 150 && t[player] < 55){
		return

	}else{
		faster(player)
	}
}
function check_value(player){

	console.log(move[0])
	console.log(move[1])

	// console.log(snake_body_array)
}
function creat_snake_head(player){

	var pg = document.getElementById("playground")
	var para=document.createElement("DIV");
	pg.append(para);
	para.setAttribute("id", "snake_head_"+player)
	para.setAttribute("class", "snake_head")
	switch(player){
		case 0:
			snake_head[player].style.left = 0 + 'px'
			snake_head[player].style.top = 0 + 'px'	
			snake_head[player].style.transform = "rotate(90deg)" 
			dx[player] = snake_unit
			dy[player] = 0
			direction[player] = 37 

			break;
		case 1:
			snake_head[player].style.left = playground_w - snake_unit + 'px'
			snake_head[player].style.top = playground_h - snake_unit + 'px'	
			snake_head[player].style.transform = "rotate(270deg)" 
			dx[player] = -snake_unit
			dy[player] = 0
			direction[player] = 39 
			break;

	}
	x = [parseInt(snake_head[0].style.left),parseInt(snake_head[1].style.left)]
	y = [parseInt(snake_head[0].style.top),parseInt(snake_head[1].style.top)]
}
function remove_snake_head(player){
	var pg = document.getElementById("playground")
	var para=document.getElementById("snake_head_"+player)
	pg.removeChild(para)
}
function setting(name){
    var x = document.getElementsByName(name);
    var i;
    for (i = 0; i < x.length; i++) {
        if (x[i].checked == true) {
            return x[i].value
        }
    }
}
function size(player){
	var size = setting("n_size")
	for (var i = 0; i < size; i++) {
		creat_body(player)
	}
} 
function without_border(player){
	if(border_lock == "true"){
		return
	}
	if(parseInt(snake_head[player].style.left) + snake_unit > playground_w){
		snake_head[player].style.left = '0px'
	}
	if(parseInt(snake_head[player].style.left)   < 0){
		snake_head[player].style.left = playground_w - snake_unit + 'px'
	}
	if(parseInt(snake_head[player].style.top)  + snake_unit > playground_h){
		snake_head[player].style.top = '0px'
	}
	if(parseInt(snake_head[player].style.top) < 0){
		snake_head[player].style.top = playground_h - snake_unit + 'px'
	}
}
function dead_gray(player){
	for (var i = 0; i < snake_body_array[player].length; i++) {
		var gradient = 30 + parseInt((1-i/snake_body_array[player].length)*50)
		snake_body_array[player][i].style.filter = "opacity("+gradient+"%)blur(1px)"
		// console.log()
	}
	// snake_head[player].style.filter = "grayscale(80%)blur(1px)"
	document.getElementById("snake_head_"+player).setAttribute("style", "filter: opacity(80%)blur(1px)")
}

function pre_control(player,keycode){	
	pre_move[player].push(keycode)
}

function turn_direction(player){
	switch(player){
		case 0:
			while(dir_lock[player] == true && pre_move[player][0] != null){
				if(pre_move[player][0] == 37 && direction[0] != 39 && direction[0] != 37){
					move_oneway_left(0)
					snake_head[0].style.transform = "rotate(270deg)"
				}
				if(pre_move[player][0] == 39 && direction[0] != 37 && direction[0] != 39){
					move_oneway_right(0)
					snake_head[0].style.transform = "rotate(90deg)"		
				}
				if(pre_move[player][0] == 40 && direction[0] != 38 && direction[0] != 40){
					move_oneway_down(0)
					snake_head[0].style.transform = "rotate(180deg)"
				}
				if(pre_move[player][0] == 38 && direction[0] != 40 && direction[0] != 38){
					move_oneway_up(0)
					snake_head[0].style.transform = "rotate(0deg)"
				}
				pre_move[player].splice(0,1)
			}
			break;
		case 1:
			while(dir_lock[player] == true && pre_move[player][0] != null){
				if(pre_move[player][0] == 65 && direction[1] != 39 && direction[1] != 37){
					//a		
					move_oneway_left(1)
					snake_head[1].style.transform = "rotate(270deg)"
				}
				if(pre_move[player][0] == 68 && direction[1] != 37 && direction[1] != 39){
					//d
					move_oneway_right(1)
					snake_head[1].style.transform = "rotate(90deg)"
				}
				if(pre_move[player][0] == 83 && direction[1] != 38 && direction[1] != 40){
					//s
					move_oneway_down(1)
					snake_head[1].style.transform = "rotate(180deg)"
				}
				if(pre_move[player][0] == 87 && direction[1] != 40 && direction[1] != 38){
					//w
					move_oneway_up(1)
					snake_head[1].style.transform = "rotate(0deg)"
				}
				pre_move[player].splice(0,1)

			}
			break;
	
	}
}


restart()

document.getElementById('testbutton1').onclick = restart
document.getElementById('testbutton2').onclick = check_value
document.getElementById('testbutton3').onclick = creat_food

document.getElementById('testbutton4').onclick = recycle_food
document.getElementById('testbutton5').onclick = faster
document.getElementById('testbutton6').onclick = slower

// document.getElementById('testbutton7').onclick = "dead_gray(0)"
// document.getElementById('testbutton8').onclick = 

// document.getElementById('testbutton9').onclick = player2_pause