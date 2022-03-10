// from here drive
function addMarkersToMap(map) {

       var Marker = new H.map.Marker({lat:38.83567006143779, lng:-9.166379832879658});
       map.addObject(Marker);
   
   }
   
   // Initialize the platform object:
    var platform = new H.service.Platform({
     'apikey': 'rYmIieZTNAWDFv5vWj105Y_uvj77tyO0hUiiXB8aNA4'
   });
   
   // Obtain the default map types from the platform object
   var maptypes = platform.createDefaultLayers();
   
   // Instantiate (and display) a map object:
   var map = new H.Map(
     document.getElementById('map'),
     maptypes.vector.normal.map,  
     {
       zoom: 15 ,
       center: {lng: -9.166379832879658, lat: 38.83567006143779},
       pixelRatio: window.devicePixelRatio || 1
     });
   
     window.addEventListener('resize', function () {
       map.getViewPort().resize(); 
   });
    // Create the default UI:
    var ui = H.ui.UI.createDefault(map, maptypes);
    
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    
    window.onload = function () {
     addMarkersToMap(map);
   }

   function get_caminho() {

    function getLocation() {
      
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
      } else {
        document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
      }
    }
    
    function showPosition(position) {
  
      localStorage.setItem("latitude_real",position.coords.latitude);
      localStorage.setItem("longitude_real",position.coords.longitude);
      
    }
    
    var real_latitude = localStorage.getItem("latitude_real");
    var real_longitude = localStorage.getItem("longitude_real");
    var loja_lat = 38.830087229843;
    var loja_long =  -9.167405404589065;
  
    /**
   * Calculates and displays a walking route from the St Paul's Cathedral in London
   * to the Tate Modern on the south bank of the River Thames
   *
   * A full list of available request parameters can be found in the Routing API documentation.
   * see:  http://developer.here.com/rest-apis/documentation/routing/topics/resource-calculate-route.html
   *
   * 
   
   * @param   {H.service.Platform} platform    A stub class to access HERE services
   */
    
   
  
    function calculateRouteFromAtoB (platform) {
      getLocation();
       var router = platform.getRoutingService(null, 8),
           routeRequestParams = {
             routingMode: 'fast',
             transportMode: 'car',
             origin: real_latitude + ',' + real_longitude , 
             destination: loja_lat + ',' + loja_long,
             return: 'polyline,turnByTurnActions,actions,instructions,travelSummary'
           };
     
    
       router.calculateRoute(
         routeRequestParams,
         onSuccess,
         onError
       );
     }
     /**
      * This function will be called once the Routing REST API provides a response
      * @param  {Object} result          A JSONP object representing the calculated route
      *
      * see: http://developer.here.com/rest-apis/documentation/routing/topics/resource-type-calculate-route.html
      */
     function onSuccess(result) {
       var route = result.routes[0];
      /*
       * The styling of the route response on the map is entirely under the developer's control.
       * A representitive styling can be found the full JS + HTML code of this example
       * in the functions below:
       */
       addRouteShapeToMap(route);
       addManueversToMap(route);
  
       var startIcon = new H.map.Icon('images/person.png');
       var startMarker = new H.map.Marker({lat:real_latitude,   lng: real_longitude}, {icon: startIcon} );
        map.addObject(startMarker); 
       // ... etc.
     }
      
     /**
      * This function will be called if a communication error occurs during the JSON-P request
      * @param  {Object} error  The error message received.
      */
     function onError(error) {
       alert('Can\'t reach the remote server');
     }
     
     /**
      * Boilerplate map initialization code starts below:
      */
     
     // set up containers for the map  + panel
     var mapContainer = document.getElementById('map'),
       routeInstructionsContainer = document.getElementById('panel');
     
        // Hold a reference to any infobubble opened
        var bubble;
     
        /**
         * Opens/Closes a infobubble
         * @param  {H.geo.Point} position     The location on the map.
         * @param  {String} text              The contents of the infobubble.
         */
        function openBubble(position, text){
         if(!bubble){
            bubble =  new H.ui.InfoBubble(
              position,
              // The FO property holds the province name.
              {content: text});
            ui.addBubble(bubble);
          } else {
            bubble.setPosition(position);
            bubble.setContent(text);
            bubble.open();
          }
        }
 
     
     /**
      * Creates a H.map.Polyline from the shape of the route and adds it to the map.
      * @param {Object} route A route as received from the H.service.RoutingService
      */
     function addRouteShapeToMap(route){
       route.sections.forEach((section) => {
         // decode LineString from the flexible polyline
         let linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
     
         // Create a polyline to display the route:
         let polyline = new H.map.Polyline(linestring, {
           style: {
             lineWidth: 4,
             strokeColor: 'rgba(0, 128, 255, 0.7)'
           }
          
         });
     
         // Add the polyline to the map
         map.addObject(polyline);
         // And zoom to its bounding rectangle
         map.getViewModel().setLookAtData({
           bounds: polyline.getBoundingBox()
         });
       });
     }
     
     /**
      * Creates a series of H.map.Marker points from the route and adds them to the map.
      * @param {Object} route  A route as received from the H.service.RoutingService
      */
     function addManueversToMap(route){
       var svgMarkup = '<svg width="18" height="18" ' +
         'xmlns="http://www.w3.org/2000/svg">' +
         '<circle cx="8" cy="8" r="8" ' +
           'fill="#1b468d" stroke="white" stroke-width="1"  />' +
         '</svg>',
         dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
         group = new  H.map.Group(),
         i,
         j;
       route.sections.forEach((section) => {
         let poly = H.geo.LineString.fromFlexiblePolyline(section.polyline).getLatLngAltArray();
     
         let actions = section.actions;
         // Add a marker for each maneuver
         for (i = 0;  i < actions.length; i += 2) {
           let action = actions[i];
           var marker =  new H.map.Marker({
             lat: poly[action.offset * 3],
             lng: poly[action.offset * 3 + 1]},
             {icon: dotIcon});
           marker.instruction = action.instruction;
           group.addObject(marker);
         }
     
         group.addEventListener('tap', function (evt) {
           map.setCenter(evt.target.getGeometry());
           openBubble(
              evt.target.getGeometry(), evt.target.instruction);
         }, false);
     
         // Add the maneuvers group to the map
         map.addObject(group);
       });
     }
     
     // Now use the map as required...
     calculateRouteFromAtoB (platform);
  
  }
// end here drive