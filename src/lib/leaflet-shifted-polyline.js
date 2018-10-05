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
            if (this._map && this._map.getZoom() > 15) {
                ring = this._shift(ring, 10);
            }
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

    _shift: function (points, delta) {
        var new_points = [];
        var angles = [];
        for (var i = 0; i < points.length - 1; i++) {
            var p = points[i];
            var q = points[i + 1];
            // use +pi/2 for left-shift
            var theta = Math.atan2(q.y - p.y, q.x - p.x);
            var theta_p = theta + (Math.PI / 2);
            angles[i] = theta_p;
        }
        for (var i = 0; i < points.length; i++) {
            var theta;
            if (i == points.length - 1) {
                theta = angles[i - 1];
            } else if (i == 0) {
                theta = angles[0];
            } else {
                theta = (angles[i - 1] + angles[i]) / 2.0;
            }
            var p = points[i];
            var x = p.x + delta * Math.cos(theta);
            var y = p.y + delta * Math.sin(theta);

            new_points.push(L.point(x, y));
        }
        return new_points;
    }
});


