var Backbone = require("backbone")

var PlanAlert = Backbone.Model.extend({
  initialize: function (opts) {
    return;
  },

  defaults: {
    alertUrl: null,
    effectiveStartDate: null,
    alertHeaderText: null,
    alertDescriptionText: null
  },
})

module.exports = PlanAlert
