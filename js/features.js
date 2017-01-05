// SCRIPT HANDLING MODAL EXTENSION

$("#select-sensor-id").select2();
// make the modal bigger after clicking on "compare graphs"
$("button#compare-graphs").on("click", function(){
    $("body .modal-dialog").addClass('extended');
    $("body .modal-footer").addClass('extended-footer');
    $("div#graph2").show();
    $("div#choose-sensor").show();
    if ($("div#graph2 svg").length > 0){
        $("div#graph").addClass("two-graphs");
    }
});
// generate second graph using createGraph function
$("#select-sensor-id").on("select2:select", function() {
    $("div#graph").addClass("two-graphs");
    var type = $("#select-dust").val();
    var period = $("#select-time").val();
    var sensor = $("#select-sensor-id").val();
    var date, date2, action, g;
    var field = "graph2";
    if (period === 'day'){
        action = "one_day";
        date = $("input#datepicker2").val();
        if (!date){
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
    } else if(period === 'custom') {
        action = "custom_days";
        date = $("input#from").val();
        date2 = $("input#to").val();
    } else if (period === 'month') {
        action = "one_month";
        date = $("#select-month").val();
    }
    createGraph(g, type, sensor, date, date2, action, field);
});
// getting modal back to smaller size after closing it
$('#myModal').on('hidden.bs.modal', function () {
    $("body .modal-dialog").removeClass('extended'); 
    $("div#graph2").hide();
    $("div#graph").removeClass("two-graphs");
    $("div#choose-sensor").hide();
});

// --------------------
// DOWNLOADING CSV FILE
$("button#download-data").on("click", function(){
    window.location = 'data.csv';
});
// -----------------------------
// SCRIPT HANDLING MAP ANIMATION
$('[data-toggle="tooltip"]').tooltip();
$("button#animate_button").on("click", function(){
    $("#slider").slider('option', 'value', 0); 
        function animate(x){
            var handle = $( "#custom-handle" );
            var val = $('#slider').slider("option", "value");
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
                    $("#slider").slider("value", x*60);
                    handle.text(myhour + ':00');
                    var next = x+1;
                    if(next!= 25) {
                     animate(next);
                    }
                 }
            });
        }
  animate(1);
});
// ------------------------------
// HANDLING PICKING DATE IN MODAL

$("span#custom-picker").hide();
$("span#monthselect").hide();
$("#select-dust").select2({
    placeholder: "Select dust type",
});
$("#select-time").select2();
$("#select-month").select2();
  
$("#select-time").on("change", function () {
    var timechoice = $("#select-time").val();
    if (timechoice === 'custom'){
        $("span#custom-picker").show();
        $("span#monthselect").hide();
        $("span.date-picker2").hide();
    } else if (timechoice === 'month'){
        $("span#custom-picker").hide();
        $("span#monthselect").show();
        $("span.date-picker2").hide();
    } else if(timechoice === 'day') {
        $("span.date-picker2").show();
        $("span#custom-picker").hide();
        $("span#monthselect").hide();
    }
});
  
// datepicker for period of time
// based on https://jqueryui.com/datepicker/#date-range
$(function(){
    var dateFormat = 'yy-mm-dd'; 
    from = $("#from")
      .datepicker({
          dateFormat: 'yy-mm-dd',
          defaultDate: "+1w",
          changeMonth: true,
          numberOfMonths: 2
      })
      .on("change", function(){
          to.datepicker( "option", "minDate", getDate(this));
      }),
    to = $("#to").datepicker({
        dateFormat: 'yy-mm-dd',
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 2
    })
    .on("change", function(){
        from.datepicker("option", "maxDate", getDate(this));
    });

    function getDate(element){
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch(error){
            date = null;
        }
        return date;
    }
});
  
// datepicker for one day
// based on https://jqueryui.com/datepicker/
$("input#datepicker2").datepicker({
    onSelect: function(date){
        var val = $('#slider').slider("option", "value");
        var myhour = val/60;
        myhour = myhour.toString();
        if (myhour.length < 2){
            myhour = "0" + myhour;
        }
        $.ajax({
            type: 'post',
            url: 'sensor_data_date.php',
            data: {'date': date, 'hour': myhour},
            success: function(data){
                if (data !=="null"){
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

// ----------------------------------------
// BUTTONS TO SWITCH BETWEEN PM10 AND PM2.5   

// switching to PM10
$("button#pm10-button").on("click", function(){
     $("button#pm10-button").addClass("pm-chosen");
     $("button#pm25-button").removeClass("pm-chosen");
     var pm = 10;
     var date = $( "input#datepicker" ).val();
     var myurl, date, myhour;
     if (date) {
         var val = $('#slider').slider("option", "value");
         var myhour = val/60;
         myhour = myhour.toString();
         if (myhour.length < 2){
             myhour = "0" + myhour;
         }
         myurl = 'sensor_data_date.php';
     } else if (!date) {
        myurl = 'sensor_data.php';
     }
     $.ajax({
         type: 'post',
         url: myurl,
         data: {'date': date, 'hour': myhour},
         success: function(data) {
             if (data !=="null") {
                 createVisualisation(data, pm);
                 $("div#measurment-time").html(myhour + ':00');
                 $("div#measurment-date").html(date);
                 $("div#measurment-sensors").html("All");
             }
         }
     });
 });
// switching to PM25
$("button#pm25-button").on("click", function(){
    $("button#pm25-button").addClass("pm-chosen");
    $("button#pm10-button").removeClass("pm-chosen");
    var pm = 25;
    var date = $( "input#datepicker" ).val();
    var myurl, date, myhour;
    if (date) {
        var val = $('#slider').slider("option", "value");
        var myhour = val/60;
        myhour = myhour.toString();
        if (myhour.length < 2){
            myhour = "0" + myhour;
        }
        myurl = 'sensor_data_date.php';
    } 
    else if (!date) {
       myurl = 'sensor_data.php';
    }
    $.ajax({
        type: 'post',
        url: myurl,
        data: {'date': date, 'hour': myhour},
        success: function(data) {
            if (data !=="null") {
                createVisualisation(data, pm);
                $("div#measurment-time").html(myhour + ':00');
                $("div#measurment-date").html(date);
                $("div#measurment-sensors").html("All");
            }
        }
    });
});

// -----------------------
// CHANGING GRAPH IN MODAL (DIFFERENT DAY, MONTH OR FEW DAYS)

$("button#change-graph").on("click", function(){
    var type = $("#select-dust").val();
    var period =$("#select-time").val();
    var sensor = $("p#sensor_name").text();
    var date, date2, action, g;
    if (period === 'day'){
        action = "one_day";
        date = $("input#datepicker2").val();
    } else if(period === 'custom') {
        action = "custom_days";
        date = $("input#from").val();
        date2 = $("input#to").val();
    } else if (period === 'month') {
        action = "one_month";
        date = $("#select-month").val();
    }
    createGraph(g, type, sensor, date, date2, action);
    if ($("body .modal-dialog").hasClass("extended")){
        var field = "graph2";
        var sensor2 = $("#select-sensor-id").val();
        createGraph(g, type, sensor2, date, date2, action, field);
    }
});