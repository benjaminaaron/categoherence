
var Session = function(info) {
    this.info = info;
    this.submissions = [];
    
    this.showInfo();
};

Session.prototype = {
    showInfo: function() {
        console.log('---------- start: ' + this.info.id);
        console.log(this.info);
        console.log('---------- end: ' + this.info.id);
    },
    handleSubmission: function(submissionData) {
        this.submissions.push(submissionData);
        //TODO
    },
    getResult: function() {
        var resultData = {
            'info': this.info,
            'submissions': this.submissions.length,
            'stats' : null
        };
    }
};

module.exports = Session;
