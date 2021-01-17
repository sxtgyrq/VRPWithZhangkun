function getMaps(longitude, latitude, deltaLength) {
    var EarthRadio = 6370856;
    var DeltaLongitude = deltaLength / (EarthRadio * Math.PI * 2 * Math.cos(latitude / 180 * Math.PI)) * 360;
    var DeltaLatitude = deltaLength / (EarthRadio * Math.PI * 2) * 360;
    console.log("", DeltaLongitude, DeltaLatitude);

    var Mxmin = MercatorGetXbyLongitude((longitude - DeltaLongitude));
    var Mxmax = MercatorGetXbyLongitude((longitude + DeltaLongitude));

    console.log("", (latitude - DeltaLatitude), (latitude + DeltaLatitude));
    var Mymin = MercatorGetYbyLatitude((latitude - DeltaLatitude));
    var Mymax = MercatorGetYbyLatitude((latitude + DeltaLatitude));
    console.log("", Mymin, Mymax);


    var Mxminp = parseInt(Mxmin);
    var Mxmaxp = Math.ceil(Mxmax);
    var Myminp = parseInt(Mymin);
    var Mymaxp = Math.ceil(Mymax);


    return [Mxmin, Mymin, Mxmax, Mymax, Mxminp, Myminp, Mxmaxp, Mymaxp];
    //var DeltaLatma
}

var LongitudeK = 18.25621546434640;

function MercatorGetXbyLongitude(Longitude) {
    var Zoom = 19;
    return Math.pow(2, LongitudeK + (Zoom - 19)) * Longitude / 360;
}

var LatitudeE = 0.0822699;
var LatitudeKContent = 114737.187;
function MercatorGetYbyLatitude(Lagitude) {
    var Zoom = 19;

    var r_lagitudu = (Lagitude) / 180.0 * Math.PI;
    return (Math.log10(1.0 / Math.cos(r_lagitudu) + Math.tan(r_lagitudu))
        + Math.log10((1 - LatitudeE * Math.sin(r_lagitudu)) / (1 + LatitudeE * Math.sin(r_lagitudu))) * LatitudeE / 2) * Math.pow(2, (Zoom - 19)) * LatitudeKContent;
}
function getBaiduPicIndex(longitude, latitude) {
    var xfloat = MercatorGetXbyLongitude(longitude);
    var yfloat = MercatorGetYbyLatitude(latitude);

    var xint = parseInt(xfloat);
    var yint = parseInt(yfloat);

    return [xfloat, yfloat, xint, yint];
}

function getBaiduPositionLat(MercatorY) {
    var maxLat = 89.9;
    var minLat = -89.9;
    var midLat = (maxLat + minLat) / 2;

    var maxM = MercatorGetYbyLatitude(maxLat);
    var midM = MercatorGetYbyLatitude(midLat);
    var minM = MercatorGetYbyLatitude(minLat);


    while (Math.abs(midM - MercatorY) > 0.1) {
        if (MercatorY > maxM) {
            return midLat;
        }
        else if (MercatorY > midM) {
            minLat = midLat;
            midLat = (maxLat + minLat) / 2;
            midM = MercatorGetYbyLatitude(midLat);
            minM = MercatorGetYbyLatitude(minLat);
        }
        else if (MercatorY > minM) {
            maxLat = midLat;
            midLat = (maxLat + minLat) / 2;
            maxM = MercatorGetYbyLatitude(maxLat);
            midM = MercatorGetYbyLatitude(midLat);
        }
        else {
            return midLat;
        }
    }
    return midLat;
}
function getBaiduPositionLatWithAccuracy(MercatorY, accuracy) {

    var maxLat = 89.9;
    var minLat = -89.9;
    var midLat = (maxLat + minLat) / 2;

    var maxM = MercatorGetYbyLatitude(maxLat);
    var midM = MercatorGetYbyLatitude(midLat);
    var minM = MercatorGetYbyLatitude(minLat);


    while (Math.abs(midM - MercatorY) > accuracy) {
        if (MercatorY > maxM) {
            return midLat;
        }
        else if (MercatorY > midM) {
            minLat = midLat;
            midLat = (maxLat + minLat) / 2;
            midM = MercatorGetYbyLatitude(midLat);
            minM = MercatorGetYbyLatitude(minLat);
        }
        else if (MercatorY > minM) {
            maxLat = midLat;
            midLat = (maxLat + minLat) / 2;
            maxM = MercatorGetYbyLatitude(maxLat);
            midM = MercatorGetYbyLatitude(midLat);
        }
        else {
            return midLat;
        }
    }
    return midLat;
}
function getBaiduPositionLon(MercatorX) {
    var Zoom = 19;
    return MercatorX * 360 / Math.pow(2, LongitudeK + (Zoom - 19))
}

function getLengthOfTwoPoint(lon1, lat1, lon2, lat2) {
    var rad = function (value) { return value / 180 * Math.PI };
    var radLat1 = rad(lat1);
    var radLat2 = rad(lat2);
    var a = radLat1 - radLat2;
    var b = rad(lon1) - rad(lon2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
    s = s * 6378137;
    return s;
}


