
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
            'set': ['0', '1', '2', '3', '4', '5']
        };
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
        // TODO
    }
};
