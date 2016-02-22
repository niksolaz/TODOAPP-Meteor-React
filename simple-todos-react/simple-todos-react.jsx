// Define a collection to hold our tasks
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient){
	 Accounts.ui.config({
	    passwordSignupFields: "USERNAME_ONLY"
	  });
	//this code is executed on the client only
	Meteor.startup(function(){
		//Use Meteor.startup to render the component after the page is ready
		ReactDOM.render(
			<App/>,
			document.getElementById("render-target"));
	});
}

Meteor.methods({
	addTask(text){
		if(!Meteor.userId()){
			throw new Meteor.Error("Not Authorized");
		}

		Tasks.insert({
			text: text,
		    createdAt: new Date(),
		    owner: Meteor.userId(),
		    username: Meteor.user().username
		});
	},

	removeTasks(taskId) {
		Tasks.remove(taskId);
	},

	setChecked(taskId, setChecked) {
		Tasks.update(taskId, {$set:{checked: setChecked}});
	}
});