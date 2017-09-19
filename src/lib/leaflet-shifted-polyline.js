import 'leaflet'

L.ShiftedPolyline = L.Polyline.extend({
  
  // copied from https://github.com/Leaflet/Leaflet/blob/master/src/layer/vector/Polyline.js
  _projectLatlngs: function (latlngs, result, projectedBounds) {
		var flat = latlngs[0] instanceof L.LatLng,
		    len = latlngs.length,
		    i, ring;

		if (flat) {
			ring = [];
			for (i = 0; i < len; i++) {
			  ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
			}
      ring = this._shift(ring, 10);
      for (i = 0; i < len; i++) {
        projectedBounds.extend(ring[i]);
      }
			result.push(ring);
		} else {
			for (i = 0; i < len; i++) {
				this._projectLatlngs(latlngs[i], result, projectedBounds);
			}
		}
  },
  
  _shift: function(points, delta) {
    var new_points = [];
    var theta;
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (i < points.length - 1) {
        var q = points[i+1];
        // use +pi/2 for left-shift 
        theta = Math.atan2(p.y, p.x) - Math.atan2(q.y, q.x) - (Math.PI/2);
      }
      var x = p.x + delta * Math.cos(theta);
      var y = p.y + delta * Math.sin(theta);
      new_points.push(L.point(x, y));
    }
    return new_points;
  } 
});


