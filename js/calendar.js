   $(".select-sensor").select2();
   $(".select-month").select2();
   $(".select-pm").select2();
   var initMonth = "2016-11";
   var initSensor =  "1";
   var initPm = "pm10";
   createCalendar(initMonth, initSensor, initPm);
   
   $("button#change-calendar").on("click", function(){
        var sensor = $( "select.select-sensor" ).val();
        var month = $( "select.select-month" ).val();
        var pm = $( "select.select-pm" ).val();
        var svg = d3.select("div.days-hours-heatmap").select("svg");
         if(svg) {
               d3.select("body div#heatmap").select("*").remove();
               $("body div#heatmap").append('<div class="days-hours-heatmap"><div class="calibration" role="calibration"><div class="group" role="example"><svg width="820" height="17"></svg><div role="description" class="description"><label>Small pollution</label><label>Big pollution</label></div></div></div><svg role="heatmap" class="heatmap"></svg></div>');
          }
        createCalendar(month, sensor, pm);
   });
   
   function createCalendar(month, sensor, pm) {
     // based on http://bl.ocks.org/oyyd/859fafc8122977a3afd6

     var itemSize = 20,
       cellSize = itemSize-1,
       width = 700,
       height = 500,
       margin = {top:20,right:20,bottom:20,left:25};

     var dateExtent = null,
       data = null,
       dayOffset = 0,
       colorCalibration = ['#ffffcc','#ffeda0','#fed976','#feb24c','#fd8d3c','#fc4e2a','#e31a1c','#bd0026','#800026'],
       dailyValueExtent = {};

     var axisWidth = 0 ,
       axisHeight = itemSize*24,
       xAxisScale = d3.time.scale(),
       xAxis = d3.svg.axis()
         .orient('top')
         .ticks(d3.time.days,3)
         .tickFormat(d3.time.format('%m.%d')),
       yAxisScale = d3.scale.linear()
         .range([0,axisHeight])
         .domain([0,24]),
       yAxis = d3.svg.axis()
         .orient('left')
         .ticks(5)
         .tickFormat(d3.format('02d'))
         .scale(yAxisScale);

     initCalibration();

     var svg = d3.select('[role="heatmap"]');
     var heatmap = svg
       .attr('width',width)
       .attr('height',height)
     .append('g')
       .attr('width',width-margin.left-margin.right)
       .attr('height',height-margin.top-margin.bottom)
       .attr('transform','translate('+margin.left+','+margin.top+')');
     var rect = null;

    $.ajax({   
          type: 'post',
          url: 'one_sensor_data.php',
          data: {'month': month, 'sensor': sensor},
          success: function(data_1) {
               var data = JSON.parse(data_1);
               data.forEach(function(value){
                      var timestamp = value['measurment_date'] + 'T' + value['measurment_hour'];
                      value['date'] = d3.time.format('%Y-%m-%dT%X').parse(timestamp);
                      var day = value['day'] = d3.time.format('%d.%m')(value['date']);
                      var dayData = dailyValueExtent[day] = (dailyValueExtent[day] || [1000,-1]);
                      var pmValue = parseFloat(value['pm10']);
                      dayData[0] = d3.min([dayData[0],pmValue]);
                      dayData[1] = d3.max([dayData[1],pmValue]);
               });
      
               dateExtent = d3.extent(data,function(d){
                 return d.date;
               });
      
               axisWidth = itemSize*(d3.time.format('%j')(dateExtent[1])-d3.time.format('%j')(dateExtent[0])+1);
      
               xAxis.scale(xAxisScale.range([0,axisWidth]).domain([dateExtent[0],dateExtent[1]]));  
               svg.append('g')
                 .attr('transform','translate('+margin.left+','+margin.top+')')
                 .attr('class','x axis')
                 .call(xAxis)
               .append('text')
                 .text('date')
                 .attr('transform','translate('+( axisWidth+20) +',-\8)');
      
               svg.append('g')
                 .attr('transform','translate('+margin.left+','+margin.top+')')
                 .attr('class','y axis')
                 .call(yAxis)
               .append('text')
                 .text('time')
                 .attr('transform','translate(-10,'+axisHeight+') rotate(-90)');
      
               dayOffset = d3.time.format('%j')(dateExtent[0]);
               rect = heatmap.selectAll('rect')
                 .data(data)
               .enter().append('rect')
                 .attr('width',cellSize)
                 .attr('height',cellSize)
                 .attr('x',function(d){
                   return itemSize*(d3.time.format('%j')(d.date)-dayOffset);
                 })
                 .attr('y',function(d){            
                   return d3.time.format('%H')(d.date)*itemSize;
                 })
                 .attr('fill','#c9c9c9');
      
               rect
                 .append('title')
                 .text(function(d){
                     if (pm === "25"){
                         console.log("25");
                            return d3.time.format('%d.%m')(d.date)+' '+d.pm25; 
                     } else{
                         console.log("10");
                             return d3.time.format('%d.%m')(d.date)+' '+d.pm10; 
                     }
                 });
               renderColor();
          }
     });

     function initCalibration(){
       d3.select('[role="calibration"] [role="example"]').select('svg')
         .selectAll('rect').data(colorCalibration).enter()
         .append('rect')
         .attr('width',77)
         .attr('height',20)
         .attr('x',function(d,i){
           return i*77;
         })
         .attr('fill',function(d){
           return d;
         });
         d3.selectAll('[role="calibration"] [name="displayType"]').on('click',function(){
               renderColor();
         });
     }

     function renderColor(){
          rect
            .filter(function(d){
              if (pm === "25"){
                         return (d.pm25>=0);
                      }
                      else{
                         return (d.pm10>=0);
                      }
            }) 
               .transition()
               .attrTween('fill',function(d,i,a){     
                 var colorIndex = d3.scale.quantize()
                   .range([0,1,2,3,4,5,6,7,8])
                   .domain(dailyValueExtent[d.day]);
                           if (pm === "25"){
                                return d3.interpolate(a,colorCalibration[colorIndex(d.pm25)]);
                           } else{
                                 return d3.interpolate(a,colorCalibration[colorIndex(d.pm10)]);
                           }
               }); 
  }

  d3.select(self.frameElement).style("height", "600px");  
}
