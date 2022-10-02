Ext.define('muzkatMap.contextmenu.MapContextmenu', {
    extend: 'Ext.menu.Menu',
    alias: 'widget.muzkatOsmCm',

    parentCmpReference: undefined,
    mapEventReference: undefined,

    margin: '0 0 10 0',
    plain: true,
    items: [{
        iconCls: 'x-fa fa-map-marker',
        text: 'Marker platzieren',
        handler: function (btn) {
            var muzkatOsmCm = btn.up('muzkatOsmCm');
            var me = muzkatOsmCm.parentCmpReference,
                e = muzkatOsmCm.mapEventReference;
            me.placeMarker({
                id: new Date().getTime(),
                lat: e.latlng.lat,
                lng: e.latlng.lng,
                desc: 'dummy'
            })
        }
    }, {
        iconCls: 'x-fa fa-circle-o',
        text: 'Umkreis setzen',
        handler: function (btn) {
            var muzkatOsmCm = btn.up('muzkatOsmCm');
            var me = muzkatOsmCm.parentCmpReference,
                e = muzkatOsmCm.mapEventReference;
            L.circle(e.latlng, 500, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5
            }).addTo(me.map).bindPopup("Umkreis");
        }
    }]
});

