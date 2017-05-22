/*
 * @Author: qiuziz
 * @Date: 2017-05-15 16:09:17
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-22 16:08:35
 */
	$(document).ready(function(){
			$(window).load(function(){
					imgpush();
					init();
					var page = 0, end;
					window.onscroll = function(){
						
				　　if(scroll() && !end){
							end = true;// 防止多次请求
							loadMoreImg(page, function(data) {
							
								$.each(data,function(index,value){
										var box = $("<div>").addClass("box").appendTo($("#container"));
										var content = $("<div>").addClass("content").appendTo(box);
										// console.log("images/" + $(value).attr("images"));
										$("<img>").attr("src", value.images).appendTo(content);
										$("<h3>").html(value.disc || value._id).appendTo(content);
									});
									page++;
									imgpush();
									end = false;
							})
							
						}
					};
				
			});
		});

		function loadMoreImg(page, cb) {
			var path = window.location.pathname.indexOf('photo') > -1 ? '/jandan/images?page=' : '/sheen/images?page=';
			$.get(path + page, function(data) {
				cb(data);
			})
		}

		function imgpush()
		{
			var box = $(".box");
			var boxWidth = box.eq(0).width();
			var num = Math.floor(($(window).width() - $(window).width() * 0.2)/boxWidth);
			var boxArr = [];
			box.each(function(index,value){
					var boxHeight = box.eq(index).height();
					$(value).unbind('click').bind('click', function(event) {
						blowUpImg(event);
					});
					if(index < num || num < 1)
					{
						boxArr[index] = boxHeight;
					}
					else
					{
						var minboxHeight = Math.min.apply({},boxArr);
						var minboxIndex = $.inArray(minboxHeight,boxArr);
						$(value).css({
							"position":"absolute",
							"top":minboxHeight,
							"left":box.eq(minboxIndex).position().left
						})
						boxArr[minboxIndex] +=  box.eq(index).height();
					}
			});
		}

		function scroll()
		{
			// var box = $(".box");
			// var lastboxHeight = box.last().get(0).offsetTop + Math.floor(box.last().height()/2);
			// var documentHeight = $(document).width();
			// var scrollHeight = $(window).scrollTop();
			// return (lastboxHeight < scrollHeight + documentHeight) ? true : false;

			var $this = $(this),
			$document = $(document),
			scrollTop = $this.scrollTop(),
			scrollHeight = $document.height(),
			windowHeight = $this.height();
			return scrollTop + windowHeight >= (scrollHeight / 2)
		}

		function blowUpImg(event) {
			var	maxSize = {width:$(window).width()*0.8,height:$(window).height()*0.8},
					img = $(event.currentTarget).find('img'),
					imgSrc = $(event.currentTarget).find('img').attr('src'),
          scale,dim,imgWrapCss;

          scale = Math.min(maxSize.width/$(img).width(),maxSize.height/$(img).height());
          dim = 
					{
							width:$(img).width()*scale,
							height:$(img).height()*scale,
							x:($(window).width() - $(img).width()*scale)/2,
							y:($(window).height() - $(img).height()*scale)/2
					};

          imgWrapCss = {width:dim.width,height:dim.height,transform: "translate3d("+(dim.x - 20)+"px, "+dim.y+"px,0) scale(1)"};
			$('.mark').css('display', 'block');
			$('.blow-up').css('display', 'block').css(imgWrapCss);
			$('.blow-up').find("img").attr("src", imgSrc);
		}

		function init() {
			$('.mark').bind('click', function() {
				$('.mark').css('display', 'none');
				$('.blow-up').css('display', 'none');
			});

		}
