var LegNarrativeView = require('./leg-narrative-view')

var itinNarrativeTemplate = require('./templates/narrative-itinerary.handlebars')

var Backbone = require("backbone")
var _ = require("underscore")

var ItineraryNarrativeView = Backbone.View.extend({
  className: 'PlanResponseNarrativeView',

  events: {
    'click .otp-itinHeader': 'headerClicked',
    'click .print': 'print'
  },

  initialize: function (options) {
    this.options = options || {}

    _.bindAll(this, 'headerClicked')

  },

  print: function (e) {
    console.log('In itinerary-narrative-view print')
    e.preventDefault()
    if (!this.isActive) {
      console.log('!this.isActive')
      this.model.trigger('activate')
      console.log(this);
    } else {
      //TODO REMOVE THIS else block
      console.log('this.isActive')
      console.log(this);
    }

    if (this.legs)
      this.legs.forEach(function (leg) {
      console.log(leg)
      leg.print()
    })

    setTimeout(function () {
      window.print()
    }, 500)
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

    var context = _.clone(this.model.attributes)
    context.index = this.options.index + 1
    context.legs = filteredLegs
    context.duration = duration
    context.timeOffset = timeOffset

    this.$el.html(itinNarrativeTemplate(context))

    this.legs = []
    _.each(legs.models, this.processLeg, this)
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

  headerClicked: function (e) {
    this.active = true
    this.model.trigger('activate')
  },

  isActive: function () {
    return this.options.planView.model.get('itineraries').activeItinerary ===
    this.model
  }
})

module.exports = ItineraryNarrativeView
