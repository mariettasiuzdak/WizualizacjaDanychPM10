        $("div.loader").show();
        $("div.container").addClass("loader-show");
        var map = L.map('map').setView([50.059463, 19.963891], 12);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
        	map._initPathRoot();
          var legend = L.control({position: 'bottomright'});
          legend.onAdd = function(map) {
              var div = L.DomUtil.create('div', 'info legend'),
                  grades = [0, 10, 20, 30, 40, 50, 60, 70, 90, 110, 130, 150],
                  labels = ['#009358', '#00d103', '#0ef712', '#b2e527', '#f9fc5f', '#FED976', '#FEB24C', '#FD8D3C', '#FC4E2A', '#E31A1C', '#BD0026', '#72062c'];
              for (var i = 0; i < grades.length; i++) {
                  div.innerHTML +=
                  "<div><div style='float: left; margin-bottom: 2px; margin-right: 4px;'>" + grades[i] +"</div>" + (" <div class='circle' style='background-color:" + labels[i] +";' > </div>") + "</div>" + '<br>';
              }
              return div;
          };

          legend.addTo(map);
          
          var svg = d3.select("#map").select("svg");
          var g = svg.append("g");

          $.ajax({
            type: 'post',
            url: 'sensor_data.php',
            success: function(data_1) {
                $("div.loader").hide();
                $("div.container").removeClass("loader-show");
                var pm10 = 10;
                createVisualisation(data_1, pm10);
                $("div#measurment-time").html("<p>Latest available</p>");
                $("div#measurment-date").html("Latest available");
                $("div#measurment-sensors").html("All");
            }
          });
