
module.exports = {
    getSessionData: function() {
        return {
            'info': {
                'name': 'dev_session',
                'id': 'dev_session',
                'timestamp': 1,
                'options': {
                    'description': ''
                }
            }, 
            'set': ['zero', 'one', 'two', 'three', 'four', 'five']
            //'set': ['0', '1', '2', '3', '4', '5']
        };
    },
    makeSubmissions: function(devSession) {
        devSession.handleSubmission(this.getSubmissionData1());
        devSession.handleSubmission(this.getSubmissionData2());
        devSession.handleSubmission(this.getSubmissionData3());
    },
    getSubmissionData1: function() {
        return {
            'submitter': 'anonymous',
            'timestamp': 10000,
            'groups': [
                {
                    'label': '',
                    'members': ['0', '1', '2']
                },
                {
                    'label': '',
                    'members': ['3', '4']
                },
                {
                    'label': '',
                    'members': ['5']
                }
            ]
        };
    },
    getSubmissionData2: function() {
        return {
            'submitter': 'anonymous',
            'timestamp': 20000,
            'groups': [
                {
                    'label': '',
                    'members': ['1', '2', '3']
                },
                {
                    'label': '',
                    'members': ['4', '5']
                }
            ]
        };
    },
    getSubmissionData3: function() {
        return {
            'submitter': 'anonymous',
            'timestamp': 30000,
            'groups': [
                {
                    'label': '',
                    'members': ['1', '2', '3', '4']
                },
                {
                    'label': '',
                    'members': ['5']
                }
            ]
        };
    }
};
