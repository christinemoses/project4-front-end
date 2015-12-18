'use strict';

var taskTracker_api = {
  url: 'https://warm-reef-5709.herokuapp.com/',
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

  createEvent: function (event, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/events',
      data: JSON.stringify(event)
    }, callback);
  },

  listEvents: function (callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/events'
    }, callback);
  },

  updateEvent: function (eventId, event, callback) {
      this.ajax({
          method: 'PATCH',
          url: this.url + '/events/' + eventId,
          data: JSON.stringify(event),
      }, callback);
  },

  deleteEvent: function (eventId, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/events/' + eventId,
    }, callback);
  },

  createTask: function (eventId, task, callback) {
    this.ajax({
      method: 'POST',
      url: this.url + '/events/' + eventId + '/tasks',
      data: JSON.stringify(task)
    }, callback);
  },

  listTasks: function (eventId, callback) {
    this.ajax({
      method: 'GET',
      url: this.url + '/events/' + eventId + '/tasks'
    }, callback);
  },

  updateTask: function (eventId, taskId, task, callback) {
      this.ajax({
          method: 'PATCH',
          url: this.url + '/events/' + eventId + '/tasks/' + taskId,
          data: JSON.stringify(task),
      }, callback);
  },

  deleteTask: function (eventId, taskId, callback) {
    this.ajax({
      method: 'DELETE',
      url: this.url + '/events/' + eventId + '/tasks/' + taskId
    }, callback);
  }
};
