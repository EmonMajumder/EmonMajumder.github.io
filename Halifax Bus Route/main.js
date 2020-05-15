(function(){

    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap').setView([44.650627, -63.597140], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    L.marker([44.669178, -63.613382]).addTo(map)
        .bindPopup('You are here now.')
        .openPopup();   

        var url ='https://hrmbuses.herokuapp.com/';
   
        var layer;
    
        function busRoute(){
        
        fetch(url)
        .then(response => response.json())
        .then(jsondata => {

            //console.log(jsondata);

            if(layer){
                map.removeLayer(layer);
            }
            
            let myArray = jsondata.entity.filter(busInfo=> busInfo.vehicle.trip.routeId <= 10 || busInfo.vehicle.trip.routeId ==="9A"|| busInfo.vehicle.trip.routeId ==="9B");
            
            myArray = myArray.map(busInfo=>
            {
                return{
                "type": "Feature",
                "properties":
                    {
                        "RouteID": busInfo.vehicle.trip.routeId,
                        "TripID":busInfo.vehicle.trip.tripId,
                        "BusNo" : busInfo.vehicle.vehicle.id,                    
                        "bearing":busInfo.vehicle.position.bearing    
                    },
                "geometry": 
                    {
                    "type": "Point",
                    "coordinates": [busInfo.vehicle.position.longitude, busInfo.vehicle.position.latitude]
                    }
                }                
            });
    
            var busIcon = L.icon({
                iconUrl:'bus.png',
                iconSize:[50,50],
                iconAnchor:[25,25]
                // popupAnchor:[0,0]
            });
            
            layer = L.geoJson(myArray,{
                    
                pointToLayer: (busData, latlng)=>
                    L.marker(latlng,{
                        icon: busIcon, 
                        rotationAngle: busData.properties.bearing
                    }).bindTooltip(
                        "Route ID: "+busData.properties.RouteID+
                        "<br>Bus No:"+busData.properties.BusNo
                        )
                
                // ,
                // onEachFeature: (feature, layer)=>
                //     layer.bindPopup(
                //         "Route ID: "+feature.properties.RouteID+
                //         "<br>Bus No:"+feature.properties.BusNo)
    
            }).addTo(map);
    
            setTimeout(busRoute,7000);                     
        });

       }

       busRoute();
})()