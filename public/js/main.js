$(window).resize(function () { 
	setTimeout(resizePhybar(), 100);
});

$(window).scroll(function() {
  scrollPhybar();
});

function resizePhybar () {
	$(".physiciansSidebar").css("height", window.innerHeight - 71);
    $(".physiciansList").css("height", window.innerHeight - 71);
    $("#physicianSearchList").css("height", window.innerHeight - 300);
}	

function scrollPhybar () {
	$(".physiciansList").css("top", $(window).scrollTop() + 71);
}