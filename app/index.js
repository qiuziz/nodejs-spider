/*
 * @Author: qiuziz
 * @Date: 2017-05-15 16:09:17
 * @Last Modified by: qiuziz
 * @Last Modified time: 2017-05-16 16:09:12
 */

	$(document).ready(function(){
			var $document = $(document);
			$(window).load(function(){
					// imgpush();
					var page = 0;
					window.onscroll = function(){
						var $this = $(this),
            scrollTop = $this.scrollTop(),
            scrollHeight = $document.height(),
            windowHeight = $this.height();
				　　if(scrollTop + windowHeight >= scrollHeight){
							loadMoreImg(page, function(data) {
							
								$.each(data,function(index,value){
										var box = $("<div>").addClass("box").appendTo($("#container"));
										// console.log("images/" + $(value).attr("images"));
										$("<img>").attr("src", value.images).appendTo(box);
									});
									// imgpush();
									page++;
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
			var num = Math.floor($(window).width()/boxWidth);
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
						// console.log(minboxIndex);
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
		}2
