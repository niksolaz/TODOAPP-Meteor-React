//App componet - represents the whole app
App = React.createClass({
	
	// This mixin makes the getMeteorData method work
  	mixin: [ReactMeteorData],

  	getInitialState() {
  	    return {
  	        hideCompleted: false  
  	    };
  	},

  	// Loads items from the Tasks collection and puts them on this.data.tasks
  	getMeteorData() {

  		let query = {};

  		if (this.state.hideCompleted){
  			query = {checked: {$ne: true}};
  		}

	    return {
	    	tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
      	    incompleteCount: Tasks.find({checked: {$ne: true}}).count(),
      		currentUser: Meteor.user()
	    }
	  },

	renderTasks(){
		//Get tasks from this.data.task
		console.log("DATA", this);
		return this.getMeteorData().tasks.map((task) => {
			return <Task key={task._id} task={task}/>;
		});
	},

	handleSubmit(event) {
	    event.preventDefault();
	 
	    // Find the text field via the React ref
	    var text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
	 
	    Tasks.insert({
	      text: text,
	      createdAt: new Date() // current time
	      owner: Meteor.userId(),           
      	  username: Meteor.user().username
	    });
	 
	    // Clear form
	    ReactDOM.findDOMNode(this.refs.textInput).value = "";
	},

	toggleHideCompleted(){
		this.setState({
			hideCompleted: !this.state.hideCompleted 
		});
	},

	render(){
		return (
			<div className="container">
				<header>
					<h1>Todo List ({this.data.incompleteCount})</h1>

					<label className="hide-completed">
			            <input
			              type="checkbox"
			              readOnly={true}
			              checked={this.state.hideCompleted}
			              onClick={this.toggleHideCompleted} />
			            Hide Completed Tasks
			         </label>
			         <AccountsUIWrapper />
			         { this.data.currentUser ?
			            <form className="new-task" onSubmit={this.handleSubmit} >
			              <input
			                type="text"
			                ref="textInput"
			                placeholder="Type to add new tasks" />
			            </form> : ''
			          }
					<form className="new-task" onSubmit={this.handleSubmit} >
			            <input
			              type="text"
			              ref="textInput"
			              placeholder="Type to add new tasks" />
			        </form>
				</header>

				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		);
	}
});