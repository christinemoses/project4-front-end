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

  // Create Event
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
          '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '<td><td><button class="edit btn btn-primary" data-toggle="modal" data-target="#update-activity-popup">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
      });
  });

  // Event Table - Edit and Delete Button
  $('#event-list').on('click', function(event){
    event.preventDefault();
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
    }

  });

  // UpdateListItem
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
        '<tr data-id=' + data.event.id + '><td class="event-name">' + data.event.name +  '</td><td class="event-location">' + data.event.location + '</td><td class="event-date">' + data.event.date + '<td><td><button class="edit btn btn-primary" data-toggle="modal" data-target="#update-activity-popup">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
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

    // $('#show-event-list').on('click', function(e){
    //     e.preventDefault();
    //     taskTracker_api.listEvents(function(err, data){
    //         handleError(err,data);
    //         data.forEach(function(item){
    //           $('#event-list tr:last').after(
    //             '<tr data-id=' + event._id + '><td>' + event.name +  '</td><td>' + event.location + '</td><td>' + event.date + '<td><td><button class="edit btn btn-primary">Edit</button></td><td><button class="delete btn btn-danger">Delete</button></td></tr>');
    //         });
    //     });
    // });



});
