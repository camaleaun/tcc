/**
 *
 */
$(function(){
	$.each($(".glyphicon"), function() {
		$(this).html("<span>"+$(this).text()+"</span>");
	});
	if ($(window).width() < 768)
		$.each($(".dropdown-toggle"), function() {
			$(this).append(" <span class=\"caret\"></span>");
		});
	resize($(window).height());
	$(window).resize(function() { resize($(window).height()); });
	$.each($(".btn-toolbar .btn"), function(){
		$(this).attr("data-original-title", $(this).text());
	});
	$('.btn-toolbar .btn').tooltip({
	      placement: "bottom"
	    });
	$("#execucao .modal-title").text($(".code .name").text());
});
var resize = function(height) {
	//alert($(".navbar").innerHeight()+" - "+$(".btn-toolbar").innerHeight()+" - "+($(".navbar").height()+$(".btn-toolbar").height()));
	$(".lines").css("height", (height-($(".navbar").innerHeight()+$(".btn-toolbar").innerHeight()+2))+"px");
};
