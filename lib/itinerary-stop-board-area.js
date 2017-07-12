/**
 * Created by mmaranda on 7/10/17.
 */
var Backbone = window.Backbone

var FlagStopArea = Backbone.Model.extend({
  defaults: {
    points: null,
    levels: null,
    length: null
  }
})

module.exports = FlagStopArea
