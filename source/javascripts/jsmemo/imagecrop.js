/*
 * @file jQuery 截图插件测试文件
 * @author Kenneth.J
 * Date: 2013-08-14
 */

(function($) 
{	
	$(function()
	{
		// 使用默认参数并使用回调函数获取一个截图对象
		var imageCrop = $('#photo').imagecrop({'blur': true});
		var imageCrop2 = $('#photo2').imagecrop({
			'blur': false, 
			'seprateEffect': false,
			'defaultCropClass': 'image-crop-selection-box2',
		});
		var imageCrop3 = $('#photo3').imagecrop({
			'blur': false, 
			'seprateEffect': false,
		});
		
		// 定义一个图片对象并读取图片
		var imgObj = $('#scene').remove()[0];
		var imgObj2 = $('#scene2').remove()[0];
		var imgObj3 = $('#scene3').remove()[0];
		
		// 使用截图对象载入该图片
		imageCrop.load(imgObj);
		imageCrop2.load(imgObj2);
		imageCrop3.load(imgObj3);
	});
}(jQuery));
