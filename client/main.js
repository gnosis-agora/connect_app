import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Users } from '/api/Users';

import './main.html';

Template.timePicker.onRendered (function() {
	$('.clockpicker').clockpicker();
})

Template.originPicker.helpers ({
	locations: function() {
		return [
			{originID : 'FASS', locationName: 'Faculty of Arts and Social Science'},
			{originID : 'SOC', locationName: 'School of Computing'},
			{originID : 'FOE', locationName: 'Faculty of Engineering'},
			{originID : 'FOS', locationName: 'Faculty of Science'},
			{originID : 'SDE', locationName: "School of Design and Environment"},
			{originID : 'BIZ', locationName: 'Business School'},
			{originID : 'UTown', locationName: 'University Town'},
			{originID : 'YIH', locationName: 'Yusof Ishak House'},
			{originID : 'PGP', locationName: "Price George's Park"},
			{originID : 'Raffles-Hall', locationName: 'Raffles Hall'},
			{originID : 'Sheares-Hall', locationName: 'Sheares Hall'},
			{originID : 'Eusoff-Hall', locationName: 'Eusoff Hall'},
			{originID : 'KE7-Hall', locationName: 'King Edward 7 Hall'},
			{originID : 'NUS-museum', locationName: 'NUS Museum'},
		];
	},
});

Template.destinationPicker.helpers ({
	locations: function() {
		return [
			{destinationID : 'FASS', locationName: 'Faculty of Arts and Social Science'},
			{destinationID : 'SOC', locationName: 'School of Computing'},
			{destinationID : 'FOE', locationName: 'Faculty of Engineering'},
			{destinationID : 'FOS', locationName: 'Faculty of Science'},
			{destinationID : 'SDE', locationName: "School of Design and Environment"},
			{destinationID : 'BIZ', locationName: 'Business School'},
			{destinationID : 'UTown', locationName: 'University Town'},
			{destinationID : 'YIH', locationName: 'Yusof Ishak House'},
			{destinationID : 'PGP', locationName: "Price George's Park"},
			{destinationID : 'Raffles-Hall', locationName: 'Raffles Hall'},
			{destinationID : 'Sheares-Hall', locationName: 'Sheares Hall'},
			{destinationID : 'Eusoff-Hall', locationName: 'Eusoff Hall'},
			{destinationID : 'KE7-Hall', locationName: 'King Edward 7 Hall'},
			{destinationID : 'NUS-museum', locationName: 'NUS Museum'},
		];
	},
});

Template.main.events ({
	"click #connect-me-btn" : function() {
		var date_time = $("#time-picker").val().split(":");
		Users.upsert(
		$("#telegramID").val().toLowerCase(),
		{ 
			telegramID: $("#telegramID").val().toLowerCase(),
		 	originID: $("#origin").val(),
		 	destinationID: $("#destination").val(),
		 	time: parseInt(date_time[0]) * 60 + parseInt(date_time[1]),
		 	chatID: 0,
		});
	},
});