var log = require('./log')('plan-response-narrative-view')
var ItineraryNarrativeView = require('./itinerary-narrative-view')
var ItineraryTabsView = require('./itinerary-tabs-view')
var PlanAlertView = require('./plan-alert-view')

var Backbone = require("backbone")
var _ = require("underscore")

var narrativeNewTemplate = require('./templates/narrative-new.handlebars')
var narrativeAdjustTemplate = require('./templates/narrative-adjust.handlebars')
var narrativeErrorTemplate = require('./templates/narrative-error.handlebars')

var itineraries

var PlanResponseNarrativeView = Backbone.View.extend({
  events: {
    'click .itineraryTab1': 'itineraryTab1Clicked',
    'click .itineraryTab2': 'itineraryTab2Clicked',
    'click .itineraryTab3': 'itineraryTab3Clicked',
  },

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

      if (!this.error) {
        this.$el.html(narrativeAdjustTemplate(context))
      }
      
      var planAlerts = this.model.get('alerts')
      if (planAlerts) {
        _.each(planAlerts.models, this.processPlanAlert, this)
      }

      var itins = this.model.get('itineraries')

      itineraries = itins

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
    var itinView = new ItineraryNarrativeView({
      model: itin,
      planView: this,
      index: index,
      legs: itin.get('legs'),
      itineraries_for_tabs: this.model.get('itineraries')
    })

    var itinTabsView = new ItineraryTabsView({
      model: itin,
      planView: this,
      index: index,
      legs: itin.get('legs'),
      itineraries_for_tabs: this.model.get('itineraries')
    })

    itinView.render()
    itinTabsView.render()

    if(index == 0) {
      this.$el.find('.itinerary1').append(itinView.el)
      this.$el.find('.itineraryTab1').append(itinTabsView.el)
    }
    else if(index == 1) {
      this.$el.find('.itinerary2').append(itinView.el)
      this.$el.find('.itineraryTab2').append(itinTabsView.el)
    }
    else if(index == 2) {
      this.$el.find('.itinerary3').append(itinView.el)
      this.$el.find('.itineraryTab3').append(itinTabsView.el)
    }

  },

  itineraryTab1Clicked: function() {
    var tab1 = this.$el.find('.itinerary1').find('.otp-itinHeader');
    tab1.click();
  },
  itineraryTab2Clicked: function() {
    var tab2 = this.$el.find('.itinerary2').find('.otp-itinHeader');
    tab2.click();
  },
  itineraryTab3Clicked: function() {
    var tab3 = this.$el.find('.itinerary3').find('.otp-itinHeader');
    tab3.click();
  },

})

module.exports = PlanResponseNarrativeView

