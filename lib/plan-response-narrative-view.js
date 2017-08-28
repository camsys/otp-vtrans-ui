var log = require('./log')('plan-response-narrative-view')
var ItineraryNarrativeView = require('./itinerary-narrative-view')

var Backbone = window.Backbone
var _ = window._

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

      var itins = this.model.get('itineraries')
      _.each(itins.models, this.processItinerary, this)
    } else {
      this.$el.html(narrativeNewTemplate())
    }
  },

  processItinerary: function (itin, index) {
    var itinView = new ItineraryNarrativeView({
      model: itin,
      planView: this,
      index: index
    })

    itinView.render()
    this.$el.find('.itineraries').append(itinView.el)
  }
})

module.exports = PlanResponseNarrativeView
