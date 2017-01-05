    var date = new Date();
    var hour = date.getHours();
    var hourInSeconds = hour * 60;
    $( function() {
        var handle = $( "#custom-handle" );
        // slider to change data              
        $( "#slider" ).slider({
            animate: true,
            animate: 1,
            max: 1440,
            step: 60,
            create: function( event, ui) {
              handle.val(hourInSeconds);
              handle.text(hour + ':00');
            },
            slide: function( event, ui ) {
               var mydate = $( "input#datepicker" ).val();
               if((ui.value > hourInSeconds) && (ui.value <= 1440) && (!mydate)){
                    return false;
                }
              var time = Math.floor((ui.value)/60) + ":00";
              handle.text( time );
            },
            change: function(event, ui) {
                  var val = $('#slider').slider("option", "value");
                  console.log(val);
                  var mydate = $( "input#datepicker" ).val();
                  if (!mydate){
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
                        mydate = year+'-'+month+'-'+day;
                  }
                  var myhour = val/60;
                  myhour = myhour.toString();
                  if (myhour.length < 2){
                    myhour = "0" + myhour;
                  }
                  console.log(typeof(myhour));
                  console.log(typeof(hour));
                  if (myhour !== hour.toString()) {
                    
                   $.ajax({
                      type: 'post',
                      url: 'sensor_data_hour.php',
                      data: {'hour': myhour, 'date': mydate },
                      success: function(data) {
                        if (data !=="null") {
                        createVisualisation(data);
                        $("div#measurment-time").html(myhour + ':00');
                        $("div#measurment-date").html(mydate);
                        $("div#measurment-sensors").html("All");
                        }
                      }
                   });
                  }
            }
        });
        $( "#slider" ).slider('option', 'value', hourInSeconds);     
    });
