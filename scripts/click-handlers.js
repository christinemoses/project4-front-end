'use strict'

$(document).ready(function() {


    // calendar functionality & features
    $('#calendar').fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
      },
      defaultView: 'month',
      editable: true
    })
});
