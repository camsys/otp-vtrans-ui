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
            var theta1, theta2;
            if (i == points.length - 1) {
                theta1 = angles[i - 1];
            } else {
                theta1 = angles[i];
            }
            var p = points[i];
            var x1 = p.x + delta * Math.cos(theta1);
            var y1 = p.y + delta * Math.sin(theta1);

            if (i > 0 && i < points.length - 1) {
                theta2 = angles[i - 1];
                var x2 = p.x + delta * Math.cos(theta2);
                var y2 = p.y + delta * Math.sin(theta2);
                x1 = (x1 + x2) / 2;
                y1 = (y1 + y2) / 2;
            }

            new_points.push(L.point(x1, y1));
        }
        return new_points;
    }
});


