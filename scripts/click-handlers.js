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
      $('input:text').val('');
      $('#new-event-start').val('');
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
    var $target = $(e.target);
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
        taskTracker_api.listTasks(id, taskListCallback);
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
          '<tr data-id=' + event.id + '><td class="event-name">' + event.name +  '</td><td class="event-location">' + event.location + '</td><td class="event-date">' + event.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td><td><button class="event-tasks btn btn-info">Event Tasks</button></td></tr>');

    });
  };

  // $('#show-event-list').one('click', function(e){
  //   e.preventDefault();
  //   taskTracker_api.listEvents(eventListCallback);
  // });


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
      '<tr data-id=' + task.id + '><td class="task-name">' + task.name + '</td><td class="task-date">' + task.date + '</td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
    // adding task to calendar

  }

  // Edit Event
  $('#edit-event-form').on('submit', function(e) {
    e.preventDefault();
    var event = wrap('event', form2object(this));
    $('input:text').val('');
    $('#edit-event-start').val('');
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
        taskTracker_api.deleteTask(eventId, taskId, function(err, data){});
    }else if($target.hasClass("edit")){
        console.log("editing ", taskId);
        $('#taskId').val(taskId);
        $('#edit-task-name').val($tr.find('.task-name').text());
        $('#edit-task-date').val($tr.find('.task-date').text());
        $tr.remove();
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
    taskTracker_api.updateTask(eventId, taskId, task, function(err, data){
      if (err) {
        alert("There was an error updating the task")
      }
      console.log('task updated');
      addTask(data.task);
    });
  });


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
