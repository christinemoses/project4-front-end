'use strict';

var taskTracker_api = {
  url: 'http://localhost:3000',
  token: null,
  userId: null,

  ajax: function(config, cb) {
    if(this.token !== null){
      var headers = {
        headers: {
          Authorization: 'Token token=' + this.token
        }
      };
      config = $.extend({}, config, headers);
    }

    var setData = {
      contentType: 'application/json; charset=utf-8',
      dataType: 'json'
    };
    config = $.extend({}, config, setData);

    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function (credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/register',
      data: JSON.stringify(credentials)
    }, callback);
  },

  login: function (credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/login',
      data: JSON.stringify(credentials)
    }, callback);
  },

  logout: function (callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/logout/' + this.userId
    }, callback);
  },

  //Authenticated api actions

  createEvent: function (callback, name, location, date) {
    this.ajax({
      method: 'POST',
      url: this.url + '/events',
      data: JSON.stringify({"event": {"name":name, "location":location, "date":date}})
    }, callback);
  },

  listEvents: function (callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/events'
    }, callback);
  },

//updateEvent

  deleteEvent: function (callback, eventId) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/events/' + eventId,
    }, callback);
  },

  createTask: function (callback, eventId, name, date) {
    this.ajax({
      method: 'POST',
      url: this.url + '/events/' + eventId + '/tasks',
      data: JSON.stringify({"task": {"name":name, "date":date}})
    }, callback);
  },

  listTasks: function (callback, eventId) {
    this.ajax({
      method: 'GET',
      url: this.url + '/events/' + eventId + '/tasks'
    }, callback);
  },

//updateTask

  deleteTask: function (callback, eventId, taskId) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/events/' + eventId + '/tasks/' + taskId,
    }, callback);
  }
};
