'use strict'

$(function() {

  var handleError = function handleError(error, data, optional_alert) {
      if (error) {
          console.error(error);
          if (optional_alert) {
              optional_alert();
          }
          throw error;
      } else {
          console.log(data);
      }
  };

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

  var wrap = function wrap(root, formData) {
    var wrapper = {};
    wrapper[root] = formData;
    return wrapper;
  };

  // Register
  $('#reg-form').on('submit', function(e) {
    var credentials = wrap('credentials', form2object(this));
    taskTracker_api.register(credentials, function(err, data) {
      handleError(err, data, function() {
        alert("Invalid Credentials");
      });
    });
    e.preventDefault(); // prevents page from reloading
  });

  // Log in
  var loginCallback = function(error, loginData){
    console.log('loginData is ', loginData);
    if (error) {
      callback(error);
      return;
    }
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
          handleError(err, data);
          console.log("logged out");
      });
      e.preventDefault();
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
