$(document).ready(function ()
{
	//查询按钮的事件
	$("#queryButton").click(function ()
	{
		$.post("/queryRecord/queryRecordData",
			{
				searchCondition: $("#searchCondition").val()
			},
			function (data)
			{
				//先输出上次的查询信息
				$(".queryR").remove();
				//根据查询结果填写表格
				var result = eval(data.result);//json格式参考模拟数据函数getData
				var length = result.length;
				var displayLength = 12;
				createRow(result, length, displayLength);
			}
		)
		
		//测试数据
		// $(".queryR").remove();
		//
		// var result = getData();//json格式参考模拟数据函数getData
		// var length = result.length;
		// var displayLength = 12;
		// createRow(result,length,displayLength);
	});
	
	$('#closeW').click(function ()
	{
		$('.subWindow').css('display', 'none');
	});
});

//模拟数据
function getData()
{
	var result = [];
	for (var i = 0; i < 120; i++)
	{
		result[i] = {};
		result[i].recordID = "订单号" + i;
		result[i].productID = "商品码" + i;
		result[i].time = "下单时间" + i;
		result[i].status = "订单状态" + i;
	}
	return result;
}

function createRow(result, length, displayLength)
{
	if (length > displayLength)
	{
		//先添加行
		for (var i = 0; i < displayLength; i++)
		{
			$("#queryTable").append(
				"<tr class = 'queryR' style='text-align: center'>" +
				"<td class = 'queryCol'></td>" +
				"<td class = 'queryCol'></td>" +
				"<td class = 'queryCol'></td>" +
				"<td class = 'queryCol'></td>" +
				"<td><button class = 'displayButton'>查看详细信息</button></td>" +
				"</tr>"
			);
		}
		
		//添加尾部行选择页面
		$("#queryTable").append(
			"<tr class = 'queryR' style='text-align: left'>" +
			"<td colspan='5' id = 'selectPage' >" +
			"<label id = 'lastPage'>&nbsp;&nbsp;上一页</label>" +
			"</td>" +
			"</tr>"
		);
		
		for (var j = 0; j < Math.ceil(length / displayLength); j++)
		{//页数
			$("#selectPage").append(
				"<label class = 'pageNum'></label>"
			);
			$(".pageNum:eq(" + j + ")").html("&nbsp;" + (j + 1));
		}
		
		$("#selectPage").append(
			"<label id = 'nextPage'>&nbsp;下一页</label>"
		);
		
		//尾部行css
		$("#selectPage").css({"color": "#0c1eff", "background": "#56abe4"});
		$(".pageNum,#lastPage,#nextPage").css({"cursor": "pointer"});
		
		//鼠标移动选择页面的颜色变化
		$(".pageNum").each(function (index, element)
		{
			$(element).mouseover(function ()
			{
				if (index !== parseInt($("#selectPage").attr("data-select")))
				{
					$(element).css({"color": "#ff7968"});
				}
			})
				.mouseout(function ()
				{
					if (index !== parseInt($("#selectPage").attr("data-select")))
					{
						$(element).css({"color": "#0c1eff"});
					}
				});
		});
		
		$("#lastPage,#nextPage").each(function (index, element)
		{
			$(element).mouseover(function ()
			{
				$(element).css({"color": "#ff7968"});
			})
				.mouseout(function ()
				{
					$(element).css({"color": "#0c1eff"});
				});
		});
		
		//选择页面数字的点击事件注册（根据事件显示不同页数据）
		$(".pageNum").each(function (index, element)
		{
			$(element).click(function ()
			{
				//显示数据
				for (var i = 0; i < displayLength; i++)
				{
					if (i + index * displayLength < length)
					{
						$(".queryCol:eq(" + (i * 4) + ")").html(result[i + index * displayLength].recordID);
						$(".queryCol:eq(" + (i * 4 + 1) + ")").html(result[i + index * displayLength].productID);
						$(".queryCol:eq(" + (i * 4 + 2) + ")").html(result[i + index * displayLength].time);
						$(".queryCol:eq(" + (i * 4 + 3) + ")").html(result[i + index * displayLength].status);
						
						$(".displayButton:eq(" + (i) + ")").attr("data-recordID", result[i + index * displayLength].recordID)
							.css("display", '');
					}
					else
					{
						$(".queryCol:eq(" + (i * 4) + ")").html("");
						$(".queryCol:eq(" + (i * 4 + 1) + ")").html("");
						$(".queryCol:eq(" + (i * 4 + 2) + ")").html("");
						$(".queryCol:eq(" + (i * 4 + 3) + ")").html("");
						$(".displayButton:eq(" + (i) + ")").css("display", "none");
					}
				}
				//颜色变化以及选中页的标记
				$(".pageNum:not(element)").css("color", "#0c1eff");
				$(element).css("color", "#ff442c");
				$("#selectPage").attr("data-select", index);
			});
		});
		
		//默认选择第一页
		$(".pageNum:eq(0)").click();
		
		//上一页，下一页事件
		$("#lastPage").click(function ()
		{
			var index = parseInt($("#selectPage").attr("data-select"));//当前页的索引
			if (index > 0)
			{
				$(".pageNum:eq(" + (index - 1) + ")").click();
			}
		});
		
		$("#nextPage").click(function ()
		{
			var index = parseInt($("#selectPage").attr("data-select"));//当前页的索引
			if (index < Math.ceil(length / displayLength))
			{
				$(".pageNum:eq(" + (index + 1) + ")").click();
			}
		});
	}
	else
	{
		for (var i = 0; i < length; i++)
		{
			$("#queryTable").append(
				"<tr class = 'queryR' style='text-align: center'>" +
				"<td class = 'queryCol'></td>" +
				"<td class = 'queryCol'></td>" +
				"<td class = 'queryCol'></td>" +
				"<td class = 'queryCol'></td>" +
				"<td><button class = 'displayButton'>查看详细信息</button></td>" +
				"</tr>"
			);
			$(".queryCol:eq(" + (i * 4) + ")").html(result[i].recordID);
			$(".queryCol:eq(" + (i * 4 + 1) + ")").html(result[i].productID);
			$(".queryCol:eq(" + (i * 4 + 2) + ")").html(result[i].time);
			$(".queryCol:eq(" + (i * 4 + 3) + ")").html(result[i].status);
			$(".displayButton:eq(" + (i) + ")").attr("data-recordID", result[i].recordID);
		}
	}
	addDisplayEvent();//为查看详细信息添加事件
}

//为查看详细信息添加事件
function addDisplayEvent()
{
	$(".displayButton").each(function (index, element)
	{
		$(element).click(function ()
		{
			$(".subWindow").css("display", "block");
			//设置属性------post请求
			$.post("/queryRecord/recordDetail",
				{
					acc: $(element).attr("data-recordID")
				},
				function (data)
				{
					// $("#photo").attr("src",data.photo);
					// $("#studentCard").attr("src",data.studentCard);
					// $("#acc").val(data.acc);
					// $("#nickname").val(data.nickname);
					// $("#credit").val(data.credit);
					// $("#name").val(data.name);
					// $("#sex").val(data.sex);
					// $("#college").val(data.college);
					// $("#studentID").val(data.studentID);
					$("#recordID").text(data.recordID);
					$("#productID").text(data.productID);
					$("#seller").text(data.seller);
					$("#buyer").text(data.buyer);
					$("#time").text(data.time);
					$("#status").text(data.status);
					$("#sellerMark").text(data.sellerMark);
					$("#buyerMark").text(data.buyerMark);
				}
			);
		});
	});
}
