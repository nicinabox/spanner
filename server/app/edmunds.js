var _       = require('lodash');
var param   = require('node-jquery-param');
var request = require('request');

(function () {
  'use strict';

  var _options = {
    host: 'https://api.edmunds.com',
    prefix: 'api',
    version: 2,
    dataset: 'vehicle',
    key: process.env.EDMUNDS_API_KEY,
    params: {},
    resource: ''
  };

  var EdmundsApi = function(options) {
    this.options = _.extend(_options, options);
  };

  EdmundsApi.prototype = {
    fetch: function(callback) {
      callback = callback || _.noop;
      request(this.url(), callback);
    },

    urlV1: function() {
      return [
        this.options.host,
        'v' + this.options.version,
        this.options.prefix,
        this.options.dataset,
        this.options.resource
      ].join('/');
    },

    urlV2: function() {
      return [
        this.options.host,
        this.options.prefix,
        this.options.dataset,
        'v' + this.options.version,
        this.options.resource
      ].join('/');
    },

    isUsingApiV1: function() {
      return this.options.version === 1;
    },

    url: function() {
      var baseUrl, params;

      if (this.isUsingApiV1()) {
        baseUrl = this.urlV1();
      }
      else {
        baseUrl = this.urlV2();
      }

      params = _.extend({},
        this.options.params,
        {
          api_key: this.options.key,
          fmt: 'json'
        }
      );

      return [baseUrl, param(params)].join('?');
    }
  };

  module.exports = EdmundsApi;
})();

