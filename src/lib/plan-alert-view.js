var planAlertTemplate = require('./templates/plan-alert.handlebars')

var Backbone = require("backbone")
var _ = require("underscore")

var PlanAlertView = Backbone.View.extend({
  className: 'PlanAlertView',

  initialize: function (options) {
    this.options = options || {}
  },

  render: function () {
    //console.log('PlanAlertView.render')

    var context = _.clone(this.model.attributes)
    context.index = this.options.index + 1

    this.$el.html(planAlertTemplate(context))
  }

})

module.exports = PlanAlertView
