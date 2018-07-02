


	$.fn.barrage = function(opt){

		var _self = $(this);

	
        var count=0;
		var settings = $.extend({},opt); //合并参数
		var M = {},Obj = {}; 
		Obj.data = settings.data;
		M.vertical = settings.direction.split(/\s+/)[0]; //纵向
		M.horizontal = settings.direction.split(/\s+/)[1]; //横向
		M.bgColors = ['#edbccc','#edbce7','#c092e4','#9b92e4','#92bae4','#92d9e4','#92e4bc','#a9e492','#d9e492','#e4c892']; //随机背景色数组
		Obj.arrEle = []; //预计存储dom集合数组
		M.barrageBox = $('<div id="barrage" style="z-index:999;max-width:100%;position:'+settings.position+';'+M.vertical+':0;"></div>'); //存所有弹幕的盒子
		M.timer = null; 
		var createView = function(){
			
			var randomIndex = Math.floor(Math.random() * M.bgColors.length);
			var words=Obj.data[0].text.toString();
			var re = new RegExp("\.{1,16}","g");
			ma = words.match(re);
			
			words=ma.join("</br>");//最后面不要"a" 就去掉( + "a")
			var ele = $('<div class="overflow-text"  style="opacity:0.7;word-break:break-all;word-wrap:break-word;text-align:left;float:left;background-color:'+M.bgColors[randomIndex]+'"; href="'+(Obj.data[0].href ? Obj.data[0].href : "javascript:;")+'">'+words+'</div>');
		    ele.currentC=ma.length;
			count+=ma.length;
			var str = Obj.data.shift();
			if(M.vertical  == 'top'){
				ele.animate({
					'opacity' : 0.7,
					'margin-top' : settings.gap,
				},1000)
				M.barrageBox.prepend(ele);
			}else{
				ele.animate({
					'opacity' :0.7,
					'margin-bottom' : settings.gap,
				},1000)
				M.barrageBox.append(ele);
			}
			Obj.data.push(str);

			if(count > settings.row){

				M.barrageBox.children().eq(0).animate({
					'opacity' : 0,
				},300,function(){
					count-$(this).currentC;
					$(this).css({
						'margin' : 0,
					}).remove();
				})
			}
		}
		M.mouseClose = function(){
			settings.ismoseoverclose && (function(){

				M.barrageBox.mouseover(function(){
					clearInterval(M.timer);
					M.timer = null;
				}).mouseout(function(){
					M.timer = setInterval(function(){ //循环
						createView();
					},settings.time)
				})

			})()
		}
		Obj.close = function(){
			M.barrageBox.remove();
			clearInterval(M.timer);
			M.timer = null;
		}
		Obj.start = function(){
			if(M.timer) return;
			_self.append(M.barrageBox); //把弹幕盒子放到页面中
			createView(); //创建试图并开始动画
			M.timer = setInterval(function(){ //循环
				createView();
			},settings.time)
			M.mouseClose();
		}
		
		return Obj;
	}

