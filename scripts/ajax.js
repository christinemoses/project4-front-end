'use strict';

var taskTracker_api = {
  url: 'http://localhost:3000',
  token: null,

  ajax: function(config, cb) {
    if(this.token !== null){
      var headers = {
        headers: {
          Authorization: 'Token token=' + this.token
        }
      };

      config = $.extend({}, config, headers);
    }
    $.ajax(config).done(function(data, textStatus, jqxhr) {
      cb(null, data);
    }).fail(function(jqxhr, status, error) {
      cb({jqxher: jqxhr, status: status, error: error});
    });
  },

  register: function register(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/register',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  login: function login(credentials, callback) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/login',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  logout: function logout(callback) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/logout',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(credentials),
      dataType: 'json'
    }, callback);
  },

  //Authenticated api actions

  createEvent: function (callback, name) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/eventss',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"event": {"name":name, "location":location, "date":date}}),
      dataType: 'json'
    }, callback);
  },

  listEvents: function (callback) {
    this.ajax({
      method: 'GET',
      url: this.svr + '/events',
      dataType: 'json'
    }, callback);
  },

  deleteEvent: function (callback, name) {
    this.ajax({
      method: 'DELETE',
      url: this.svr + '/events',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"event": {"name":name, "location":location, "date":date}}),
      dataType: 'json'
    }, callback);
  },

  createTasks: function (callback, eventId, name) {
    this.ajax({
      method: 'POST',
      url: this.svr + '/events/' + eventId + '/tasks',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"task": {"name":name, "date":date}}),
      dataType: 'json'
    }, callback);
  },

  listTasks: function (callback, eventId) {
    this.ajax({
      method: 'GET',
      url: this.svr + '/events/' + eventId + '/tasks',
      dataType: 'json'
    }, callback);
  },

  deleteTasks: function (callback, eventID, name) {
    this.ajax({
      method: 'DELETE',
      url: this.svr + '/events' + eventId + '/tasks',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({"event": {"name":name, "date":date}}),
      dataType: 'json'
    }, callback);
  },
