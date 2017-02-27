import { Meteor } from 'meteor/meteor';
import { Users } from '/api/Users';
import { Datalog } from '/api/Datalog';




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

        // find a suitable match
        for (var x = 0; x < activeUsers.length; x++) {
        	var user = activeUsers[x];
        	if (user.telegramID != username.toLowerCase() && user.chatID != 0) {
	        	if (currentUser.originID == user.originID && currentUser.destinationID == user.destinationID && Math.abs(currentUser.time - user.time) <= 15) {
	        		chosenUser = user;
	        		break;
	        	}        		
        	}
        };

        // if chosenUser is found
        if (chosenUser != null) {
        	TelegramBot.send("Great news " + username + "! Your buddy is @" + chosenUser.telegramID, original.chat.id);
        	TelegramBot.send("Your buddy is going from " + chosenUser.originID + " to " + chosenUser.destinationID + " at " + Meteor.call("formatTime",chosenUser.time), original.chat.id);
        	TelegramBot.send("Great news " + chosenUser.telegramID + "! Your buddy is @" + currentUser.telegramID, chosenUser.chatID);
        	TelegramBot.send("Your buddy is going from " + currentUser.originID + " to " + currentUser.destinationID + " at " + Meteor.call("formatTime",currentUser.time), chosenUser.chatID);
        	
        	// Send link to app at the end of match to users
        	TelegramBot.send("Please visit us soon at this link https://connectapp1917.herokuapp.com/  :)",original.chat.id);
        	TelegramBot.send("Please visit us soon at this link https://connectapp1917.herokuapp.com/  :)",chosenUser.chatID);
        	Users.remove({telegramID : chosenUser.telegramID});
        	Users.remove({telegramID : currentUser.telegramID});

        	// increment number of matches counter
        	Datalog.upsert({userData : "userMatches"}, {$inc : {numOfMatches: 1}});
        };

        // remove those who can't find a match past 15 minutes from their departure time
        var currDay = new Date();
        // currTime is in seconds since the start of the day
        var currTime = (currDay - new Date(currDay.getFullYear(),currDay.getMonth(),currDay.getDate()))/1000;
        currTime = parseInt(currTime/60);
        var toBeRemoved = [];
        for (var x = 0; x < activeUsers.length; x++) {
            var user = activeUsers[x];
            if ((user.time + 15) < currTime) {
                // send a notification to user to notify them of failure to match
                TelegramBot.send("Unfortunately, we cannot find a match for you at this moment.",user.chatID);
                TelegramBot.send("Please visit us soon at this link https://connectapp1917.herokuapp.com/",user.chatID);
                toBeRemoved.push(user.telegramID);
            }
        };    
        // remove these users from database
        toBeRemoved.forEach(function(user) {
            Users.remove({telegramID : user});
        });
    });

    /*
    * listener that assists user in cancelling his/her queue
    *
    */
    TelegramBot.addListener('/leave', function(command, username, original) {    
        TelegramBot.send("We have stopped finding a match for you. Please visit us soon at this link https://connectapp1917.herokuapp.com/",original.chat.id);
        Users.remove({telegramID : username.toLowerCase()});
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