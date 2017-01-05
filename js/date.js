$( "input#datepicker" ).datepicker({
      onSelect: function(date) {
          var val = $('#slider').slider("option", "value");
          var myhour = val/60;
          myhour = myhour.toString();
          if (myhour.length < 2){
              myhour = "0" + myhour;
          }
          $("div.loader").show();
          $("div.container").addClass("loader-show");
                    $.ajax({
                      type: 'post',
                      url: 'sensor_data_date.php',
                      data: {'date': date, 'hour': myhour},
                      success: function(data) {
                        $("div.loader").hide();
                        $("div.container").removeClass("loader-show");
                        if (data !=="null") {
                          console.log(data);
                        createVisualisation(data);
                        $("div#measurment-time").html(myhour + ':00');
                        $("div#measurment-date").html(date);
                        $("div#measurment-sensors").html("All");
                        
                        }
                      }
                   });
      },
      showOtherMonths: true,
      selectOtherMonths: true,
      dateFormat: 'yy-mm-dd'  
});
