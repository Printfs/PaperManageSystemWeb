(function ($) {
	"use strict";
	getData();
	loginControl();
	inputControl();

	function inputControl() {
		// 获得焦点
		$('.form-group input').focus(function() {
			$(this).siblings('label').hide();
			$(this).siblings('span.cover').hide();
			$('.error').hide();
		})
		// 失去焦点
		$('.form-group input').blur(function() {
			$(this).siblings('label').show();
			$(this).siblings('span.cover').show();
			if ($(this).val() != "") {
				$(this).siblings('label').hide();
				$(this).siblings('span.cover').hide();
			}
		});
		$('.loginBtn').on('click', coverControl);
	}

	function coverControl() {
		var studentNum = $('.form-group input#studentNum');
		var password = $('.form-group input#password');
		if (studentNum.val() == "") {
			studentNum.siblings('span.cover').show();
		}
		if (password.val() == "") {
			password.siblings('span.cover').show();
		}
	}

	function loginControl() {
		$('.loginBtn').on('click', function() {
			var studentNum = $('#studentNum').val();
			var password = $('#password').val();

			$.ajax({
				url: 'http://localhost:8023/stu/login',
				type: 'POST',
				data: $.param({
					studNumber: studentNum,
					studPassword: password
				}),
				success: function(respone) {
					if (respone.status == 0) { //登录成功
						if (respone != "") {
							localStorage.setItem('data', JSON.stringify(respone.data));
						}
					} else if (respone.status == 1 && $('.form-group input#studentNum').val != "" && $(
							'.form-group input#password').val() != "") { //登录失败
							$('.error').text(respone.msg);
						$('.error').show();
					}
				},
				error: function(err) {
					console.log(err);
				}
			})
		})
	}

	// http://localhost:8023/notic/list
	function getData() {
		$.ajax({
			url: "http://localhost:8023/notic/list",
			type: "GET",
			success: function (respons) {
				if (respons != "") {
					// msg

					msgControl(respons);
					rendePage(respons);
					pageControl(respons);
				}
			},
			error: function () {
				console.log('err')
			}
		})
	}

	function msgControl(respons) {
		if (respons.status == 1) {
			$('.newList .msg').text(respons.data.msg);
		} else if (respons.status == '0') {
			console.log("正确");
		} else {
			return;
		}
	}

	function rendePage(respons, pageSize) {
		var pageSize = respons.data.pageSize;
		// 默认一页多少条
		$('.showSection').hide().find('.show').remove();
		for (var i = 0; i < pageSize; i++) {
			var $clone = $('.tpl').clone().removeClass('tpl').addClass('show');
			var ele = respons.data.list[i];
			$clone.find('span.title').text(ele.title).next().text(ele.publisher).next().text(ele.publishtime);
			$('.showSection').append($clone);
			$('.showSection').fadeIn(); //淡入淡出
		}
	}

	function pageControl(respons) {
		var Opage = respons.data.pageNum;
		var temp=respons.data.pages;
		$('span.page.reduce').on('click', function () {
			if(Opage > 1) {
				Opage --;
				$('span.page.add').removeClass('zero');
				if (Opage == 1) {
					$(this).addClass('zero');
				} 
				pageGetData(Opage);
			}
			
		});
		$('span.page.add').on('click', function () {
			
			if (Opage < temp) {
				Opage++;
				$('span.page.reduce').removeClass('zero');
				pageGetData(Opage);
			}
			$('span.page.add').addClass('zero');
// 			if(Opage == temp){
// 				$(this).addClass('zero');
// 			}
		})
	}

	function pageGetData(pageNum) {
		console.log(pageNum)
		$.ajax({
			url: "http://localhost:8023/notic/list",
			type: "GET",
			data: {
				pageNum: pageNum
			},
			success: function (respone) {
				// console.log("cheng");
				if (respone != "") {
					// console.log(pageNum)
					if (pageNum >= respone.pageNum) {
						$('span.page.add').addClass('zero');
					}
					// else if(pageNum == 1){
					// 	$('span.page.add').removeClass('zero');
					// 	rendePage(respone);
					// }else {
					//     rendePage(respone);
					// }
					rendePage(respone);
				}
			},
			error: function (err) {
				console.log(err);
			}
		})
	}

})(window.jQuery);
