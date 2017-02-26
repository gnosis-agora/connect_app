import { Meteor } from 'meteor/meteor';
import { Users } from '/api/Users';

Meteor.startup(() => {
    TelegramBot.token = "333246328:AAFds9kVxYvSJSdoSSsRXknsGQO7sPbTPp8";
    TelegramBot.start();

    /*
    * listener that runs when user starts chatting with bot
    *
    */
    TelegramBot.addListener('/start', function(command, username, original) {
    	TelegramBot.send("Hello " + username + "!", original.chat.id);
    	TelegramBot.send("Welcome to Connect. Please wait while we find your buddy...",original.chat.id);

        // update chat.id for the user
        Users.update(
        	{telegramID : username.toLowerCase()} , 
        	{ $set: 
        		{
        			chatID : original.chat.id,
        		}
        	});
        var currentUser = Users.find({ "telegramID" : username.toLowerCase() }).fetch()[0];
        var activeUsers = Users.find({}).fetch();
        var chosenUser = null;

        for (var x = 0; x < activeUsers.length; x++) {
        	var user = activeUsers[x];
        	if (user.telegramID != username.toLowerCase() && user.chatID != 0) {
	        	if (currentUser.originID == user.originID && currentUser.destinationID == user.destinationID && Math.abs(currentUser.time - user.time) <= 15) {
	        		chosenUser = user;
	        		break;
	        	}        		
        	}
        }

        // if chosenUser is found
        if (chosenUser != null) {
        	TelegramBot.send("Great news " + username + "! Your buddy is @" + chosenUser.telegramID, original.chat.id);
        	TelegramBot.send("Your buddy is going from " + chosenUser.originID + " to " + chosenUser.destinationID + " at " + Meteor.call("formatTime",chosenUser.time), original.chat.id);
        	TelegramBot.send("Great news " + chosenUser.telegramID + "! Your buddy is @" + currentUser.telegramID, chosenUser.chatID);
        	TelegramBot.send("Your buddy is going from " + currentUser.originID + " to " + currentUser.destinationID + " at " + Meteor.call("formatTime",currentUser.time), chosenUser.chatID);
        	Users.remove({telegramID : chosenUser.telegramID});
        	Users.remove({telegramID : currentUser.telegramID});
        }
    });

});

Meteor.methods({
	/*
	* Returns a formatted time string from total number of minutes
	*/
	formatTime: function(rawTime) {
		var hours = Math.floor(rawTime/60);
		var minutes = rawTime%60;
		if (minutes < 10) {
			return hours + ":0" + minutes;
		}
		else{
			return hours + ":" + minutes;	
		}
		
	}
});