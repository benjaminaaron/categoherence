
var Session = function(set){
	this.set = set;
}

Session.prototype = {
	showSet: function() {
		console.log('---------- start of set');
		for(var i = 0; i < this.set.length; i ++)
			console.log(this.set[i]);
		console.log('---------- end of set');
	}
}

module.exports = Session;
