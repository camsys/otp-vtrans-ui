var LegNarrativeView = require('./leg-narrative-view')

var itinNarrativeTabTemplate = require('./templates/narrative-itinerarytab.handlebars')
// var itinNarrativeTemplate = require('./templates/narrative-itinerary.handlebars')

var Backbone = require("backbone")
var _ = require("underscore")

var ItineraryTabsView = Backbone.View.extend({

  initialize: function (options) {
    this.options = options || {}

  },

  render: function () {
    var legs = this.model.get('legs')
    var timeOffset = this.options.planView.model.getTimeOffset()
    var duration = this.options.planView.options.showFullDuration
      ? this.model.getFullDuration(this.options.planView.model.get('request'), timeOffset)
      : this.model.get('duration')

    // filter out internal walk legs
    var filteredLegs = []
    legs.models.forEach(function(model, i) {
      if(i === 0 || i === legs.models.length - 1) {
        filteredLegs.push(model)
        return;
      }
      if(model.get('mode') !== 'WALK') filteredLegs.push(model)
    })

    var starting_ascii_value_A = "A".charCodeAt(0)

    var context = _.clone(this.model.attributes)
    context.index = this.options.index + 1
    context.alphaValue = String.fromCharCode(this.options.index + starting_ascii_value_A)
    context.legs = filteredLegs
    context.duration = duration
    context.timeOffset = timeOffset
    console.log('fare is in this model')
    console.log(this.model.get('fare').fare)
    context.fare = this.model.get('fare').fare

    this.$el.html(itinNarrativeTabTemplate(context))

    this.legs = []
    _.each(legs.models, this.processLeg, this)

    this.$el.find('.otp-itinBody').hide()
  },

  processLeg: function (leg) {
    var legView = new LegNarrativeView({
      itinView: this,
      model: leg
    })
    legView.render()
    this.legs.push(legView)
    this.$el.find('.otp-itinBody').append(legView.el)
  },

  isActive: function () {
    return this.options.planView.model.get('itinerarytabs').activeItinerary ===
      this.model
  }
})

module.exports = ItineraryTabsView
