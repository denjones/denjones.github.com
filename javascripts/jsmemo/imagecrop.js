/*
 * @file jQuery 截图插件测试文件
 * @author Kenneth.J
 * Date: 2013-08-14
 */

(function($) 
{	
	$(function()
	{
		// 定义一个回调函数，用于将截取结果显示在crop层中
		var callback = function (img, rect) {};
		
		// 使用默认参数并使用回调函数获取一个截图对象
		var imageCrop = $('#photo').imagecrop({'blur': true}, callback);
		
		// 定义一个图片对象并读取图片
		var imgObj = new Image();
		$(imgObj).attr('src', '../../../../../../images/scene.jpg');
		
		// 使用截图对象载入该图片
		imageCrop.load(imgObj);
	});
}(jQuery));
