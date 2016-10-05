/*
 부분적인 작업이 필요하고.. 다 완료후.
 돌을 놓는 함수를 다 만드는게 필요.
 이 안엔 스코어의 변경과 정보 변화 및 시각적으로 보이는 돌의 위치나 땅의 이미지 변화 필요. 또한 canvas에 이벤트 등록 필요.
 그럼.. 끝!
*/


function eventfun() { 

	var undefined;
	
	/*초기화 부분*/
	var player_add = document.getElementById('player_add');
	var strat = document.getElementById('strat');
	var reset = document.getElementById('reset_button');
	var playeres = document.getElementById('playeres');
	var delet = document.getElementById('delet');
	var loading = document.getElementById('loading');
	var loading_view = document.getElementById('loading_view');
	var playing = document.getElementById('playing');
	var settingdiv = document.getElementById('setting');
	var line_range = document.getElementById('line_range');
	var result_view = document.getElementById('result_view');
	
	var player_num=2; //플레이어 수
	var player_num_temp; //플레이어 수 임시저장소
	
	var turn_num=1; //현제 턴 플레이어
	var saveImageData; 
	var saveImageDataTemp;

	var num;
	var len;
	var board_postion_=50; //보드 판 간격 상수값
	var range_value_=3; //돌 허용 길이 범위

	var canvas = document.getElementById('borad');
	var ctx = canvas.getContext("2d");

	var player_num_limt=4; //플레이어최대값
	var temp=0; //임시변수값
	var temp2=0; //임시변수값2

	var player_color;//플레이어 컬러 배열저장소
	var player_line;//플레이어 라인 배열저장소
	var player_score;

	

	//이벤트 등록
	Handler.add(player_add,'click',playerAdd);
	Handler.add(delet,'click',playerDelet);
	Handler.add(strat,'click',StratFun);
	Handler.add(reset,'click',ResetFun);
	Handler.add(canvas,'click',spotSet);
	Handler.add(canvas,'mousemove',spotIndication);
	Handler.add(line_range,'mousemove',lineRangeView);

	//함수 등록

	function ResetFun(){
		alert('기능구현중..');
		alert('하지만 귀차니즘');
	}
	/*플레이어 추가함수*/
	function playerAdd(){
		var addplayer_dom; //플레이어 추가 dom
		//alert('????');
		player_num++;
		
		addplayer_dom = make('input', {type:'color', id:'player_'+player_num, value: player_num==3 ? '#22b14c' : '#000000'})
		delet.className = 'defalut';
		playeres.insertBefore(addplayer_dom, delet);
		if(player_num==player_num_limt)
			playerAdd.className = 'none';
	}

	/*플레이어제거함수*/
	function playerDelet() {
		if(playerAdd.className != 'defalut')
			playerAdd.className = 'defalut';
		playeres.removeChild(document.getElementById('player_'+player_num_limt));
		player_num--;
		if(player_num==2)
			delet.className = 'none';
	}
	
	/*게임시작함수*/
	function StratFun() {
		Handler.remove(player_add,'click',playerAdd);
		Handler.remove(delet,'click',playerDelet);
		Handler.remove(strat,'click',StratFun);

		range_value_=line_range.value;
		player_num = Number(player_num);
		player_color = new Array(player_num+1);
		player_line = new Array(player_num+1);
		player_score = new Array(player_num+1);
		player_line[0] = null;
		player_color[0] = null;
		player_score[0] = null;
		for(temp=1 ; player_num>=temp ; temp++) {
			player_color[temp] = document.getElementById('player_'+temp).value;
			player_line[temp] = 'line_'+temp;
			player_score[temp] = 0;
		}
		loading.className = 'defalut';
		settingdiv.className = 'none';
		player_num_temp = player_num; //첫번째 돌들을 놓기 위한 값 초기화. Scaning 함수에서만 쓰인다.
		//alert(player_num);
		
		
		//보드를 그린다.
		board_num = document.getElementById('num').value;
		temp=board_num;
		
		ctx.strokeStyle = '#c3c3c3';
		board_postion_ = Number(board_postion_);
		for(num=0, len=temp*50-50 ; temp>0 ; temp-- , num+=50) {
			num = Number(num);
			len = Number(len);
			ctx.moveTo(board_postion_+num,board_postion_+0); 
			
			ctx.lineTo(board_postion_+num,board_postion_+len);
			
			ctx.stroke();
			
			ctx.moveTo(board_postion_+0,board_postion_+num);
			
			ctx.lineTo(board_postion_+len,board_postion_+num);

			ctx.stroke();
			loading_view.value= (board_num-temp)/board_num;
			delay(1);
			
			
		}
		ctx.closePath();
		saveImageData = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);

		veiwScore();

		board_num = Number(board_num);

		//map_~~ 배열들 초기화. 첨부된 이미지 참고.
		//alert('board_num :'+board_num);
		map_heigth = new Array(board_num+1);
		for(temp=1 ; board_num+1>temp ; temp++){
			map_heigth[temp] = new Array(board_num);
			for(temp2=1 ; board_num>temp2 ; temp2++)
				map_heigth[temp][temp2] = 'empty';
		}
		

		map_width = new Array(board_num);
		for(temp=1 ; board_num>=temp ; temp++){
			map_width[temp] = new Array(board_num+1);
			for(temp2=1 ; board_num+1>temp2 ; temp2++)
				map_width[temp][temp2] = 'empty';
		}
		
		map_spot = new Array(board_num+1);
		for(temp=1 ; board_num+1>=temp ; temp++){
			map_spot[temp] = new Array(board_num+1);
			for(temp2=1 ; board_num+1>temp2 ; temp2++)
				map_spot[temp][temp2] = 'empty';
		}

		map_area = new Array(board_num);
		for(temp=1 ; board_num>temp ; temp++){
			map_area[temp] = new Array(board_num);
			for(temp2=1 ; board_num>temp2 ; temp2++)
				map_area[temp][temp2] = 'empty';
		}

		temp_area = new Array(board_num);
		for(temp=1 ; board_num>temp ; temp++){
			map_area[temp] = new Array(board_num);
			for(temp2=1 ; board_num>temp2 ; temp2++)
				map_area[temp][temp2] = 'empty';
		}

		//배열 초기화 완료.

		veiwScore();

		loading.className = 'none';
		playing.className = 'defalut';
	}
	function setting(x,y,player_nums) {
		Handler.remove(canvas,'click',spotSet);
		Handler.remove(canvas,'mousemove',spotIndication);
		//alert(map_spot[x][y]);
		loading.className = 'defalut';

		var temp_spot_postion=0; //포인트 임시저장변수
		
		if(Scaning(x,y,player_nums)==false){
			Handler.add(canvas,'click',spotSet);
			Handler.add(canvas,'mousemove',spotIndication);
			return false;
		}
			
		//alert(player_color[player_nums]+', '+player_nums);
		ctx.beginPath();
		ctx.putImageData(saveImageData, board_postion_-20, board_postion_-20);
		ctx.fillStyle = player_color[player_nums];
		ctx.strokeStyle = player_color[player_nums];
		ctx.moveTo(x*board_postion_ , y*board_postion_);
		ctx.arc(x*board_postion_ , y*board_postion_,13,0,380*Math.PI/180,false);
		ctx.fill();
		ctx.closePath();

		saveImageData = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);
		
		if(map_spot[x][y]=='line') {
			//alert('이상하다');
			while(true){
				if(x-1!=0)
					if(map_width[x-1][y] == player_line[player_nums]) break;
				if(x!=document.getElementById('num').value)
					if(map_width[x][y] == player_line[player_nums]) break;
				if(y-1!=0)
					if(map_heigth[x][y-1] ==player_line[player_nums]) break;
				if(y!=document.getElementById('num').value)
					if(map_heigth[x][y] == player_line[player_nums]) break;

				saveImageData = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);
				
				
				ctx.beginPath();
				ctx.putImageData(saveImageData, board_postion_-20, board_postion_-20);
				ctx.moveTo(x*board_postion_ , y*board_postion_);
				ctx.arc(x*board_postion_ , y*board_postion_,15,0,360*Math.PI/180,false);
				ctx.stroke();
				ctx.closePath();
				
				saveImageDataTemp = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);
				
				
				
				loading.className = 'none';
				playing.className = 'defalut';
				
				player_num_temp--;

				map_spot[x][y]=null;

				
				Handler.add(canvas,'click',spotSet);
				Handler.add(canvas,'mousemove',spotIndication);

				return true;
			}
		}
		loading_view.value= 0.1;

		map_spot[x][y]=player_color[player_nums];

		ctx.beginPath();
		ctx.putImageData(saveImageData, board_postion_-20, board_postion_-20);
		ctx.strokeStyle = player_color[player_nums];

		x=Number(x);
		temp_spot_postion=x+1;
		lineScaning1:
		for( ; map_spot[temp_spot_postion]!=undefined ; temp_spot_postion++) {
			if(map_spot[temp_spot_postion][y]=='empty') continue lineScaning1; //빈 점일시 다음단계로
			if(map_spot[temp_spot_postion][y]!=player_color[player_nums] || map_spot[temp_spot_postion][y]=='line') break lineScaning1; // 다른사람 점도 아니고, 선도 아닐시 진행. 맞으면 break
			//alert(temp_spot_postion+', y:'+y+', x:'+x);
			ctx.moveTo(x*board_postion_ , y*board_postion_);
			ctx.lineTo(temp_spot_postion*board_postion_ , y*board_postion_);
			ctx.stroke();
			map_width[temp_spot_postion-1][y]=player_line[player_nums];
			for(temp_spot_postion--; temp_spot_postion>x ; temp_spot_postion--){
				map_spot[temp_spot_postion][y]='line';
				map_width[temp_spot_postion-1][y]=player_line[player_nums];
			}
			break lineScaning1;
		}
		
		temp_spot_postion=x-1;
		lineScaning2:
		for( ; map_spot[temp_spot_postion]!=undefined ; temp_spot_postion--) {
			if(map_spot[temp_spot_postion][y]=='empty') continue lineScaning2;
			if(map_spot[temp_spot_postion][y]!=player_color[player_nums] || map_spot[temp_spot_postion][y]=='line') break lineScaning2;
			//alert(temp_spot_postion+', y:'+y+', x:'+x);
			ctx.moveTo(x*board_postion_ , y*board_postion_);
			ctx.lineTo(temp_spot_postion*board_postion_ , y*board_postion_);
			ctx.stroke();
			map_width[temp_spot_postion][y]=player_line[player_nums];
			for(temp_spot_postion++; temp_spot_postion<x ; temp_spot_postion++){
				map_spot[temp_spot_postion][y]='line';
				map_width[temp_spot_postion][y]=player_line[player_nums];
			}
			break lineScaning2;
		}
		
		y=Number(y);
		temp_spot_postion=y+1;
		lineScaning3:
		for( ; map_spot[x][temp_spot_postion]!=undefined ; temp_spot_postion++) {
			if(map_spot[x][temp_spot_postion]=='empty') continue lineScaning3;
			if(map_spot[x][temp_spot_postion]!=player_color[player_nums] || map_spot[x][temp_spot_postion]=='line') break lineScaning3;
			//alert(temp_spot_postion+', y:'+y+', x:'+x);
			ctx.moveTo(x*board_postion_ , y*board_postion_);
			ctx.lineTo(x*board_postion_ , temp_spot_postion*board_postion_);
			ctx.stroke();
			map_heigth[x][temp_spot_postion-1]=player_line[player_nums];
			for(temp_spot_postion--; temp_spot_postion>y ; temp_spot_postion--){
				map_spot[x][temp_spot_postion]='line';
				map_heigth[x][temp_spot_postion-1]=player_line[player_nums];
			}
			break lineScaning3;
		}
		temp_spot_postion=y-1;
		lineScaning4:
		for( ; map_spot[x][temp_spot_postion]!=undefined ; temp_spot_postion--) {
			if(map_spot[x][temp_spot_postion]=='empty') continue lineScaning4;
			if(map_spot[x][temp_spot_postion]!=player_color[player_nums] || map_spot[x][temp_spot_postion]=='line') break lineScaning4;
			//alert(temp_spot_postion+', y:'+y+', x:'+x);
			ctx.moveTo(x*board_postion_ , y*board_postion_);
			ctx.lineTo(x*board_postion_ , temp_spot_postion*board_postion_);
			ctx.stroke();
			map_heigth[x][temp_spot_postion]=player_line[player_nums];
			for(temp_spot_postion++; temp_spot_postion<y ; temp_spot_postion++){
				map_spot[x][temp_spot_postion]='line';
				map_heigth[x][temp_spot_postion]=player_line[player_nums];
			}
			break lineScaning4;
		}

		saveImageData = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);

		/*면 색칠 시작*/
		//alert('x: '+x+', y: '+y);

		
		
		areaScaning(x,y,player_nums);
		areaScaning(x-1,y,player_nums);
		areaScaning(x,y-1,player_nums);
		areaScaning(x-1,y-1,player_nums);
		
		for(temp=1 ; map_area.length>temp ; temp++) {
			for(temp2=1 ; map_area[temp].length>temp2 ; temp2++) {
				if(map_area[temp][temp2]==player_color[player_nums])
					drawArea(temp,temp2,player_nums);
			}
		}


		
		saveImageData = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);
		/*면 색칠의 끝*/

		
		ctx.beginPath();
		ctx.putImageData(saveImageData, board_postion_-20, board_postion_-20);
		ctx.moveTo(x*board_postion_ , y*board_postion_);
		ctx.arc(x*board_postion_ , y*board_postion_,15,0,360*Math.PI/180,false);
		ctx.stroke();
		ctx.closePath();

		saveImageDataTemp = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);

		loading_view.value= 1;
		
		loading.className = 'none';
		

		player_num_temp--;

		//alert(player_score[turn_num]);
		veiwScore();
		saveImageData = ctx.getImageData(board_postion_-20 , board_postion_-20 , document.getElementById('num').value*50+40 , document.getElementById('num').value*50+40);

		
		Handler.add(canvas,'click',spotSet);
		Handler.add(canvas,'mousemove',spotIndication);
	
		return true;
	}
	function spotSet(e) {
		
		
		var click_x_postion = Math.round((e.offsetX)/50);
		var click_y_postion = Math.round((e.offsetY)/50);
	
		if(setting(click_x_postion, click_y_postion,turn_num)) {
			if(turn_num==player_num)
				turn_num=1;
			else
				turn_num++;
		}
		
	}

	function spotIndication(e) {
		
		var over_x_postion = Math.round((e.offsetX)/50);
		var over_y_postion = Math.round((e.offsetY)/50);

		if(Scaning(over_x_postion,over_y_postion,turn_num)==false)
			return false;

		ctx.beginPath();
		if(saveImageDataTemp!=undefined)
			ctx.putImageData(saveImageDataTemp, board_postion_-20, board_postion_-20);
		else
			ctx.putImageData(saveImageData, board_postion_-20, board_postion_-20);

		ctx.fillStyle = player_color[turn_num];
		ctx.strokeStyle = player_color[turn_num];
		ctx.moveTo(over_x_postion*board_postion_ , over_y_postion*board_postion_);
		ctx.arc(over_x_postion*board_postion_ , over_y_postion*board_postion_,10,0,380*Math.PI/180,false);
		ctx.fill();
		ctx.closePath();
	}

	function Scaning(scan_x,scan_y,turn) {
		if (map_spot[scan_x] ==null || map_spot[scan_x][scan_y]==null || (map_spot[scan_x][scan_y]!='empty' && map_spot[scan_x][scan_y]!='line') || scan_x>board_num || scan_y>board_num) return false;
		if(player_num_temp<=0) {
			range_value_ = Number(range_value_);
			temp = Number(temp);
			scan_x = Number(scan_x);
			scan_y = Number(scan_y);
			temp=range_value_+1;
			rangeScaning:
			while (true) {
				temp--;
				if (temp==0) continue rangeScaning;
				if ((map_spot[scan_x][scan_y+temp]!=undefined && map_spot[scan_x][scan_y+temp]==player_color[turn]) || (map_spot[scan_x+temp]!=undefined && map_spot[scan_x+temp][scan_y]==player_color[turn]) || (map_spot[scan_x+temp] != undefined && map_spot[scan_x+temp][scan_y+temp] != undefined && map_spot[scan_x+temp][scan_y+temp]==player_color[turn]) || (map_spot[scan_x+temp] != undefined && map_spot[scan_x+temp][scan_y-temp] != undefined && map_spot[scan_x+temp][scan_y-temp]==player_color[turn])) break rangeScaning;
				if (temp == -1*range_value_) return false;
			}
		} 
		return true;
	}
	
	/*구상.
	임시저장소에 저장될 값들.
	>> undefined(null), 플레이어수만큼 면의 값, empty
	4구분을 따로 검사.
	1. empty가 맞느냐? 아니면 false 맞으면 진행
	2. 기존 면 값을 임시저장소에 저장.
	3. 임시저장소를 사용하여 면을 채워 나가기 시작.
	3-1.정면이 undefined냐? 또는 empty가 아니냐? 그럼 gg 아니면 자신의 선이 가로막지 않았느냐? 막았으면 다음단계로. 이것도 저것도 아니면 전에 있던 면값을 자기 면으로 채우고 앞으로 가고 3-1 처음부터 시작.
	...
	3-4 ...
	3-4까지 다 돌아버렸느냐?(맞는게 없었냐?) 그럼 기존 면값과 임시저장소를 비교하여
	추가된 자신의 면을 채운다. 자신의 면을 채우는 조건이 충족시 효과를 위해 딜레이를 주자.(점점 빨라지는)
	*/
	function areaScaning(scan_x,scan_y,turn) {
		var temp_save_areaX = new Array();
		var temp_save_areaY = new Array();
		scan_x = Number(scan_x);
		scan_y = Number(scan_y);
		turn = Number(turn);

		//alert('map_area[scan_x][scan_y]: '+map_area[scan_x][scan_y])
		if(map_area[scan_x] ==undefined || map_area[scan_x][scan_y]==undefined ||  map_area[scan_x][scan_y]!='empty') {
			//if(map_area[scan_x][scan_y]!='area') //아래 areaScaning을 다시 불러올때를 위한 조건문
				return false;
		}

		//if(map_area[scan_x][scan_y]!='area') { //setting함수에서 areaScaning을 불러올때 조건문
			temp_save_areaX.push(scan_x);
			temp_save_areaY.push(scan_y);
			map_area[scan_x][scan_y]=player_color[turn];
		//}

		

		do{
			//fornt
			//alert('앞: '+map_width[scan_x][scan_y]);
			for(temp=0; !(map_width[scan_x][scan_y]==player_line[turn] || (map_area[scan_x]!=undefined && map_area[scan_x][scan_y-1]!=undefined && map_area[scan_x][scan_y-1]==player_color[turn])) ;scan_y--){
				if(map_area[scan_x]==undefined || map_area[scan_x][scan_y-1]==undefined || map_area[scan_x][scan_y-1]!='empty') {
					while(temp_save_areaX.length!=0)
						map_area[temp_save_areaX.pop()][temp_save_areaY.pop()] = 'empty';
					return false;
				}
			//	alert('앞');
				temp_save_areaX.push(scan_x);
				temp_save_areaY.push(scan_y-1);
				temp++;
				map_area[scan_x][scan_y-1]=player_color[turn];
			}
			//back
			//alert('뒤: '+map_width[scan_x][scan_y+1]);
			for(;!(map_width[scan_x][scan_y+1]==player_line[turn] ||(map_area[scan_x]!=undefined && map_area[scan_x][scan_y+1]!=undefined && map_area[scan_x][scan_y+1]==player_color[turn]));scan_y++){
				if(map_area[scan_x]==undefined || map_area[scan_x][scan_y+1]==undefined || map_area[scan_x][scan_y+1]!='empty' ) {
					while(temp_save_areaX.length!=0)
						map_area[temp_save_areaX.pop()][temp_save_areaY.pop()] = 'empty';
					return false;
				}
				//alert('뒤');
				temp_save_areaX.push(scan_x);
				temp_save_areaY.push(scan_y+1);
				temp++;
				map_area[scan_x][scan_y+1]=player_color[turn];
			}
			//right
			//alert('왼 :'+map_heigth[scan_x][scan_y]);
			for(;!(map_heigth[scan_x][scan_y]==player_line[turn] ||(map_area[scan_x-1]!=undefined && map_area[scan_x-1][scan_y]!=undefined && map_area[scan_x-1][scan_y]==player_color[turn]));scan_x--){
				if(map_area[scan_x-1]==undefined || map_area[scan_x-1][scan_y]==undefined || map_area[scan_x-1][scan_y]!='empty' ) {
					while(temp_save_areaX.length!=0)
						map_area[temp_save_areaX.pop()][temp_save_areaY.pop()] = 'empty';
					return false;
				}
				//alert('왼쪽');
				temp_save_areaX.push(scan_x-1);
				temp_save_areaY.push(scan_y);
				temp++;
				map_area[scan_x-1][scan_y]=player_color[turn];
			}
			//left
			//alert('오른 :'+map_heigth[scan_x+1][scan_y]);
			for(;!(map_heigth[scan_x+1][scan_y]==player_line[turn] ||(map_area[scan_x+1]!=undefined && map_area[scan_x+1][scan_y]!=undefined && map_area[scan_x+1][scan_y]==player_color[turn]));scan_x++){
				//alert('1')
				if(map_area[scan_x+1]==undefined || map_area[scan_x+1][scan_y]==undefined || map_area[scan_x+1][scan_y]!='empty' ) {
					//alert('2');
					while(temp_save_areaX.length!=0)
						map_area[temp_save_areaX.pop()][temp_save_areaY.pop()] = 'empty';
					return false;
				}
				//alert('오른쪽');
				temp_save_areaX.push(scan_x+1);
				temp_save_areaY.push(scan_y);
				temp++;
				map_area[scan_x+1][scan_y]=player_color[turn];
			}
			//alert('temp: '+temp);
		} while(temp>0);
		//alert('찾았엉');
		//alert('갯수!: '+temp_save_areaX.length);
		for(var area_len =0 ; temp_save_areaX.length>area_len ; area_len++) {
			if(temp_save_areaX.length == 1){
				return true;
			//	drawArea(temp_save_areaX.pop(),temp_save_areaY.pop(),turn);
			}else{
				//areaScaning(scan_x,scan_y,turn);
				//map_area[temp_save_areaX[temp_save_areaX.length-1]][temp_save_areaY[temp_save_areaY.length-1]]='empty';
				//alert(area_len);
				map_area[temp_save_areaX[area_len]][temp_save_areaY[area_len]]='empty';
				if(!(areaScaning(temp_save_areaX[area_len],temp_save_areaY[area_len],turn))){
					while(temp_save_areaX.length!=0)
						map_area[temp_save_areaX.pop()][temp_save_areaY.pop()] = 'empty';
					return false;
				}
			}
		}
		//drawArea(temp_save_areaX.pop(),temp_save_areaY.pop(),turn);
		return true;
	}


	function lineRangeView(){
		document.getElementById('line_range_value').value=line_range.value;
	}
	
	function drawArea(draw_x,draw_y,turn) {
		var scan_area = ctx.getImageData((draw_x*board_postion_)+Math.abs(board_postion_/4),(draw_y*board_postion_)+Math.abs(board_postion_/4),+Math.abs(board_postion_/4),+Math.abs(board_postion_/4));
		if(map_area[draw_x][draw_y]==player_color[turn] && scan_area.data[0]==0 && scan_area.data[1]==0 && scan_area.data[2]==0 ){
			ctx.strokeStyle = player_color[turn];
			ctx.moveTo(draw_x*board_postion_,draw_y*board_postion_);
			ctx.fillRect(draw_x*board_postion_,draw_y*board_postion_,board_postion_,board_postion_);
			player_score[turn]++;
			map_area[draw_x][draw_y] = player_color[turn];
		}
	}

	function veiwScore() {
		//점수판을 그린다.
		//원을 중심으로처음 20의 여백을 두고 사이 간격을 150픽셀로 한다.

		var scoreImageData;

		for(temp=1 ; player_num>=temp ; temp++) {
			ctx.beginPath();
			ctx.clearRect(0, 0, 20+player_num*150+150 , board_postion_-1);
			if(scoreImageData!=undefined)
				ctx.putImageData(scoreImageData, 0, 0);
			ctx.fillStyle = player_color[temp];
			ctx.strokeStyle = '#fff200'
			moveTo(20+150*temp,25);
			ctx.arc(20+150*temp , 25,13,0,380*Math.PI/180,false);
			ctx.textBaseline = 'middle';
			ctx.font = '20px';
			ctx.fillText(player_score[temp], 20+150*temp+15, 25);
			ctx.fill();
			scoreImageData = ctx.getImageData(0, 0, 20+player_num*150+150 , board_postion_-1);
		}
		ctx.putImageData(scoreImageData, 0, 0);
	}

}
window.onload=eventfun;