(function($) 
{
	$(".photo *").css({
		"padding":"0",
		"margin":"0",
		"border":"0",
	});
	$(".photo").css({
		"padding":"30px 10px 30px 10px",
		"width":"200px",
		"height":"200px",
		"margin":"30px auto",
		"border":"solid gray 1px",
		"background-color":"#ccccbb",
	});
	$(".photo_drag").css({
		"width":"200px",
		"height":"200px",
		"margin":"0 auto",
	});
	$(".photo_drag img").css({
		"width":"200px",
	});
	$(".photo_drag").photodrag();
})(jQuery);