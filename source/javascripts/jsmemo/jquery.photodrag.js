// Photodrag plugin for jQuery by Kenneth.J
// Date: 2013-07-26

(function($) 
{
	// 
	// PhotoDrag class
	//
	
	function PhotoDrag(img, setting)
	{
		this.options = setting;
		this.img = img;
		this.originOffset = $(this.img).offset();
		this.originWidth = $(this.img).width();
		this.originHeight = $(this.img).height();
		this.clickPos = {x:0, y:0};
		this.isDragging = false;
		this.canvas = null;
		this.rotateType = 0;
		
		// Create canvas.
		
		if (document.all)
		{
			// IE
			
			this.img.style.display = "none";
			this.img.style.position = "absolute";
			this.canvas = document.createElement("img");
			this.canvas.src = this.img.src;
			this.canvas.width = this.originWidth;
			this.canvas.height = this.originHeight;
			this.img.parentNode.appendChild(this.canvas);
		}
		else
		{
			// Other
			
			this.img.style.display = "none";
			this.img.style.position = "absolute";
			this.canvas = document.createElement("canvas");
			this.img.parentNode.appendChild(this.canvas);
			var canvasContext = this.canvas.getContext("2d");
			this.canvas.setAttribute("width", this.originWidth);
			this.canvas.setAttribute("height", this.originHeight);
			canvasContext.drawImage(this.img, 0, 0, this.originWidth, this.originHeight);
		}
		
		// Set listeners.
		
		$(this.canvas).mousedown((function(photoDrag)
		{
			return function(e)
			{
				if (!photoDrag.isDragging)
				{
					photoDrag.isDragging = true;
					photoDrag.clickPos.x = e.clientX;
					photoDrag.clickPos.y = e.clientY;
					e.preventDefault();
					e.stopPropagation(); 
					var x = e.pageX - $(this).offset().left;
					var y = e.pageY - $(this).offset().top;
					if (y < photoDrag.originHeight / 2)
					{
						photoDrag.rotateType = 0;
					}
					else
					{
						photoDrag.rotateType = 1;
					}
				}
				else
				{
					var offsetX = e.clientX - photoDrag.clickPos.x;
					var offsetY = e.clientY - photoDrag.clickPos.y;
					photoDrag.moveOffSet(offsetX, offsetY);
				}
			}
		}(this)));
		
		$(this.canvas).mousemove((function(photoDrag)
		{
			return function(e)
			{
				if (photoDrag.isDragging)
				{
					var offsetX = e.clientX - photoDrag.clickPos.x;
					var offsetY = e.clientY - photoDrag.clickPos.y;
					photoDrag.moveOffSet(offsetX, offsetY);
				}
			}
		}(this)));
		
		$(this.canvas).mouseup((function(photoDrag)
		{
			return function(e)
			{
				if (photoDrag.isDragging)
				{
					photoDrag.isDragging = false;
					photoDrag.moveOffSet(0, 0);
				}
			}
		}(this)));
		
		$(this.canvas).mouseout((function(photoDrag)
		{
			return function(e)
			{
				if (photoDrag.isDragging)
				{
					photoDrag.isDragging = false;
					photoDrag.moveOffSet(0, 0);
				}
			}
		}(this)));
	}
	
	PhotoDrag.prototype.rotate = function(angle)
	{
		angle = angle % 360;
		
		if (angle < 0)
		{
			angle = 360 + angle;
		}
	
		var rotation = angle / 180 * Math.PI;
		var costheta = Math.cos(rotation);
		var sintheta = Math.sin(rotation);
		var realWidth = Math.abs(this.originWidth * costheta) + Math.abs(this.originHeight * sintheta);
		var realHeight = Math.abs(this.originHeight * costheta) + Math.abs(this.originWidth * sintheta);

		if(document.all)
		{
			//
			// IE 7 ...
			//
			
			this.canvas.src = this.img.src;
			this.canvas.width = this.originWidth;
			this.canvas.height = this.originHeight;
			
			this.canvas.style.filter = 
				"progid:DXImageTransform.Microsoft.Matrix(" + 
				  "M11 = " + costheta + 
				", M12 = " + (- sintheta) + 
				", M21 = " + sintheta + 
				", M22 = " + costheta + 
				", SizingMethod = 'auto expand')";
			
			return;
		}
		
		//
		// Other Browsers
		//
		
		var canvasContext = this.canvas.getContext("2d");
		
		this.canvas.setAttribute("width", realWidth);
		this.canvas.setAttribute("height", realHeight);
		
		canvasContext.rotate(rotation);
		
		if (rotation <= 0.5 * Math.PI)
		{
			canvasContext.translate(costheta * sintheta * this.originHeight, - sintheta * sintheta * this.originHeight);
		}
		else if (rotation <= Math.PI)
		{
			canvasContext.translate(- costheta * costheta * this.originWidth, sintheta * costheta * this.originWidth - this.originHeight);
		}
		else if (rotation <= 1.5 * Math.PI)
		{
			canvasContext.translate(- costheta * sintheta * this.originHeight - this.originWidth, - costheta * costheta * this.originHeight);
		}
		else
		{
			canvasContext.translate(- sintheta * sintheta * this.originWidth, - costheta * sintheta * this.originWidth);
		}
		
		canvasContext.drawImage(this.img, 0, 0, this.originWidth, this.originHeight);
		
		canvasContext.restore();
	}
	
	PhotoDrag.prototype.moveOffSet = function(dx, dy)
	{
		// Reset.
		
		if (dx == 0 && dy == 0)
		{
			this.rotate(0);
			$(this.canvas).css({left: 0, top: 0});			
			this.originOffset = $(this.canvas).offset();
			
			return;
		}
		
		if (this.rotateType)
		{
			this.rotate(-dx * 0.1);
		}
		else
		{
			this.rotate(dx * 0.1);
		}
		
		dx -= ($(this.canvas).width() - this.originWidth) / 2;
		dy -= ($(this.canvas).height() - this.originHeight) / 2;
		
		$(this.canvas).offset({
			left: this.originOffset.left + dx,
			top: this.originOffset.top + dy});
	}
	
	//
	// Define plugin.
	//

	$.fn.photodrag = function(setting) 
	{		
		//
		// Iterate through all elements and apply.
		//
		
		return this.each(function()
		{
			var photoDrag = new PhotoDrag(this, setting);
		});
	}
	
	//
	// Default setting.
	//
	
	$.fn.photodrag.defaults = 
	{
		
		
	}
}(jQuery));
