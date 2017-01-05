function createVisualisation(data, pm) {
      var json = JSON.parse(data);
      var json_cluster = JSON.parse(data);
      // checking if there are duplicate values
      var coordinates_lat = [];
      var coordinates_lon = [];
      // making array of longitudes and array of latitudes
      if (json) {
            json.forEach(function(sensor) {
                  var lat = sensor.latitude;
                  var lon = sensor.longitude;
                  coordinates_lat.push(lat);
                  coordinates_lon.push(lon);
            });

            // checking if in these arrays there are duplicates
            var sorted_coord_lat =coordinates_lat.slice().sort();
            var sorted_coord_lon =coordinates_lon.slice().sort();
            var results_lat = [];
            var results_lon = [];
            for (var i = 0; i < coordinates_lat.length; i++) {
                if (sorted_coord_lat[i+1] == sorted_coord_lat[i]) {
                    results_lat.push(sorted_coord_lat[i]);
                }
            }
            results_lat.push(results_lat[0]);
            
            for (i = 0; i < coordinates_lon.length; i++) {
                if (sorted_coord_lon[i] == sorted_coord_lon[i-1]) {
                    results_lon.push(sorted_coord_lon[i]);
                }
            }
            results_lon.push(results_lon[0]);
            // creating indexes - if indexes of duplicates are the same in main latitudes and longitudes, this is pair!
      
            var geopairs = [];
            for (i=0; i < results_lat.length; i++){
              for (i=0; i < results_lon.length; i++){
                  var index_lon = coordinates_lon.indexOf(results_lon[i]);
                  var index_lat = coordinates_lat.indexOf(results_lat[i]);
                  //we have indexes, so when indexes are the same, we write the same lat and lon values into separate array
                  if (index_lat === index_lon){
                    geopairs.push({latitude: coordinates_lat[index_lat], longitude: coordinates_lon[index_lon]});
                  }
              }
            }
            var normal_sensors = [];
            var cluster_sensors = [];
            // creating new json for cluster sensors (with the same localisation)
            //geopairs.forEach(function(place){
              json.forEach(function(sensor){
                  if (geopairs.length > 1) {
                      if ((geopairs[0].latitude === sensor.latitude) && (geopairs[0].longitude === sensor.longitude)){
                              // add cluster items to new object
                              cluster_sensors.push(sensor);
                      }
                  }
                  else {
                  // add normal items to new object
                    normal_sensors.push(sensor);
                  }
              });
            createPoints_normal(json, pm);
            createPoints_cluster(cluster_sensors, pm);
      }
      else {
        svg.selectAll("*").remove();
      }
  }

  function createPoints_cluster(json, pm) {
      if (!pm) {
            pm = 10;
      }
      if (pm == 10) {
            if (svg) {
               svg.selectAll("*").remove();
            }
            var svg = d3.select("#map").select("svg");
            var g = svg.append("g");
            var pm10 =0;
            if (json) {
            json.forEach(function(d) {
            var lat = parseFloat(d.latitude);
            var lon = parseFloat(d.longitude);
            d.LatLng = new L.LatLng(lat,lon);
            pm10 += parseFloat(d.pm10);
            });
            json.forEach(function(d) {
              d.mid_pm10 = pm10/json.length;
            });
            }
            
            d3.select("body div#mapview").selectAll("div#tooltip").remove();
            var tooltip = d3.select("body div#mapview")
                .append("div")
                .attr("id", "tooltip")
                .style("position", "absolute")
                .style("z-index", "10")
                .style("opacity", 0);
            var cx, cy; 

             var feature = g.selectAll("path")
              .data(json)
              .enter().append("path")
                .attr("d", d3.svg.symbol()
                  .size(function() { return 500; })
                  .type(function(d) {
                        if (d.type === "public"){
                              var type = "circle";
                              return type;
                        }
                        else {
                              var type = "square";
                              return type;
                        }
                        return d.type; }))
              .style("stroke", function(d){
                  if (d.pm10 <= 10) {
                     return '#009358';
                   }
                   else if ((d.pm10 > 10) && (d.pm10 <= 20) ) {
                     return '#00d103';
                   }
                   else if ((d.pm10 > 20) && (d.pm10 <= 30) ) {
                     return '#0ef712';
                   }
                   else if ((d.pm10 > 30) && (d.pm10 <= 40) ) {
                     return '#b2e527'; 
                   }
                   else if ((d.pm10 > 40) && (d.pm10 <= 50) ) {
                     return '#f9fc5f';
                   }
                   else if ((d.pm10 > 50) && (d.pm10 <= 60 )) {
                     return '#FED976';
                   }
                   else if ((d.pm10 > 60) && (d.pm10 <= 70) ) {
                     return '#FEB24C';
                   }
                   else if ((d.pm10 > 70) && (d.pm10 <= 90) ) {
                     return '#FD8D3C'; 
                   }
                   else if ((d.pm10 > 90) && (d.pm10 <= 110) ) {
                     return '#FC4E2A';
                   }
                   else if ((d.pm10 > 110) && (d.pm10 <= 130) ) {
                     return '#E31A1C';
                   }
                    else if ((d.pm10 > 130) && (d.pm10 <= 150) ) {
                     return '#BD0026';
                    }
                   else if (d.pm10 > 150) {
                    return '#72062c';
                   }
                   else if (d.pm10 === '-'){
                        return "#bcbcbc";
                   }
                   else {
                        return "#bcbcbc";
                   } 
                 })
                  .style("stroke-width", 10)
                  .style("stroke-opacity", 1)  
                  .style("opacity", 1) 
                  .style("fill", function(d) {
                    $('div#tooltip').append("<table><tr><th width='50px'>Name</th><th width='50px'>PM10</th><th width='50px'>PM2.5</th><th width='50px'>Temp.</th><th width='50px'>Humidity</th><th width='50px'>Wind</th><th width='50px'>Measur. date</th><th width='50px'>Measur. hour</th></tr><tr><td>" + d.name + "</td><td width='50px'>" + d.pm10 + "μm</td><td width='50px'>" + d.pm25 + "μm</td><td width='50px'>" + d.temperature + "°C</td><td width='50px'>" + d.humidity + "%</td><td width='50px'>" + d.wind + "km/h</td><td width='50px'>" + d.measurment_date + "</td><td width='50px'>" + d.measurment_hour + "</td></tr></table>");              
                      if (d.pm10 <= 10) {
                        return '#009358';
                      }
                      else if ((d.pm10 > 10) && (d.pm10 <= 20) ) {
                        return '#00d103';
                      }
                      else if ((d.pm10 > 20) && (d.pm10 <= 30) ) {
                        return '#0ef712';
                      }
                      else if ((d.pm10 > 30) && (d.pm10 <= 40) ) {
                        return '#b2e527'; 
                      }
                      else if ((d.pm10 > 40) && (d.pm10 <= 50) ) {
                        return '#f9fc5f';
                      }
                      else if ((d.pm10 > 50) && (d.pm10 <= 60 )) {
                        return '#FED976';
                      }
                      else if ((d.pm10 > 60) && (d.pm10 <= 70) ) {
                        return '#FEB24C';
                      }
                      else if ((d.pm10 > 70) && (d.pm10 <= 90) ) {
                        return '#FD8D3C'; 
                      }
                      else if ((d.pm10 > 90) && (d.pm10 <= 110) ) {
                        return '#FC4E2A';
                      }
                      else if ((d.pm10 > 110) && (d.pm10 <= 130) ) {
                        return '#E31A1C';
                      }
                       else if ((d.pm10 > 130) && (d.pm10 <= 150) ) {
                        return '#BD0026';
                       }
                        else if (d.pm10 > 150) {
                    return '#72062c';
                   }
                   else if (d.pm10 === '-'){
                        return "#bcbcbc";
                   }
                   else {
                        return "#bcbcbc";
                   }               
                      })
                      .attr("r", 12)
                      .on("mouseover", function(d){
                        $('div#tooltip').show();
                        //$('div#tooltip').append("<table><tr><th>Name</th><th>PM10</th><th>PM2.5</th><th>Temparature</th><th>Humidity</th><th>Wind</th></tr><tr><td>" + d.name + "</td><td>" + d.pm10 + "</td><td>" + d.pm25 + "</td><td>" + d.temperature + "</td><td>" + d.humidity + "</td><td>" + d.wind + "</td></tr></table>");              
                            return tooltip.transition()
                            .duration(50)
                            .style("opacity", 0.9);
                      })
                      .on("mousemove", function(d){
                              var top_position = event.pageY-200;
                              var left_position = event.pageX-50;
                              return tooltip
                               .style("top", (top_position)+"px").style("left",(left_position)+"px");
                        })
                      .on("mouseout", function(d){
                          $('div#tooltip').hide();
                          return tooltip.style("opacity", 0);
                        });
                  var text = g.selectAll("text")
                      .data(json)
                      .enter()
                        .append("text")
                        .attr("transform", 
                          function(d) {
                            return "translate("+ 
                              map.latLngToLayerPoint(d.LatLng).x +","+ 
                              map.latLngToLayerPoint(d.LatLng).y +")";
                            }
                              )
                        .attr('cx', (function(d){
                             var t = d3.transform(d3.select(this).attr("transform"));
                             var cx = t.translate[0];
                           return cx;
                       }))
                       .attr('cy', (function(d){
                            var t = d3.transform(d3.select(this).attr("transform"));
                            var cy = t.translate[1];
                            return cy;
                       }))
                      .attr("x", function(d){
                          var pm10val = Math.round(d.mid_pm10).toString().length;
                          if (pm10val === 2) {
                              return -8;
                          } else if (pm10val === 3) {
                              return -8;
                          } else if (pm10val === 4) {
                              return -12;
                          }
                       })
                       .attr("y", 5)
                       .text(function(d){
                              return Math.round(d.mid_pm10);
                       })
                      .attr("font-family", "arial")
                      .attr("font-size", "15px")
                      .attr("fill", "black")
                      .on("mouseover", function(){
                              $('div#tooltip').show();
                              //$('div#tooltip').append("<table><tr><th>Name</th><th>PM10</th><th>PM2.5</th><th>Temparature</th><th>Humidity</th><th>Wind</th></tr><tr><td>" + d.name + "</td><td>" + d.pm10 + "</td><td>" + d.pm25 + "</td><td>" + d.temperature + "</td><td>" + d.humidity + "</td><td>" + d.wind + "</td></tr></table>");
                              return tooltip.transition()
                                    .duration(50)
                                    .style("opacity", 0.9);
                      })
                      .on("mousemove", function(){
                              var top_position = event.pageY-200;
                              var left_position = event.pageX-50;
                              return tooltip
                                    .style("top", (top_position)+"px").style("left",(left_position)+"px");
                      })
                      .on("mouseout", function(){
                      $('div#tooltip').hide();
                              return tooltip.style("opacity", 0);
                      });
                     
                      map.on("viewreset", update);
                      update();
      
                      function update() {
                        feature.attr("transform", 
                        function(d) { 
                          return "translate("+ 
                            map.latLngToLayerPoint(d.LatLng).x +","+ 
                            map.latLngToLayerPoint(d.LatLng).y +")";
                          }
                        );
                        text.attr("transform", 
                        function(d) { 
                          return "translate("+ 
                            map.latLngToLayerPoint(d.LatLng).x +","+ 
                            map.latLngToLayerPoint(d.LatLng).y +")";
                          }
                        );
                      }
      } else {
            if (svg) {
                svg.selectAll("*").remove();
             }
             var svg = d3.select("#map").select("svg");
             var g = svg.append("g");
             var pm25 =0;
             if (json) {
                  json.forEach(function(d) {
                        var lat = parseFloat(d.latitude);
                        var lon = parseFloat(d.longitude);
                        d.LatLng = new L.LatLng(lat,lon);
                        pm25 += parseFloat(d.pm25);
                  });
                  json.forEach(function(d) {
                        d.mid_pm25 = pm25/json.length;
                  });
             }
             
              d3.select("body div#mapview").selectAll("div#tooltip").remove();
              var tooltip = d3.select("body div#mapview")
                 .append("div")
                 .attr("id", "tooltip")
                 .style("position", "absolute")
                 .style("font-size", "9px")
                 .style("z-index", "10")
                 .style("opacity", 0);
             var cx, cy; 

              var feature = g.selectAll("path")
               .data(json)
               .enter().append("path")
               .attr("d", d3.svg.symbol()
                  .size(function() { return 500; })
                  .type(function(d) {
                        if (d.type === "public"){
                              var type = "circle";
                              return type;
                        }
                        else {
                              var type = "square";
                              return type;
                        }
                        return d.type; }))
               .style("stroke", function(d){
                   if (d.pm25 <= 10) {
                      return '#009358';
                    }
                    else if ((d.pm25 > 10) && (d.pm25 <= 20) ) {
                      return '#00d103';
                    }
                    else if ((d.pm25 > 20) && (d.pm25 <= 30) ) {
                      return '#0ef712';
                    }
                    else if ((d.pm25 > 30) && (d.pm25 <= 40) ) {
                      return '#b2e527'; 
                    }
                    else if ((d.pm25 > 40) && (d.pm25 <= 50) ) {
                      return '#f9fc5f';
                    }
                    else if ((d.pm25 > 50) && (d.pm25 <= 60 )) {
                      return '#FED976';
                    }
                    else if ((d.pm25 > 60) && (d.pm25 <= 70) ) {
                      return '#FEB24C';
                    }
                    else if ((d.pm25 > 70) && (d.pm25 <= 90) ) {
                      return '#FD8D3C'; 
                    }
                    else if ((d.pm25 > 90) && (d.pm25 <= 110) ) {
                      return '#FC4E2A';
                    }
                    else if ((d.pm25 > 110) && (d.pm25 <= 130) ) {
                      return '#E31A1C';
                    }
                     else if ((d.pm25 > 130) && (d.pm25 <= 150) ) {
                      return '#BD0026';
                     }
                    else if (d.pm25 > 150) {
                     return '#72062c';
                    }
                    else if (d.pm25 === '-'){
                         return "#bcbcbc";
                    }
                    else {
                         return "#bcbcbc";
                    } 
                  })
                   .style("stroke-width", 10)
                   .style("stroke-opacity", 1)  
                   .style("opacity", 1) 
                   .style("fill", function(d) {
                     $('div#tooltip').append("<table><tr><th width='50px'>Name</th><th width='50px'>PM10</th><th width='50px'>PM2.5</th><th width='50px'>Temp.</th><th width='50px'>Humidity</th><th width='50px'>Wind</th><th width='50px'>Measur. date</th><th width='50px'>Measur. hour</th></tr><tr><td>" + d.name + "</td><td width='50px'>" + d.pm10 + "μm</td><td width='50px'>" + d.pm25 + "μm</td><td width='50px'>" + d.temperature + "°C</td><td width='50px'>" + d.humidity + "%</td><td width='50px'>" + d.wind + "km/h</td><td width='50px'>" + d.measurment_date + "</td><td width='50px'>" + d.measurment_hour + "</td></tr></table>");              
                       if (d.pm25 <= 10) {
                         return '#009358';
                       }
                       else if ((d.pm25 > 10) && (d.pm25 <= 20) ) {
                         return '#00d103';
                       }
                       else if ((d.pm25 > 20) && (d.pm25 <= 30) ) {
                         return '#0ef712';
                       }
                       else if ((d.pm25 > 30) && (d.pm25 <= 40) ) {
                         return '#b2e527'; 
                       }
                       else if ((d.pm250 > 40) && (d.pm25 <= 50) ) {
                         return '#f9fc5f';
                       }
                       else if ((d.pm25 > 50) && (d.pm25 <= 60 )) {
                         return '#FED976';
                       }
                       else if ((d.pm25 > 60) && (d.pm25 <= 70) ) {
                         return '#FEB24C';
                       }
                       else if ((d.pm25 > 70) && (d.pm25 <= 90) ) {
                         return '#FD8D3C'; 
                       }
                       else if ((d.pm25 > 90) && (d.pm25 <= 110) ) {
                         return '#FC4E2A';
                       }
                       else if ((d.pm25 > 110) && (d.pm25 <= 130) ) {
                         return '#E31A1C';
                       }
                        else if ((d.pm25 > 130) && (d.pm25 <= 150) ) {
                         return '#BD0026';
                        }
                         else if (d.pm25 > 150) {
                     return '#72062c';
                    }
                    else if (d.pm25 === '-'){
                         return "#bcbcbc";
                    }
                    else {
                         return "#bcbcbc";
                    }               
                       })
                       .attr("r", 12)
                       .on("mouseover", function(d){
                         $('div#tooltip').show();
                         //$('div#tooltip').append("<table><tr><th>Name</th><th>PM10</th><th>PM2.5</th><th>Temparature</th><th>Humidity</th><th>Wind</th></tr><tr><td>" + d.name + "</td><td>" + d.pm10 + "</td><td>" + d.pm25 + "</td><td>" + d.temperature + "</td><td>" + d.humidity + "</td><td>" + d.wind + "</td></tr></table>");              
                             return tooltip.transition()
                             .duration(50)
                             .style("opacity", 0.9);
                       })
                       .on("mousemove", function(d){
                              var top_position = event.pageY-200;
                              var left_position = event.pageX-50;
                              return tooltip
                               .style("top", (top_position)+"px").style("left",(left_position)+"px");
                         })
                       .on("mouseout", function(d){
                           $('div#tooltip').hide();
                           return tooltip.style("opacity", 0);
                         });
                   //d3.select("g").selectAll("text").remove();
                   var text = g.selectAll("text")
                       .data(json)
                       .enter()
                         .append("text")
                         .attr("transform", 
                           function(d) {
                             return "translate("+ 
                               map.latLngToLayerPoint(d.LatLng).x +","+ 
                               map.latLngToLayerPoint(d.LatLng).y +")";
                             }
                               )
                         .attr('cx', (function(d){
                              var t = d3.transform(d3.select(this).attr("transform"));
                              var cx = t.translate[0];
                            return cx;
                        }))
                        .attr('cy', (function(d){
                             var t = d3.transform(d3.select(this).attr("transform"));
                             var cy = t.translate[1];
                             return cy;
                        }))
                       .attr("x", function(d){
                           var pm25val = Math.round(d.mid_pm25).toString().length;
                           if (pm25val === 2) {
                               return -8;
                           } else if (pm25val === 3) {
                               return -8;
                           } else if (pm25val === 4) {
                               return -12;
                           }
                        })
                        .attr("y", 5)
                        .text(function(d){
                              return Math.round(d.mid_pm25);
                        })
                       .attr("font-family", "arial")
                       .attr("font-size", "15px")
                       .attr("fill", "black")
                       .on("mouseover", function(d){
                              $('div#tooltip').show();
                              //$('div#tooltip').append("<table><tr><th>Name</th><th>PM10</th><th>PM2.5</th><th>Temparature</th><th>Humidity</th><th>Wind</th></tr><tr><td>" + d.name + "</td><td>" + d.pm10 + "</td><td>" + d.pm25 + "</td><td>" + d.temperature + "</td><td>" + d.humidity + "</td><td>" + d.wind + "</td></tr></table>");
                              return tooltip.transition()
                                    .duration(50)
                                    .style("opacity", 0.9);
                       })
                       .on("mousemove", function(){
                              var top_position = event.pageY-200;
                              var left_position = event.pageX-50;
                              return tooltip
                                    .style("top", (top_position)+"px").style("left",(left_position)+"px");
                        })
                       .on("mouseout", function(){
                       $('div#tooltip').hide();
                              return tooltip.style("opacity", 0);
                       });
                      
                       map.on("viewreset", update);
                       update();
            
                       function update() {
                         feature.attr("transform", 
                         function(d) { 
                           return "translate("+ 
                             map.latLngToLayerPoint(d.LatLng).x +","+ 
                             map.latLngToLayerPoint(d.LatLng).y +")";
                           }
                         );
                         text.attr("transform", 
                         function(d) { 
                           return "translate("+ 
                             map.latLngToLayerPoint(d.LatLng).x +","+ 
                             map.latLngToLayerPoint(d.LatLng).y +")";
                           }
                         );
                       }
      }
  }

  function createPoints_normal(json, pm) {
      if(!pm){
            pm = 10;
      }
      if (pm == 25) {
            if (svg) {
                svg.selectAll("*").remove();
            }
            var svg2 = d3.select("#map").select("svg");
            var g2 = svg2.append("g");
              if (json) {
              json.forEach(function(d) {
                var lat = parseFloat(d.latitude);
                var lon = parseFloat(d.longitude);
                d.LatLng = new L.LatLng(lat,lon);
              });
              }
              d3.select("body div#mapview").selectAll("div#tooltip_nor").remove();
              var tooltip_nor = d3.select("body div#mapview")
                  .append("div")
                  .attr("id", "tooltip_nor")
                  .style("position", "absolute")
                  .style("z-index", "10")
                  .style("opacity", 0);
                  
              var cx, cy;
  
              var feature = g2.selectAll("path")
                .data(json)
                .enter().append("path")
                .attr("d", d3.svg.symbol()
                  .size(function(d) { return 500; })
                  .type(function(d) {
                        if (d.type === "public"){
                              var type = "circle";
                              return type;
                        }
                        else {
                              var type = "square";
                              return type;
                        }
                        return d.type; }))
                .style("stroke", function(d){
                    if (d.pm25 <= 10) {
                      return '#009358';
                    }
                    else if ((d.pm25 > 10) && (d.pm25 <= 20) ) {
                      return '#00d103';
                    }
                    else if ((d.pm25 > 20) && (d.pm25 <= 30) ) {
                      return '#0ef712';
                    }
                    else if ((d.pm25 > 30) && (d.pm25 <= 40) ) {
                      return '#b2e527'; 
                    }
                    else if ((d.pm25 > 40) && (d.pm25 <= 50) ) {
                      return '#f9fc5f';
                    }
                    else if ((d.pm25 > 50) && (d.pm25 <= 60 )) {
                      return '#FED976';
                    }
                    else if ((d.pm25 > 60) && (d.pm25 <= 70) ) {
                      return '#FEB24C';
                    }
                    else if ((d.pm25 > 70) && (d.pm25 <= 90) ) {
                      return '#FD8D3C'; 
                    }
                    else if ((d.pm25 > 90) && (d.pm25 <= 110) ) {
                      return '#FC4E2A';
                    }
                    else if ((d.pm25 > 110) && (d.pm25 <= 130) ) {
                      return '#E31A1C';
                    }
                     else if ((d.pm25 > 130) && (d.pm25 <= 150) ) {
                      return '#BD0026';
                     }
                     else if (d.pm25 > 150) {
                      return '#72062c';
                     }
                     else if (d.pm25 === '-'){
                          return "#bcbcbc";
                     }
                     else {
                          return "#bcbcbc";
                     }
                   })
                    .style("stroke-width", 10)
                    .style("stroke-opacity", 0.6)  
                    .style("opacity", 0.8) 
                    .style("fill", function(d) {
                        if (d.pm25 <= 10) {
                          return '#009358';
                        }
                        else if ((d.pm25 > 10) && (d.pm25 <= 20) ) {
                          return '#00d103';
                        }
                        else if ((d.pm25 > 20) && (d.pm25 <= 30) ) {
                          return '#0ef712';
                        }
                        else if ((d.pm25 > 30) && (d.pm25 <= 40) ) {
                          return '#b2e527'; 
                        }
                        else if ((d.pm25 > 40) && (d.pm25 <= 50) ) {
                          return '#f9fc5f';
                        }
                        else if ((d.pm25 > 50) && (d.pm25 <= 60 )) {
                          return '#FED976';
                        }
                        else if ((d.pm25 > 60) && (d.pm25 <= 70) ) {
                          return '#FEB24C';
                        }
                        else if ((d.pm25 > 70) && (d.pm25 <= 90) ) {
                          return '#FD8D3C'; 
                        }
                        else if ((d.pm25 > 90) && (d.pm25 <= 110) ) {
                          return '#FC4E2A';
                        }
                        else if ((d.pm25> 110) && (d.pm25 <= 130) ) {
                          return '#E31A1C';
                        }
                         else if ((d.pm25 > 130) && (d.pm25 <= 150) ) {
                          return '#BD0026';
                         }
                          else if (d.pm25 > 150) {
                    
                          return '#72062c';
                         }
                         else if (d.pm25 === '-'){
                              return "#bcbcbc";
                         }
                         else {
                              return "#bcbcbc";
                         }  
                        })
                        .attr("r", 12)
                        .on("mouseover", function(d){
                          $('div#tooltip_nor').show();
                              return tooltip_nor.transition()
                              .duration(50)
                              .style("opacity", 0.9);
                        })
                        .on("mousemove", function(d){
                              
                              var top_position = event.pageY-200;
                              var left_position = event.pageX-50;
                              return tooltip_nor
                               .style("top", (top_position)+"px").style("left",(left_position)+"px");
                          })
                        .on("mouseout", function(d){
                            $('div#tooltip_nor').hide();
                            return tooltip_nor.style("opacity", 0);
                          })
                        .on("click", function (d) {
                          $("div#myModal div.modal-header h4").html(d.name);
                          $("div#myModal div.modal-header p").html(d.id);
                            $("#myModal").modal('show'); 
                            createGraph(d, 25);
                        });
                    var text = g2.selectAll("text")
                        .data(json)
                        .enter()
                          .append("text")
                          .attr("transform", 
                            function(d) { 
                              return "translate("+ 
                                map.latLngToLayerPoint(d.LatLng).x +","+ 
                                map.latLngToLayerPoint(d.LatLng).y +")";
                              }
                                )
                          .attr('cx', (function(d){
                               var t = d3.transform(d3.select(this).attr("transform"));
                               var cx = t.translate[0];
                             return cx;
                         }))
                         .attr('cy', (function(d){
                              var t = d3.transform(d3.select(this).attr("transform"));
                              var cy = t.translate[1];
                              return cy;
                         }))
                         .attr("x", function(d){
                              if (d.type === "public") {
                                    if (Math.round(d.pm25).toString().length === 2) {
                                        return -8;
                                    } else if (Math.round(d.pm25).toString().length === 3) {
                                        return -12;
                                    }
                                    else if (Math.round(d.pm25).toString().length === 4) {
                                        return -12;
                                    }
                              } else {
                                     if (Math.round(d.pm25).toString().length === 2) {
                                        return -8;
                                    } else if (Math.round(d.pm25).toString().length === 3) {
                                        return -12;
                                    }
                                    else if (Math.round(d.pm25).toString().length === 4) {
                                        return -12;
                                    }
                                    else if (Math.round(d.pm25).toString().length === 5) {
                                        return -16;
                                    }
                              }
                         })
                         .attr("y", 5)
                        .text(function(d){
                         return Math.round(d.pm25);
                         })
                        .attr("font-family", "arial")
                        .attr("font-size", "15px")
                        .attr("fill", "black")
                        
                       .on("mouseover", function(d){
                          tooltip_nor.html("Name: " + d.name + "<br/>" + "PM10: " + d.pm10 + "μm" + "<br/>" + "PM2.5: " + d.pm25 + "μm" + "<br/>" + "Temperature: " + d.temperature + "°C"+ "<br/>" + "Humidity: " + d.humidity + "%" + "<br/>" + "Wind: " + d.wind + "km/h" + "<br/>" + "Measurment date: " + d.measurment_date + "<br/>" + "Measurment hour: " + d.measurment_hour);
                            $('div#tooltip_nor').show();
                            return tooltip_nor.transition()
                             .duration(50)
                             .style("opacity", 0.9);
                         
                       })
                       .on("mousemove", function(){ 
                         
                              var top_position = event.pageY-200;
                              var left_position = event.pageX-50;
                              return tooltip_nor
                               .style("top", (top_position)+"px").style("left",(left_position)+"px");
                         })
                       .on("mouseout", function(){
                          $('div#tooltip_nor').hide();
                         return tooltip_nor.style("opacity", 0);
                         })
                       .on("click", function (d) {
                          $("div#myModal div.modal-header h4").html(d.name);
                          $("div#myModal div.modal-header p").html(d.id);
                          $("#myModal").modal('show'); 
                            createGraph(d, 10);
         
                       });
                       
                        map.on("viewreset", update);
                        update();
        
                        function update() {
                          feature.attr("transform", 
                          function(d) { 
                            return "translate("+ 
                              map.latLngToLayerPoint(d.LatLng).x +","+ 
                              map.latLngToLayerPoint(d.LatLng).y +")";
                            }
                          );
                          text.attr("transform", 
                          function(d) { 
                            return "translate("+ 
                              map.latLngToLayerPoint(d.LatLng).x +","+ 
                              map.latLngToLayerPoint(d.LatLng).y +")";
                            }
                          );
            }
      } else if (pm == 10) {
            if (svg) {
                  svg.selectAll("*").remove();
            }
            var svg2 = d3.select("#map").select("svg");
            var g2 = svg2.append("g");
              if (json) {
              json.forEach(function(d) {
                var lat = parseFloat(d.latitude);
                var lon = parseFloat(d.longitude);
                d.LatLng = new L.LatLng(lat,lon);
              });
              }
              d3.select("body div#currentinfo").selectAll("div#tooltip_nor").remove();
              var tooltip_nor = d3.select("body div#currentinfo")
                  .append("div")
                  .attr("id", "tooltip_nor")
                  .attr("class", "alert alert-info")
                  .style("z-index", "10")
                  .style("opacity", 0);
                  
              var cx, cy;
              var feature = g2.selectAll("path")
                .data(json)
                .enter().append("path")
                .attr("d", d3.svg.symbol()
                  .size(function(d) {
                        return 500; })
                  .type(function(d) {
                        if (d.type === "public"){
                              var type = "circle";
                              return type;
                        }
                        else {
                              var type = "square";
                              return type;
                        }
                        }))
                .style("stroke", function(d){
                    if (d.pm10 <= 10) {
                      return '#009358';
                    } else if ((d.pm10 > 10) && (d.pm10 <= 20) ) {
                      return '#00d103';
                    } else if ((d.pm10 > 20) && (d.pm10 <= 30) ) {
                      return '#0ef712';
                    } else if ((d.pm10 > 30) && (d.pm10 <= 40) ) {
                      return '#b2e527'; 
                    } else if ((d.pm10 > 40) && (d.pm10 <= 50) ) {
                      return '#f9fc5f';
                    } else if ((d.pm10 > 50) && (d.pm10 <= 60 )) {
                      return '#FED976';
                    } else if ((d.pm10 > 60) && (d.pm10 <= 70) ) {
                      return '#FEB24C';
                    } else if ((d.pm10 > 70) && (d.pm10 <= 90) ) {
                      return '#FD8D3C'; 
                    } else if ((d.pm10 > 90) && (d.pm10 <= 110) ) {
                      return '#FC4E2A';
                    } else if ((d.pm10 > 110) && (d.pm10 <= 130) ) {
                      return '#E31A1C';
                    } else if ((d.pm10 > 130) && (d.pm10 <= 150) ) {
                      return '#BD0026';
                    } else if (d.pm10 > 150) {
                      return '#72062c';
                    } else if (d.pm10 === '-'){
                      return "#bcbcbc";
                    } else {
                      return "#bcbcbc";
                    }
                   })
                    .style("stroke-width", 10)
                    .style("stroke-opacity", 0.6)  
                    .style("opacity", 0.8) 
                    .style("fill", function(d) {
                        if (d.pm10 <= 10) {
                          return '#009358';
                        } else if ((d.pm10 > 10) && (d.pm10 <= 20) ) {
                          return '#00d103';
                        } else if ((d.pm10 > 20) && (d.pm10 <= 30) ) {
                          return '#0ef712';
                        } else if ((d.pm10 > 30) && (d.pm10 <= 40) ) {
                          return '#b2e527'; 
                        } else if ((d.pm10 > 40) && (d.pm10 <= 50) ) {
                          return '#f9fc5f';
                        } else if ((d.pm10 > 50) && (d.pm10 <= 60 )) {
                          return '#FED976';
                        } else if ((d.pm10 > 60) && (d.pm10 <= 70) ) {
                          return '#FEB24C';
                        } else if ((d.pm10 > 70) && (d.pm10 <= 90) ) {
                          return '#FD8D3C'; 
                        } else if ((d.pm10 > 90) && (d.pm10 <= 110) ) {
                          return '#FC4E2A';
                        } else if ((d.pm10 > 110) && (d.pm10 <= 130) ) {
                          return '#E31A1C';
                        } else if ((d.pm10 > 130) && (d.pm10 <= 150) ) {
                          return '#BD0026';
                        } else if (d.pm10 > 150) {
                          return '#72062c';
                        } else if (d.pm10 === '-'){
                          return "#bcbcbc";
                        } else {
                          return "#bcbcbc";
                        }  
                        })
                        .attr("r", 12)
                        .on("mouseover", function(d){
                          $('div#tooltip_nor').show();
                              return tooltip_nor.transition()
                              .duration(50)
                              .style("opacity", 0.9);
                        })
                        .on("mousemove", function(d){
                               return tooltip_nor;
                         })
                        .on("mouseout", function(d){
                            $('div#tooltip_nor').hide();
                            return tooltip_nor.style("opacity", 0);
                          })
                        .on("click", function (d) {
                          $("div#myModal div.modal-header h4").html(d.name);
                           $("div#myModal div.modal-header p").html(d.id);
                            $("#myModal").modal('show'); 
                            createGraph(d);
                        });

                    var text = g2.selectAll("text")
                        .data(json)
                        .enter()
                          .append("text")
                          .attr("transform", 
                            function(d) { 
                              return "translate("+ 
                                map.latLngToLayerPoint(d.LatLng).x +","+ 
                                map.latLngToLayerPoint(d.LatLng).y +")";
                              }
                                )
                          .attr('cx', (function(d){
                               var t = d3.transform(d3.select(this).attr("transform"));
                               var cx = t.translate[0];
                             return cx;
                         }))
                         .attr('cy', (function(d){
                              var t = d3.transform(d3.select(this).attr("transform"));
                              var cy = t.translate[1];
                              return cy;
                         }))
                         .attr("x", function(d){
                              if (d.type === "public") {
                                    if (Math.round(d.pm10).toString().length === 2) {
                                        return -8;
                                    } else if (Math.round(d.pm10).toString().length === 3) {
                                        return -12;
                                    } else if (Math.round(d.pm10).toString().length === 1) {
                                        return -4;
                                    } else if (Math.round(d.pm10).toString().length === 4) {
                                        return -10;
                                    }
                              } else {
                                     if (Math.round(d.pm10).toString().length === 2) {
                                        return -8;
                                    } else if (Math.round(d.pm10).toString().length === 3) {
                                        return -12;
                                    } else if (Math.round(d.pm10).toString().length === 1) {
                                        return -4;
                                    } else if (Math.round(d.pm10).toString().length === 4) {
                                        return -10;
                                    } else if (Math.round(d.pm10).toString().length === 5) {
                                        return -10;
                                    }
                              }  
                         })
                         .attr("y", 5)
                        .text(function(d){
                         return Math.round(d.pm10);
                         })
                        .attr("font-family", "arial")
                        .attr("font-size", "15px")
                        .attr("fill", "black")
                        
                       .on("mouseover", function(d){
                          tooltip_nor.html("Name: " + d.name + "<br/>" + "PM10: " + d.pm10 + "μm" + "<br/>" + "PM2.5: " + d.pm25 + "μm" + "<br/>" + "Temperature: " + d.temperature + "°C"+ "<br/>" + "Humidity: " + d.humidity + "%" + "<br/>" + "Wind: " + d.wind + "km/h" + "<br/>" + "Measurment date: " + d.measurment_date + "<br/>" + "Measurment hour: " + d.measurment_hour);
                            $('div#tooltip_nor').show();
                            return tooltip_nor.transition()
                             .duration(500)
                             .style("opacity", 0.9);
                       })
                       .on("mousemove", function(){
                              return tooltip_nor;
                        })
                       .on("mouseout", function(){
                              $('div#tooltip_nor').hide();
                              return tooltip_nor.style("opacity", 0);
                         })
                       .on("click", function (d) {
                          $("div#myModal div.modal-header h4").html(d.name);
                          $("div#myModal div.modal-header p").html(d.id);
                          $("#myModal").modal('show'); 
                            createGraph(d);
                       });

                        map.on("viewreset", update);
                        update();

                        function update() {
                          feature.attr("transform", 
                          function(d) {
                            return "translate("+ 
                              map.latLngToLayerPoint(d.LatLng).x +","+ 
                              map.latLngToLayerPoint(d.LatLng).y +")";
                            }
                          );
                          text.attr("transform", 
                          function(d) { 
                            return "translate("+ 
                              map.latLngToLayerPoint(d.LatLng).x +","+ 
                              map.latLngToLayerPoint(d.LatLng).y +")";
                            }
                          );
                        }
      }
      
  }
  
  function createGraph(g, pm, sensor_id, date, date2, action, field) {
      // graph based on https://bl.ocks.org/mbostock/3902569
      if (!pm){
            pm = "pm10";
      }
      if (pm === "pm10") {
            
            if (!action) {
                  action = 'one_day';
            }
            if (!date) {
                  var today = new Date();
                  var day = today.getDate();
                  var month = today.getMonth()+1;
                  var year = today.getFullYear();
                  if(day<10) {
                      day='0'+day;
                  } 
                  if(month<10) {
                      month='0'+month;
                  } 
                  date = year+'-'+month+'-'+day;
            }
            var sensor;
            if (g) {
                  sensor = g.id;
            } else {
                  sensor = sensor_id; 
            }
            
            $.ajax({
                  type: 'post',
                  url: 'sensor_data_graph.php',
                  data: {'sensor': sensor, 'date': date, 'date2': date2, 'action': action},
                  success: function(data1) {
                        $("div#graph-info").html('<p> <strong> Date: </strong>' + date + '</p> <p><strong>Change the graph</strong> to show data from certain day, month or chosen period of time. </p>');
                        data1 = JSON.parse(data1);
                        if (field){
                              field = "graph2";
                        } else {
                              field = "graph";
                        }
                        
                        if ($("div#" + field + " svg")) {
                              d3.selectAll('div#' + field + ' svg').remove();
                        }
            
                        var margin = {top: 20, right: 50, bottom: 30, left: 50}, width = 460, height = 295;
      
                        var bisectDate = d3.bisector(function(d) { return d.date; }).left,
                            unit = function(d) { return d + ' µg/m3'; };
      
                        var x = d3.time.scale()
                            .range([0, width]);
                        
                        var y = d3.scale.linear()
                            .range([height, 0]);
                        
                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");
                        
                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("left");
                        
                        var line = d3.svg.line()
                            .x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d.dust); });
         
                        var svg3 = d3.select("div#" + field + "").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + 2*(margin.top) + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                        
                          data1.forEach(function(d) {
                              var timestamp = d.measurment_date + 'T' + d.measurment_hour;
                              d.date = d3.time.format('%Y-%m-%dT%X').parse(timestamp);
                              d.dust = parseFloat(d.pm10);
                              if (isNaN(d.dust)){
                                    d.dust = 1;
                              }
                          });
      
                        data1.sort(function(a, b) {
                          return a.date - b.date;
                        });
                
                        x.domain([data1[0].date, data1[data1.length - 1].date]);
                        y.domain(d3.extent(data1, function(d) { return d.dust; }));
      
                        svg3.append("g")
                            .attr("class", "x axis xaxis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);
                            
                        svg3.selectAll(".xaxis text") 
                          .attr("transform", function(d) {
                             return "translate(" + this.getBBox().height*-2 + "," + this.getBBox().height + ")rotate(-45)";
                         });
      
                        svg3.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                          .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("PM10 [µg/m3]");
      
                        svg3.append("path")
                            .datum(data1)
                            .attr("class", "line")
                             .attr("d", line);
                      
                        var focus = svg3.append("g")
                            .attr("class", "focus")
                            .style("display", "none");
      
                        focus.append("circle")
                            .attr("r", 4.5);
                      
                        focus.append("text")
                            .attr("x", 9)
                            .attr("dy", ".35em");
      
                        svg3.append("rect")
                            .attr("class", "overlay")
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function() { focus.style("display", null); })
                            .on("mouseout", function() { focus.style("display", "none"); })
                            .on("mousemove", mousemove);
                      
                        function mousemove() {
                          var x0 = x.invert(d3.mouse(this)[0]),
                              i = bisectDate(data1, x0, 1),
                              d0 = data1[i - 1],
                              d1 = data1[i],
                              d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                          focus.attr("transform", "translate(" + x(d.date) + "," + y(d.dust) + ")");
                          focus.select("text").text(unit(d.dust));
                        }
      
                  }
            });  
      } else if (pm === "pm25") {
            if (!action) {
                  action = 'one_day';
            }
            if (!date) {
                  var today = new Date();
                  var day = today.getDate();
                  var month = today.getMonth()+1;
                  var year = today.getFullYear();
                  if(day<10) {
                      day='0'+day;
                  } 
                  if(month<10) {
                      month='0'+month;
                  } 
                  date = year+'-'+month+'-'+day;
            }

            var sensor;
            if (g) {
                  sensor = g.id;
            } else {
                  sensor = sensor_id; 
            }
            
            $.ajax({
                  type: 'post',
                  url: 'sensor_data_graph.php',
                  data: {'sensor': sensor, 'date': date,'date2': date2, 'action': action},
                  success: function(data1) {
                        $("div#graph-info").html('<p> <strong> Date: </strong>' + date + '</p> <p><strong>Change the graph</strong> to show data from certain day, month or chosen period of time. </p>');
                        data1 = JSON.parse(data1);
            
                        if ($("div#graph svg")) {
                              d3.selectAll('div#graph svg').remove();
                        }
            
                        var margin = {top: 20, right: 50, bottom: 30, left: 50}, width = 460, height = 495;
                        var bisectDate = d3.bisector(function(d) { return d.date; }).left,
                            unit = function(d) { return d + ' µg/m3'; };
      
                        var x = d3.time.scale()
                            .range([0, width]);
                        
                        var y = d3.scale.linear()
                            .range([height, 0]);
                        
                        var xAxis = d3.svg.axis()
                            .scale(x)
                            .orient("bottom");
      
                        var yAxis = d3.svg.axis()
                            .scale(y)
                            .orient("left");
                        
                        var line = d3.svg.line()
                            .x(function(d) { return x(d.date); })
                            .y(function(d) { return y(d.dust); });
      
                        var svg3 = d3.select("div#graph").append("svg")
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
                        data1.forEach(function(d) {
                            var timestamp = d.measurment_date + 'T' + d.measurment_hour;
                            d.date = d3.time.format('%Y-%m-%dT%X').parse(timestamp);
                            d.dust = parseFloat(d.pm25);
                        });
      
                        data1.sort(function(a, b) {
                          return a.date - b.date;
                        });
         
                        x.domain([data1[0].date, data1[data1.length - 1].date]);
                        y.domain(d3.extent(data1, function(d) { return d.dust; }));
      
                        svg3.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);
            
                        svg3.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                          .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("PM10 [µg/m3]");
      
                        svg3.append("path")
                            .datum(data1)
                            .attr("class", "line")
                            .attr("d", line);
            
                        var focus = svg3.append("g")
                            .attr("class", "focus")
                            .style("display", "none");
      
                        focus.append("circle")
                            .attr("r", 4.5);
      
                        focus.append("text")
                            .attr("x", 9)
                            .attr("dy", ".35em");
      
                        svg3.append("rect")
                            .attr("class", "overlay")
                            .attr("width", width)
                            .attr("height", height)
                            .on("mouseover", function() { focus.style("display", null); })
                            .on("mouseout", function() { focus.style("display", "none"); })
                            .on("mousemove", mousemove);
      
                        function mousemove() {
                          var x0 = x.invert(d3.mouse(this)[0]),
                              i = bisectDate(data1, x0, 1),
                              d0 = data1[i - 1],
                              d1 = data1[i],
                              d = x0 - d0.date > d1.date - x0 ? d1 : d0;
                          focus.attr("transform", "translate(" + x(d.date) + "," + y(d.dust) + ")");
                          focus.select("text").text(unit(d.dust));
                        }
      
                  }
            });  
      }
      } 

