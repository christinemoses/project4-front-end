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
  };

  $('#login-form').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    e.preventDefault();
    taskTracker_api.login(credentials, loginCallback);
  });

    // Logout
  $('#nav-log-out').on('click', function(e) {
    taskTracker_api.logout(function(err, data) {
        if (err) {
          alert("An error occurred during log out");
          return;
        }
      console.log("logged out");
    });
    e.preventDefault();
  });

  // Create New Event
   $('#new-event-form').on('submit', function(e) {
      e.preventDefault();
      var event = wrap('event', form2object(this));

      taskTracker_api.createEvent(event, function(err, data){
        if (err) {
          alert("Error creating event");
          return;
        }

        console.log(data);

        $('#event-list tr:last').after(
          '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td><td><button class="event-tasks btn btn-info">Event Tasks</button></td></tr>');
      });
  });

  // Event Table - Edit and Delete Button
  $('#event-list').on('click', function(e){
    e.preventDefault();
    var $target = $(event.target);
    var $tr = $target.closest("tr");
    var id = $tr.data('id');
    if($target.hasClass("delete")){
        console.log("deleting ", id);
        $tr.remove();
        taskTracker_api.deleteEvent(id, function(err, data){});
    }else if($target.hasClass("edit")){
        console.log("editing ", id);
        $('#eventId').val(id);
        $('#edit-event-name').val($tr.find('.event-name').text());
        $('#edit-event-location').val($tr.find('.event-location').text());
        $('#edit-event-start').val($tr.find('.event-date').text());
        $tr.remove();
    }else if($target.hasClass("event-tasks")) {
        $("#task-view").show();
        $('#add-task-eventId').val(id);
        taskTracker_api.listTasks(id, function(err, data){
          if (err) {
            alert("There was an error retrieving the task list")
          }
        });
    }
  });

  // List Events
  var eventListCallback = function(err, data) {
    var eventArray = data.events;
    eventArray.forEach(function(event, _index, _arr){
      $('#event-list tr:last').after(
          '<tr data-id=' + event.id + '><td class="event-name">' + event.name +  '</td><td class="event-location">' + event.location + '</td><td class="event-date">' + event.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td><td><button class="event-tasks btn btn-info">Event Tasks</button></td></tr>');

    });
  };

  $('#show-event-list').on('click', function(e){
    e.preventDefault();
    taskTracker_api.listEvents(eventListCallback);
  });


  // Update Event
  $('#edit-event-form').on('submit', function(e) {
    e.preventDefault();
    var event = wrap('event', form2object(this));
    var id = $('#eventId').val();
    taskTracker_api.updateEvent(id, event, function(err, data){
      if (err) {
        alert("There was an error updating the event")
      }
      console.log('event updated');
      $('#event-list tr:last').after(
        '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td><td><button class="tasks btn btn-info">Event Tasks</button></td></tr>');
    });
  });

  // Create New Task
  $('#new-task-form').on('submit', function(e) {
    e.preventDefault();
    var task = wrap('task', form2object(this));
    var eventId = $('#add-task-eventId').val();
    taskTracker_api.createTask(eventId, task, function(err, data){
      if (err) {
        alert("Error creating task");
        return;
      }
      console.log(data);
      $('#task-list tr:last').after(
        '<tr data-id=' + data.task.id + '><td class="task-name">' + data.task.name + '</td><td class="task-date">' + data.task.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
    });
  });

  // Edit a Task
  $('#edit-task-form').on('submit', function(e) {
    e.preventDefault();
    var event = wrap('event', form2object(this));
    var id = $('#eventId').val();
    var taskId = $('#  ')
    taskTracker_api.updateEvent(id, event, function(err, data){
      if (err) {
        alert("There was an error updating the event")
      }
      console.log('event updated');
      $('#event-list tr:last').after(
        '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td><td><button class="tasks btn btn-info">Event Tasks</button></td></tr>');
    });
  });


  // Delete a Task


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


});
