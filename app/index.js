/*
 * @Author: qiuziz
 * @Date: 2017-05-15 16:09:17
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-17 10:52:49
 */
	$(document).ready(function(){
			var $document = $(document);
			$(window).load(function(){
					imgpush();
					var page = 0, end;
					window.onscroll = function(){
				　　if(scroll() && !end){
									end = true;
							loadMoreImg(page, function(data) {
							
								$.each(data,function(index,value){
										var box = $("<div>").addClass("box").appendTo($("#container"));
										var content = $("<div>").addClass("content").appendTo(box);
										// console.log("images/" + $(value).attr("images"));
										$("<img>").attr("src", value.images).appendTo(content);
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
			$.get('/jandan/images?page=' + page, function(data) {
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
					if(index < num)
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
						});
						boxArr[minboxIndex] +=  box.eq(index).height();
					}
			});
		}

		function scroll()
		{
			var box = $(".box");
			var lastboxHeight = box.last().get(0).offsetTop + Math.floor(box.last().height()/2);
			var documentHeight = $(document).width();
			var scrollHeight = $(window).scrollTop();
			return (lastboxHeight < scrollHeight + documentHeight) ? true : false;
		}
