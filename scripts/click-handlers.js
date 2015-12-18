'use strict'

$(function() {

  var form2object = function(form) {
    var data = {};
    $(form).find(":input").each(function(index, element) {
      var type = $(this).attr('type');
      if ($(this).attr('name') && type !== 'submit' && type !== 'hidden') {
        data[$(this).attr('name')] = $(this).val();
      }
    });
    return data;
  };

  var wrap = function(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  // Register
  $('#reg-form').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    taskTracker_api.register(credentials, function(err, data) {
      if (err) {
        alert("That user name already exists");
        return;
      }
      console.log('New user created: ', credentials);
      taskTracker_api.login(credentials, loginCallback);
      $('#reg-popup').modal('hide');
      $('.modal-backdrop').remove();
      $('#event-view').show();
      $('#nav-log-out').show();
    });
    e.preventDefault(); // prevents page from reloading

  });

  // Log in
  var loginCallback = function(error, loginData){
    if (error) {
      alert("Invalid credentials");
      return;
    }
    console.log('loginData is ', loginData);

    taskTracker_api.token = loginData.user.token;
    taskTracker_api.userId = loginData.user.id;
    taskTracker_api.listEvents(eventListCallback);
  };

  $('#login-form').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    e.preventDefault();
    taskTracker_api.login(credentials, loginCallback);
    $('#login-popup').modal('hide');
    $('.modal-backdrop').remove();
    $('#landing-page-elements').hide();
    $('#event-view').show();
    $('#event-add-button').show();
    $('#nav-log-out').show();
  });

    // Logout
  $('#nav-log-out').on('click', function(e) {
    taskTracker_api.logout(function(err, data) {
        if (err) {
          alert("An error occurred during log out");
          return;
        }
      console.log("logged out");
    $('#landing-page-elements').show();
    $("#task-view").hide();
    $('#event-view').hide();
    $('#calendar-view').hide();
    $('#show-event-list').hide();
    $tr.remove();
    });
    e.preventDefault();
  });

  // Create New Event
   $('#new-event-form').on('submit', function(e) {
      e.preventDefault();
      var event = wrap('event', form2object(this));
      $('input:text').val('');
      $('#new-event-start').val('');
      $('#new-event-popup').modal('hide');
      $('.modal-backdrop').remove();
      taskTracker_api.createEvent(event, function(err, data){
        if (err) {
          alert("Error creating event");
          return;
        }
        console.log(data);
        $('#event-list tr:last').after(
          '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '</td><td><button data-toggle="modal" data-target="#edit-event-popup" class="edit btn btn-default">Edit</button></td><td><button class="delete btn btn-xs btn-danger">X</button></td><td><button class="event-tasks btn btn-default">Event Tasks</button></td></tr>');
      });
  });

  // Event Table - Edit and Delete Button
  $('#event-list').on('click', function(e){
    e.preventDefault();
    var $target = $(e.target);
    var $tr = $target.closest("tr");
    var id = $tr.data('id');
    var eventName = $tr.find('.event-name').text();
    if($target.hasClass("delete")){
        console.log("deleting ", id);
        $tr.remove();
        taskTracker_api.deleteEvent(id, function(err, data){});
    }else if($target.hasClass("edit")){
        console.log("editing ", id);
        $('#eventId').val(id);
        $('#edit-event-name').val(eventName);
        $('#edit-event-location').val($tr.find('.event-location').text());
        $('#edit-event-start').val($tr.find('.event-date').text());
        $tr.remove();
    }else if($target.hasClass("event-tasks")) {
        $('.task-detail').remove();
        $("#task-view").show();
        $('#event-view').hide();
        $('#show-event-list').css('display', 'inline');
        $('#add-task-eventId').val(id);
        $('.task-list-label').text(eventName + " Tasks");
        $('.task-calendar-label').text(eventName + " Task Calendar")
        $('#calendar').fullCalendar('removeEvents', [taskId]);
        // calendar functionality & features
        $('#calendar').fullCalendar({
          header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month, agendaWeek, agendaDay'
          },
          defaultView: 'month',
          editable: true
        });
        taskTracker_api.listTasks(id, taskListCallback);
        $('#calendar-view').show();
    }
  });

  // List Events
  var eventListCallback = function(err, data) {
    if(err){
      alert("There was an error listing events");
      return;
    }
    var eventArray = data.events;
    eventArray.forEach(function(event, _index, _arr){
      $('#event-list tr:last').after(
          '<tr data-id=' + event.id + '><td class="event-name">' + event.name +  '</td><td class="event-location">' + event.location + '</td><td class="event-date">' + event.date + '</td><td><button data-toggle="modal" data-target="#edit-event-popup" class="edit btn btn-default">Edit</button></td><td><button class="delete btn btn-xs btn-danger">X</button></td><td><button class="event-tasks btn btn-default">Event Tasks</button></td></tr>');

    });
  };

  $('#show-event-list').on('click', function(e){
    e.preventDefault();
    // taskTracker_api.listEvents(eventListCallback);
    $('#event-view').show();
    $('#calendar-view').hide();
    $("#task-view").hide();
    $('#show-event-list').hide();
    $('#calendar').fullCalendar('removeEvents', [taskId]);
  });


  var taskListCallback = function(err, data) {
    if(err){
      alert("There was an error listing tasks");
      return;
    }
    var taskArray = data.tasks;
    taskArray.forEach(function(task, _index, _arr) {
      addTask(task);
    });
  }

  var addTask = function(task) {
    // pushing task to table
    $('#task-list tr:last').after(
      '<tr class="task-detail" data-id=' + task.id + '><td class="task-name">' + task.name + '</td><td class="task-date">' + task.date + '</td><td><button data-toggle="modal" data-target="#edit-task-popup" class="edit btn btn-default">Edit</button></td><td><button class="delete btn btn-xs btn-danger">X</button></td></tr>');

    // adding task to calendar
    $('#calendar').fullCalendar('addEventSource', [
        {
            id : task.id,
            title : task.name,
            start : task.date
        },
      ]);
  }



  // Edit Event
  $('#edit-event-form').on('submit', function(e) {
    e.preventDefault();
    var event = wrap('event', form2object(this));
    $('input:text').val('');
    $('#edit-event-start').val('');
    $('#edit-event-popup').modal('hide');
    $('.modal-backdrop').remove();
    var id = $('#eventId').val();
    taskTracker_api.updateEvent(id, event, function(err, data){
      if (err) {
        alert("There was an error updating the event")
      }
      console.log('event updated');
      $('#event-list tr:last').after(
        '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '</td><td><button data-toggle="modal" data-target="#edit-event-popup" class="edit btn btn-default">Edit</button></td><td><button class="delete btn btn-xs btn-danger">X</button></td><td><button class="tasks btn btn-default">Event Tasks</button></td></tr>');
    });
  });

  // Create New Task
  $('#new-task-form').on('submit', function(e) {
    e.preventDefault();
    var task = wrap('task', form2object(this));
    var eventId = $('#add-task-eventId').val();
    $('#add-task-popup').modal('hide');
    $('.modal-backdrop').remove();
    $('input:text').val('');
    $('#task-date').val('');
    taskTracker_api.createTask(eventId, task, function(err, data){
      if (err) {
        alert("Error creating task");
        return;
      }
      console.log(data);
      addTask(data.task);
    });
  });

  // Task Table - Edit and Delete Buttons
  $('#task-list').on('click', function(e){
    e.preventDefault();
    var $target = $(e.target);
    var $tr = $target.closest("tr");
    var eventId = $('#add-task-eventId').val();
    var taskId = $tr.data('id');
    if($target.hasClass("delete")){
        console.log("deleting ", taskId);
        $tr.remove();
        $('#calendar').fullCalendar('removeEvents', [taskId]);
        taskTracker_api.deleteTask(eventId, taskId, function(err, data){});
    }else if($target.hasClass("edit")){
        console.log("editing ", taskId);
        $('#taskId').val(taskId);
        $('#edit-task-name').val($tr.find('.task-name').text());
        $('#edit-task-date').val($tr.find('.task-date').text());
        $tr.remove();
        $('#calendar').fullCalendar('removeEvents', [taskId]);
    }
  });

  // Edit Task
  $('#edit-task-form').on('submit', function(e) {
    e.preventDefault();
    var task = wrap('task', form2object(this));
    var eventId = $('#add-task-eventId').val();
    var taskId = $('#taskId').val();
    $('input:text').val('');
    $('#edit-task-date').val('');
    $('#edit-task-popup').modal('hide');
    $('.modal-backdrop').remove();
    $('#calendar').fullCalendar('removeEvents', [taskId]);

    taskTracker_api.updateTask(eventId, taskId, task, function(err, data){
      if (err) {
        alert("There was an error updating the task")
      }
      console.log('task updated');
      addTask(data.task);
    });
  });




});
