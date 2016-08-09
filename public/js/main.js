$(window).resize(function () { 
	setTimeout(function () {
		resizePhybar();
	}, 100);
});

$(window).scroll(function() {
  scrollPhybar();
});

function resizePhybar () {

	if(screen.width > 767) {
		$(".physiciansSidebar").css("height", window.innerHeight - 90);
	    $(".physiciansList").css("height", window.innerHeight - 90);
	    $("#physicianSearchList").css("height", window.innerHeight - 320);
	}
	else {
		$(".physiciansSidebar").css("height", window.innerHeight - 50);
	    $(".physiciansList").css("height", window.innerHeight - 50);
	    $("#physicianSearchList").css("height", window.innerHeight - 250);
	}

    //console.log("inner height: " + window.innerHeight);
    return window.innerHeight;
}	

function scrollPhybar () {
	$(".physiciansList").css("top", $(window).scrollTop() + 90);
}