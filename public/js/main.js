var phoneNumbers = {
	ryanGosling: "+12344432212",
	cameronDiaz: "+12344432212"
};

$(document).on("ready", function () {
    $('#tableReceptionist').dataTable();
    $('#tableNurse').dataTable();

    setTimeout(function() {
    	window.navigator.vibrate([200, 100, 100, 100, 200, 300, 500]);
    }, 5000);
});

$("#btnSendMessage").on("click", function () {
	$("#txtMessage").val("");
	alert("Message sent!");
});

$(".btnAction").on("click", function () {
	
	var patientCard = $(this).parents(".patientCard");

	switch($(this).html().trim()) {

		case "Register": registerPatient(patientCard);
		break;
		case "Call": callPatient(patientCard);
		break;
		case "Discharge": dischargePatient(patientCard);
		break;
	}
});

function registerPatient (patientCard) {
	
	$("#btnRegisterUser").off("click");
	$("#btnRegisterUser").on("click", function () {

		if($("#txtPhoneNumber").val() == "") {
			alert("Please specify a phone number");
			return;
		}

		var currNumber = "";
		var name = "";

		if($(patientCard).find(".patientName").html() == "Ryan Gosling") {
			phoneNumbers.ryanGosling = $("#txtPhoneNumber").val();
			currNumber = phoneNumbers.ryanGosling;
			name = "Ryan Gosling";
		}
		else{
			phoneNumbers.cameronDiaz = $("#txtPhoneNumber").val();
			currNumber = phoneNumbers.cameronDiaz;
			name = "Cameron Diaz";
		}

		var data = {
			//fromNumber: "+12562934298",
			to: currNumber,
			body: "Welcome to Emory "+ name + ". Your estimated waiting time is 15 minutes. " +
				"Once the doctor is available you will receive another message."
		};

		$.ajax({
			type: "POST", // "GET|POST|DELETE|PUT"
		    url: "http://localhost/api/message",
		    data: data ,  //json con datos
		    dataType: "json", // "text|html|json|jsonp|script|xml"
		    success: messageCallback
		}).fail(function(err) { console.log( err ); });


		$("#txtPhoneNumber").val("");
		setPatientState("Register", patientCard);
	});



	$("#modalRegister").modal();
}

function callPatient (patientCard) {
	
	$("#btnCallUser").off("click");
	$("#btnCallUser").on("click", function () {

		

		
		alert("Message sent!");
		$("#txtCall").val("The doctor is free to see you. In a couple of minutes, a nurse will come for you.");
		
		setPatientState("Call", patientCard);
	});

	$("#modalCall").modal();
}

function dischargePatient (patientCard) {
	
	$("#btnDischargeUser").off("click");
	$("#btnDischargeUser").on("click", function () {
		setPatientState("Discharge", patientCard);
	});

	$("#modalDischarge").modal();
}

function setPatientState (action, patientCard) {
	
	var stateComp = $(patientCard).find(".patientState");
	var apptTimeComp = $(patientCard).find(".apptTime");

	switch(action) {
		case "Register": 
			stateComp.removeClass("label-default");
			stateComp.addClass("label-primary");
			stateComp.html("Waiting Room");

			apptTimeComp.removeClass("label-default");
			apptTimeComp.addClass("label-success");
			$(patientCard).find(".btnRegister").remove();

			var btnMessage = $(patientCard).find(".btnMessage");
			btnMessage.attr("data-toggle", "modal");
			btnMessage.attr("data-target", "#modalMessage");
		break;

		case "Call": 
			stateComp.removeClass("label-primary");
			stateComp.addClass("label-success");
			stateComp.html("Doctor's Office");

			$(patientCard).find(".btnCall").remove();
		break;

		case "Discharge":
			stateComp.removeClass("label-success");
			stateComp.addClass("label-default");
			stateComp.html("Discharged");

			apptTimeComp.removeClass("label-success");
			apptTimeComp.addClass("label-default");
			$(patientCard).find(".btnDischarge").remove();

			var btnMessage = $(patientCard).find(".btnMessage");
			btnMessage.removeAttr("data-toggle");
			btnMessage.removeAttr("data-target");
		break;
	}
}

function messageCallback (argument) {
	alert("Message sent!");
}