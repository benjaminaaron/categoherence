
var Session = function(sessionData){
	this.id = sessionData.id;
	this.set = sessionData.set;
	this.showSet();
}

Session.prototype = {
	showSet: function() {
		console.log('---------- start of set ' + this.id);
		for(var i = 0; i < this.set.length; i ++)
			console.log(this.set[i]);
		console.log('---------- end of set ' + this.id);
	}
}

module.exports = Session;
