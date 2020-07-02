(function(){
    $("#businfo").css("display","none");
    $("#businfo").text("");

    let routenum = 0;
    //create map in leaflet and tie it to the div called 'theMap'
    var map = L.map('theMap');

    map.locate({setView: true, maxZoom: 16});

    function onLocationFound(e) {
        var radius = e.accuracy;    
        L.marker(e.latlng).addTo(map)
            .bindPopup("You are within " + radius + " meters from this point");
    }
    
    map.on('locationfound', onLocationFound);

    function onLocationError(e) {
        alert(e.message);
    }
    
    map.on('locationerror', onLocationError);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    var url ='https://hrmbuses.herokuapp.com/';

    var layer;

    function busRoute(){
    
        fetch(url)
        .then(response => response.json())
        .then(jsondata => {

            if(layer){
                map.removeLayer(layer);
            }

            let myArray;
            
            if(routenum == 0){
                myArray = jsondata.entity.filter(busInfo=> busInfo.vehicle.trip.routeId <= 10 || busInfo.vehicle.trip.routeId ==="9A"|| busInfo.vehicle.trip.routeId ==="9B");
            }
            else{
                myArray = jsondata.entity.filter(busInfo=> busInfo.vehicle.trip.routeId == routenum);
            }
            
            
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
                iconSize:[30,30],
                iconAnchor:[15,15]
                // popupAnchor:[0,0]
            });
            
            layer = L.geoJson(myArray,{
                    
                pointToLayer: (busData, latlng)=>
                    L.marker(latlng,{
                        icon: busIcon, 
                        rotationAngle: busData.properties.bearing
                    }).bindTooltip("Route ID: "+busData.properties.RouteID+"<br>Bus No:"+busData.properties.BusNo).on('click',function(){
                        $("#businfo").text("Route: "+busData.properties.RouteID);
                        $("#businfo").css("display","block");
                        setTimeout(function(){
                            $("#businfo").css("display","none");
                        },2000); 
                    })
                   
            }).addTo(map);  
            
            setTimeout(busRoute(),7000);  
        });
    }

    $("#busroutesearch").keyup(function(){
        routenum = $(this).val();
    })

    $("#searchicon").click(function(){
        routenum = $("#busroutesearch").val();
    })

    busRoute();
})()