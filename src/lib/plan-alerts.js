var PlanAlert = require('./plan-alert')

var Backbone = require("backbone")

var PlanAlerts = Backbone.Collection.extend({
  model: PlanAlert,

  initialize: function () {

  }

})

module.exports = PlanAlerts
