var log = require('./log')('plan-response-narrative-view')
var ItineraryNarrativeView = require('./itinerary-narrative-view')
var ItineraryTabsView = require('./itinerary-tabs-view')
var PlanAlertView = require('./plan-alert-view')

var Backbone = require("backbone")
var _ = require("underscore")

var narrativeNewTemplate = require('./templates/narrative-new.handlebars')
var narrativeAdjustTemplate = require('./templates/narrative-adjust.handlebars')
var narrativeErrorTemplate = require('./templates/narrative-error.handlebars')

var PlanResponseNarrativeView = Backbone.View.extend({
  initialize: function (options) {
    this.options = options || {}
  },

  render: function () {
    log('rendering model: %s, error: %s', !!this.model, !!this.error)

    if (this.error) {
      return this.$el.html(narrativeErrorTemplate({
        message: this.error
      }))
    }

    if (this.model) {
      if (!this.error) this.$el.html(narrativeAdjustTemplate())
      
      var planAlerts = this.model.get('alerts')
      if (planAlerts) {
        _.each(planAlerts.models, this.processPlanAlert, this)
      }

      var itins = this.model.get('itineraries')
      _.each(itins.models, this.processItinerary, this)
    } else {
      this.$el.html(narrativeNewTemplate())
    }
  },

  processPlanAlert: function (planAlert, index) {
    var planAlertView = new PlanAlertView({
      model: planAlert,
      planView: this,
      index: index
    })
    planAlertView.render()
    this.$el.find('.itineraries').append(planAlertView.el)
  },

  processItinerary: function (itin, index) {
    console.log('in plan-response-narrative-view')
    var itinView = new ItineraryNarrativeView({
      model: itin,
      planView: this,
      index: index,
      legs: itin.get('legs'),
      itineraries_for_tabs: this.model.get('itineraries')
    })

    // var itinTabsView = new ItineraryTabsView({
    //   model: itin,
    //   planView: this,
    //   index: index,
    //   legs: itin.get('legs'),
    //   itineraries_for_tabs: this.model.get('itineraries')
    // })

    itinView.render()
    // itinTabsView.render()

    this.$el.find('.itineraries').append(itinView.el)
    // this.$el.find('.itinerarytabs').append(itinView.el)
  }
})

module.exports = PlanResponseNarrativeView
