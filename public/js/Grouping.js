
var Grouping = function() {
    this.entities = [];
};

Grouping.prototype = {
    add: function(entity) {
        this.entities.push(entity);
    }
};
