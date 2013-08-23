/*
 * @file jQuery 截图插件
 * 本插件基于jQuery 1.10.2 和 jQuery UI 1.10.3
 * @author Kenneth.J
 * Date: 2013-08-14
 */

(function($) {

	/*
	 * 截图类 ImageCrop
	 * @constructor
	 * @param {object} settings 选项参数对象
	 * @param {HTMLElement} domObj 需要封装成截图器的对象
	 * @param {function} callback 回调函数，将在停止拖动或拉伸时执行
	 *   接受两个参数，第一个是一个Image对象，第二个是一个资源矩形对象
	 *   ，保存了裁剪区域{x,y,width,height}
	 */
	function ImageCrop(settings, domObj, callback) {
		this.settings = settings;
		this.domObj = domObj;
		this.canvasObj = document.createElement('div');
		this.filterObj = null;
		this.originImgObj = null;
		this.imgObj = null;		
		this.cropObj = null;
		this.innerImgObj = null;
		this.callback = callback;
		this.originWidth = 0;
		this.originHeight = 0;
		this._makeCrop();
		this._makeFilter();
		
		var selfObj = $(this.domObj);
		var canvasObj = $(this.canvasObj);
		
		selfObj.append(this.canvasObj);
		canvasObj.append(this.filterObj);
		canvasObj.append(this.cropObj);		
	}
	
	/*
	 * 导入图像。
	 * @param {Image} img 导入裁剪源图像对象
	 */
	ImageCrop.prototype.loadImage = function(imgObj) {
		this.originImgObj = imgObj;
		this.imgObj = new Image();
		$(this.imgObj).attr('src', $(imgObj).attr('src'));
		
		// 定义读取函数
		var tempLoadFunc = (function(imageCrop) {
			return function() {
				var canvasObj = $(imageCrop.canvasObj);
				var filterObj = $(imageCrop.filterObj);
				var selfObj = $(imageCrop.domObj);
				var imgObj = $(imageCrop.imgObj);
				var cropObj = $(imageCrop.cropObj);
				var selfWidth = selfObj.width();	
				var selfHeight = selfObj.height();
				
				// 必须先插入文档才能获取宽高						
				filterObj.prepend(imgObj); 
				imgObj.css({
					'border' : '0',
					'float': 'left',
					'max-width': '1000%',
				});
					
				var imgWidth = imgObj.width();
				var imgHeight = imgObj.height();
				imageCrop.originWidth = imgWidth;
				imageCrop.originHeight = imgHeight;
				var deltaWidth = selfWidth - imgWidth;
				var deltaHeight = selfHeight - imgHeight;
				
				// 缩放图像以及画布
				if (deltaWidth > deltaHeight) {
					imgObj.attr('height', selfHeight);
					imgObj.attr('width', imgWidth / imgHeight * selfHeight);
					var left = (selfObj.width() - imgObj.width()) / 2;
					canvasObj.css({'left': left + 'px'});
				} else {
					imgObj.attr('width', selfWidth);
					imgObj.attr('height', imgHeight / imgWidth * selfWidth);
					var top = (selfObj.height() - imgObj.height()) / 2;
					canvasObj.css({'top': top + 'px'});
				} 
				
				imgWidth = imgObj.width();
				imgHeight = imgObj.height();
				canvasObj.width(imgWidth);
				canvasObj.height(imgHeight);
				canvasObj.css({
					'border' : '0',
					'position':'relative'
				});
				imgObj.css({
					'border' : '0',
					'float': 'left'
				});
				
				if (imageCrop.settings.seprateEffect) {
					// 拷贝一个到截图框中
					imageCrop.innerImgObj = new Image();
					var cropImg = $(imageCrop.innerImgObj);
					cropImg.attr('src', imgObj.attr('src'));
					cropImg.css({ 
						'border' : '0',
						'float': 'left',
						'position': 'absolute',
						'max-width': '1000%',
					});
					cropObj.prepend(cropImg);				
					cropImg.width(imgWidth);
					cropImg.height(imgHeight);
				}
				
				// 使用叠加多层半透明图片模拟模糊效果
				if (imageCrop.settings.blur) {
					canvasObj.css({
						'overflow': 'hidden',
					});
					imgObj.css({
						'opacity': '0',
						'filter': 'alpha(opacity=0)',
					});			
					for (var i = 0; i < 20; i++) {
						var newImgObj = $(new Image());
						filterObj.append(newImgObj);
						newImgObj.attr('src', imgObj.attr('src'));
						newImgObj.css({
							'border' : '0',
							'position': 'absolute',
							'top': -2 + i/5,
							'left': -2 + i/5,
							'opacity': '0.1',
							'filter': 'alpha(opacity=10)',
							'max-width': '1000%',
						});
						newImgObj.width(imgWidth);
						newImgObj.height(imgHeight);						
					}
				}				
			};
		})(this);
		
		if (this.imgObj.complete) {
			// 图片读取完毕
			tempLoadFunc();
		} else {
			// 等待图片读取完毕
			$(this.imgObj).load(tempLoadFunc);
		}
	};
	
	/*
	 * 获取截图框所表示的图像的资源矩形
	 * @return {object} 一个对象包含x,y,width,height属性
	 */
	ImageCrop.prototype.getSrcRect = function() {
		if (!this.imgObj) {
			return {'x': 0,	'y': 0,	'width': 0,	'height': 0 };
		}
		
		var imgObj = $(this.imgObj);
		var cropObj = $(this.cropObj);		
		var widthRate = this.originWidth / imgObj.width();
		var heightRate = this.originHeight / imgObj.height(); 
		var cropPos = cropObj.position(); 
		var borderWidth = this.settings.defaultCropBorderWidth;		
		var realCropWidth = (cropObj.width() + 2 * 
			this.settings.defaultCropBorderWidth) * widthRate;
		var realCropHeight = (cropObj.height() + 2 * 
			this.settings.defaultCropBorderWidth) * heightRate;
		var realCropX = cropPos.left * widthRate;
		var realCropY = cropPos.top * heightRate;
		
		return {
			'x': realCropX,
			'y': realCropY,
			'width': realCropWidth,
			'height': realCropHeight,
		};
	};
	
	/*
	 * 调用回调函数
	 */
	ImageCrop.prototype._applyCallback = function() {
		if (!this.callback) {
			return;
		}
		
		this.callback(this.originImgObj, this.getSrcRect());
	};
	
	/* 
	 * 获取或建立选择框元素，并使用jQuery UI使其可拖动并可缩放
	 * @private
	 */
	ImageCrop.prototype._makeCrop = function() {
		var cropObj = null;
		var selfObj = $(this.domObj);
		
		this.cropObj = selfObj.children('.' + this.settings.defaultCropClass)[0];
		if (!this.cropObj) {
			this.cropObj = document.createElement('div');
		}
		cropObj = $(this.cropObj);
		cropObj.width(this.settings.defaultCropWidth);
		cropObj.height(this.settings.defaultCropHeight);
		cropObj.addClass(this.settings.defaultCropClass);
		cropObj.css({
			'position': 'absolute',
			'float': 'left',
			'overflow': 'hidden',
			'border-width': this.settings.defaultCropBorderWidth + 'px',
		});		
		cropObj.resizable({ 
			handles: 'e, s, se', 
			stop: (function(imageCrop) {
				return function() { 
					imageCrop._stayInside();
					imageCrop._applyCallback(); 
				} ;
			})(this),
		});
		cropObj.draggable({	
			containment: "parent",
			drag: (function(imageCrop) {				
				return function(event, ui) {
					if (imageCrop.settings.seprateEffect) {
						// 调整拖动时框内图片的坐标
						$(imageCrop.innerImgObj).css({
							'top': -ui.position.top - 
								imageCrop.settings.defaultCropBorderWidth + 'px',
							'left': -ui.position.left - 
								imageCrop.settings.defaultCropBorderWidth + 'px',
						}); 
					}
				};
			})(this),
			stop: (function(imageCrop) {
				return function() { 
					imageCrop._stayInside();
					imageCrop._applyCallback(); 
				} ;
			})(this),
		});
	};
	
	/* 
	 * 建立滤镜层
	 * @private
	 */
	ImageCrop.prototype._makeFilter = function() {
		var filterObj = null;
		var selfObj = $(this.domObj);
		
		this.filterObj = selfObj.children('.' + 
			this.settings.defaultFilterClass)[0];
		if (!this.filterObj) {
			this.filterObj = document.createElement('div');
		}
		
		filterObj = $(this.filterObj);
		filterObj.addClass(this.settings.defaultFilterClass);
		filterObj.css({
			'border' : '0',
			'position': 'absolute',
			'float': 'left', 
			'width': 'inherit',
			'height': 'inherit',
		});
	};
	
	/*
	 * 让超出边界的裁剪边回到边界内。
	 */
	ImageCrop.prototype._stayInside = function() {
		var cropObj = $(this.cropObj);
		var cropPos = cropObj.offset();
		var cropWidth = cropObj.width();
		var cropHeight = cropObj.height();
		var self = $(this.canvasObj);
		var selfPos = self.offset();
		var selfWidth = self.width();
		var selfHeight = self.height();
		var outRight = (cropPos.left + cropWidth) - (selfPos.left + selfWidth);
		var outBottom = (cropPos.top + cropHeight) - (selfPos.top + selfHeight);
		var outLeft =  selfPos.left - cropPos.left;
		var outTop = selfPos.top - cropPos.top;
		
		if (outLeft > 0) {
			cropObj.width(cropWidth - outLeft - 
				this.settings.defaultCropBorderWidth);
			cropObj.offset({ 'left':cropPos.left + outLeft + 
				this.settings.defaultCropBorderWidth });
		}
		
		if (outTop > 0) {
			cropObj.height(cropHeight - outTop - 
				this.settings.defaultCropBorderWidth);
			cropObj.offset({ 'top':(cropPos.top + outTop + 
				this.settings.defaultCropBorderWidth) });
		}
		
		if (outRight > 0) {
			cropObj.width(cropWidth - outRight - 2 *
				this.settings.defaultCropBorderWidth);			
		}
		
		if (outBottom > 0) {
			cropObj.height(cropHeight - outBottom - 2 * 
				this.settings.defaultCropBorderWidth);	
		}
	};

	/*
	 * 插件方法 imagecrop. 将一个jQuery对象插件化为截图插件
	 * @param {object} settings
	 * @param {function} callback 一个回调函数接受一个Image对象和
	 *   一个资源矩形对象，包含x,y,width,height属性
	 */
	$.fn.imagecrop = function(settings, callback) {
		
		// 默认参数
		settings = $.extend({}, $.fn.imagecrop.defaults, settings);	
		
		// 遍历所有对象生成插件
		for (var i = 0; i < this.length; i++) {
			if (!this[i].imageCrop) {
				this[i].imageCrop = new ImageCrop(settings, this[i], callback);
			}
		}
		
		// 临时扩展jQuery对象，添加对第一个对象的裁剪和读取图片的操作
		this.getRect = this.length > 0 ? (function(imageCrop) {
			return function () {
				return imageCrop.getSrcRect();
			};
		})(this[0].imageCrop) : function(){};
		
		this.load = this.length > 0 ? (function(imageCrop) {
			return function (imgObj) {
				imageCrop.loadImage(imgObj);
			};
		})(this[0].imageCrop) : function(){};
		
		return this;
	};

	/*
	 * 默认参数
	 * @type {object}
	 */
	$.fn.imagecrop.defaults = {
		'defaultCropWidth': 100, // 默认的裁剪宽度
		'defaultCropHeight': 100, // 默认的裁剪高度
		'defaultCropBorderWidth': 2, // 默认的裁剪边框宽度
		'defaultCropClass': 'image-crop-selection-box', // 裁剪层的类名
		'defaultFilterClass': 'image-crop-filter', // 滤镜层的类名
		'blur': false, // 是否模拟模糊滤镜
		'seprateEffect': true, // 是否让选中框中的图像为源图像
	};
})(jQuery);
