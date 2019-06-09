var flexServicePopupTemplate = require('./templates/flex-service-popup.handlebars');

var Backbone = require("backbone")
var _ = require("underscore")

var FlexServicePopupView = Backbone.View.extend({
  el: '#modal-placeholder',

  events: {
  },

  initialize: function (options) {
    this.options = options || {};

    this.render();
  },

  render: function () {
    var context = _.clone(this.model);

    this.$el.html(flexServicePopupTemplate(context));
    
    $('.flex-service-popup').localize();
    $('.flex-service-popup').modal('show');
  }

})

module.exports = FlexServicePopupView
