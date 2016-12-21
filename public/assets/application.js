(function() {
  var App, _sync,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  Handlebars.registerHelpers = function(methods) {
    return _.each(methods, function(fn, name) {
      return Handlebars.registerHelper(name, fn);
    });
  };

  App = {
    start: function() {
      this.session = new App.Session;
      this.layout = new App.RootView;
      this.router = new App.ApplicationRouter;
      this.popover = new App.PopOverView;
      this.vehicles = new App.Vehicles;
      this.session.on('auth:resolve', (function(_this) {
        return function() {
          if (!Backbone.History.started) {
            Backbone.history.start({
              pushState: true
            });
          }
          return _this.router.redirectTo('vehicles');
        };
      })(this));
      this.session.on('auth:reject', (function(_this) {
        return function() {
          if (!Backbone.History.started) {
            Backbone.history.start({
              pushState: true
            });
          }
          return _this.router.redirectTo('');
        };
      })(this));
      return this.session.authorize();
    }
  };

  _.bindAll(App);

  window.App = App;

  _.mixin({
    capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
  });

  _sync = Backbone.sync;

  Backbone.sync = function(method, model, options) {
    var _error;
    options.headers = {
      accept: 'application/json;version=2',
      authorization: "Token " + (App.session.get('auth_token'))
    };
    if (model && (method === 'create' || method === 'update' || method === 'patch')) {
      options.contentType = 'application/json';
      options.data = JSON.stringify(options.attrs || model.toJSON());
    }
    _error = options.error;
    options.error = function(xhr, status, error_thrown) {
      if (typeof _error === "function") {
        _error(xhr, status, error_thrown);
      }
      if (xhr.status === 401) {
        return App.session.unauthorize();
      }
    };
    return _sync.call(this, method, model, options);
  };

  Handlebars.registerHelpers({
    log: function(obj) {
      return console.log(obj);
    },
    formatDate: function(date, format) {
      if (date) {
        return moment(new Date(date)).utc().format(format);
      }
    },
    formatNumber: function(format, number) {
      if (number) {
        return numeral(number).format(format);
      }
    },
    capitalize: function(str) {
      if (str) {
        return _.capitalize(str);
      }
    },
    markdown: function(str) {
      if (str) {
        return marked(str);
      }
    },
    any: function(collection, options) {
      if (!_.isEmpty(collection)) {
        return options.fn(this);
      }
    }
  });

  App.Record = (function(superClass) {
    extend(Record, superClass);

    function Record() {
      return Record.__super__.constructor.apply(this, arguments);
    }

    Record.prototype.validatePresence = ['date', 'notes'];

    Record.prototype.validate = function(attrs) {
      var errors;
      errors = _.map(attrs, (function(_this) {
        return function(v, k) {
          if (_.contains(_this.validatePresence, k) && _.isEmpty(v)) {
            return {
              name: k,
              message: 'cannot be empty'
            };
          }
        };
      })(this));
      errors = _.compact(errors);
      if (!_.isEmpty(errors)) {
        return errors;
      }
    };

    Record.prototype.set = function(data) {
      data.date = moment(data.date).utc().format('YYYY-MM-DD');
      data.mileage = numeral(data.mileage).value();
      return Record.__super__.set.call(this, data);
    };

    return Record;

  })(Thorax.Model);

  App.Reminder = (function(superClass) {
    extend(Reminder, superClass);

    function Reminder() {
      return Reminder.__super__.constructor.apply(this, arguments);
    }

    Reminder.prototype.validatePresence = ['notes'];

    Reminder.prototype.validate = function(attrs) {
      var errors;
      errors = _.map(attrs, (function(_this) {
        return function(v, k) {
          if (_.contains(_this.validatePresence, k) && _.isEmpty(v)) {
            return {
              name: k,
              message: 'cannot be empty'
            };
          }
        };
      })(this));
      errors = _.compact(errors);
      if (!_.isEmpty(errors)) {
        return errors;
      }
    };

    return Reminder;

  })(Thorax.Model);

  App.Session = (function(superClass) {
    extend(Session, superClass);

    function Session() {
      return Session.__super__.constructor.apply(this, arguments);
    }

    Session.prototype.urlRoot = '/api/sessions';

    Session.prototype.initialize = function() {
      return this.on('change:auth_token', this.onChangeToken);
    };

    Session.prototype.requestSession = function(data) {
      return this.save(data);
    };

    Session.prototype.login = function(loginToken) {
      return $.ajax({
        url: [this.urlRoot, loginToken].join('/'),
        dataType: 'json',
        success: (function(_this) {
          return function(response) {
            return _this.authorize(response);
          };
        })(this)
      });
    };

    Session.prototype.logout = function() {
      this.destroy();
      localStorage.clear();
      this.clear();
      return App.session = new this.constructor;
    };

    Session.prototype.authorize = function(data) {
      if (data) {
        this.set(data);
        return localStorage.setItem('session', JSON.stringify(this.toJSON()));
      } else {
        data = JSON.parse(localStorage.getItem('session'));
        if (data) {
          return this.set(data);
        } else {
          return this.onChangeToken();
        }
      }
    };

    Session.prototype.unauthorize = function() {
      return this.logout();
    };

    Session.prototype.isAuthorized = function() {
      return !!this.get('auth_token');
    };

    Session.prototype.onChangeToken = function() {
      if (this.isAuthorized()) {
        return this.trigger('auth:resolve');
      } else {
        return this.trigger('auth:reject');
      }
    };

    return Session;

  })(Thorax.Model);

  App.Vehicle = (function(superClass) {
    extend(Vehicle, superClass);

    function Vehicle() {
      return Vehicle.__super__.constructor.apply(this, arguments);
    }

    Vehicle.prototype.validatePresence = ['name'];

    Vehicle.prototype.url = function() {
      if (this.id) {
        return "/api/vehicles/" + this.id;
      } else {
        return "/api/vehicles";
      }
    };

    Vehicle.prototype.hasVin = function() {
      return !_.isEmpty(this.get('vin'));
    };

    Vehicle.prototype.hasDetails = function() {
      return !_.isEmpty(this.get('details'));
    };

    Vehicle.prototype.validate = function(attrs) {
      var errors;
      errors = _.map(attrs, (function(_this) {
        return function(v, k) {
          if (_.contains(_this.validatePresence, k) && _.isEmpty(v)) {
            return {
              name: k,
              message: 'cannot be empty'
            };
          }
        };
      })(this));
      if (attrs.vin && attrs.vin.length !== 17) {
        errors.push({
          name: 'vin',
          message: 'must be 17 characters'
        });
      }
      errors = _.compact(errors);
      if (!_.isEmpty(errors)) {
        return errors;
      }
    };

    return Vehicle;

  })(Thorax.Model);

  App.Records = (function(superClass) {
    extend(Records, superClass);

    function Records() {
      return Records.__super__.constructor.apply(this, arguments);
    }

    Records.prototype.model = App.Record;

    Records.prototype.url = function() {
      return "/api/vehicles/" + this.vehicleId + "/records";
    };

    Records.prototype.initialize = function(models, options) {
      this.vehicleId = options.vehicleId;
      return this.vehicle = options.vehicle;
    };

    Records.prototype.comparator = 'date';

    Records.prototype.currentEstimatedMileage = function() {
      var currentMileage, elapsedDays, last, mpd;
      mpd = this.recentMilesPerDay();
      if (!mpd) {
        return;
      }
      last = this.last().toJSON();
      elapsedDays = moment().subtract(1, 'day').diff(last.date, 'days');
      currentMileage = last.mileage + (elapsedDays * mpd);
      return currentMileage;
    };

    Records.prototype.recentMilesPerDay = function(days) {
      var ceil, elapsedDays, elapsedMileage, first, floor, last, models, previousIndex;
      if (days == null) {
        days = 90;
      }
      if (!(this.length && this.length > 1)) {
        return;
      }
      ceil = moment(this.last().get('date'));
      floor = ceil.subtract(days, 'days').startOf('month');
      models = this.filter(function(model) {
        var modelDate;
        modelDate = moment(model.get('date'));
        if (modelDate.isAfter(floor)) {
          return model;
        }
      });
      first = _.first(models).toJSON();
      last = _.last(models).toJSON();
      if (_.isEqual(first, last)) {
        previousIndex = this.indexOf(this.last()) - 1;
        first = this.at(previousIndex);
        first = first.toJSON();
      }
      elapsedDays = moment(last.date).diff(first.date, 'days');
      elapsedMileage = last.mileage - first.mileage;
      return +(elapsedMileage / elapsedDays).toFixed(2);
    };

    Records.prototype.milesPerYear = function() {
      return this.vehicle.get('miles_per_year');
    };

    Records.prototype.milesPerDay = function() {
      return this.vehicle.get('miles_per_day');
    };

    Records.prototype.groupByYear = function(data) {
      return _(data || this.toJSON()).groupBy(function(r) {
        return +moment(r.date).year();
      }).pairs().map(function(r) {
        r[0] = +r[0];
        r[1] = _.sortBy(r[1], function(record) {
          return -moment(record.date);
        });
        return _.zipObject(['year', 'records'], r);
      }).sortBy(function(r) {
        return -r.year;
      }).compact().value();
    };

    return Records;

  })(Thorax.Collection);

  App.Reminders = (function(superClass) {
    extend(Reminders, superClass);

    function Reminders() {
      return Reminders.__super__.constructor.apply(this, arguments);
    }

    Reminders.prototype.model = App.Reminder;

    Reminders.prototype.url = function() {
      return "/api/vehicles/" + this.vehicleId + "/reminders";
    };

    Reminders.prototype.initialize = function(models, options) {
      return this.vehicleId = options.vehicleId;
    };

    return Reminders;

  })(Thorax.Collection);

  App.Vehicles = (function(superClass) {
    extend(Vehicles, superClass);

    function Vehicles() {
      return Vehicles.__super__.constructor.apply(this, arguments);
    }

    Vehicles.prototype.model = App.Vehicle;

    Vehicles.prototype.url = '/api/vehicles';

    Vehicles.prototype.comparator = 'position';

    return Vehicles;

  })(Thorax.Collection);

  App.VehicleHeaderView = (function(superClass) {
    extend(VehicleHeaderView, superClass);

    function VehicleHeaderView() {
      return VehicleHeaderView.__super__.constructor.apply(this, arguments);
    }

    VehicleHeaderView.prototype.name = 'vehicle_header';

    VehicleHeaderView.prototype.events = {
      'click .back': 'goBack',
      'click .js-name': 'showChangeNamePopover',
      'click .js-settings': 'showSettingsPopover',
      'keyup #filter': 'filterRecords',
      'submit #header form': function(e) {
        return e.preventDefault();
      },
      'click a[class*=js-]': function(e) {
        return e.preventDefault();
      }
    };

    VehicleHeaderView.prototype.initialize = function() {
      return this.sessionView = new App.SessionView;
    };

    VehicleHeaderView.prototype.goBack = function(e) {
      var fragment, fragments;
      e.preventDefault();
      fragment = Backbone.history.fragment;
      fragments = fragment.split('/');
      fragments.pop();
      return App.router.redirectTo(fragments.join('/'));
    };

    VehicleHeaderView.prototype.filterRecords = function(e) {
      var re, val;
      val = e.currentTarget.value;
      re = new RegExp(val, 'i');
      return this.parent.$('#records tr').each(function() {
        var $this, content;
        $this = $(this);
        content = $this.text();
        $this.hide();
        if (re.test(content)) {
          return $this.show();
        }
      });
    };

    VehicleHeaderView.prototype.showChangeNamePopover = function(e) {
      return App.popover.toggle({
        elem: e.currentTarget,
        title: 'Edit Vehicle Details',
        populate: true,
        view: new App.EditVehicleView({
          model: this.model
        })
      });
    };

    VehicleHeaderView.prototype.showSettingsPopover = function(e) {
      return App.popover.toggle({
        elem: e.currentTarget,
        title: 'Vehicle Settings',
        view: new App.VehicleSettingsView({
          model: this.model,
          collection: this.collection
        })
      });
    };

    return VehicleHeaderView;

  })(Thorax.View);

  App.AddReminderView = (function(superClass) {
    extend(AddReminderView, superClass);

    function AddReminderView() {
      return AddReminderView.__super__.constructor.apply(this, arguments);
    }

    AddReminderView.prototype.name = 'add_reminder';

    AddReminderView.prototype.events = {
      'submit form': 'createOrUpdateRecord',
      'click [data-destroy]': 'destroyRecord'
    };

    AddReminderView.prototype.destroyRecord = function(e) {
      e.preventDefault();
      this.model.destroy();
      return this.parent.close();
    };

    AddReminderView.prototype.createOrUpdateRecord = function(e) {
      var model;
      e.preventDefault();
      if (this.model) {
        this.model.save(this.serialize());
        return this.parent.close();
      } else {
        model = new App.Reminder(this.serialize());
        if (model.isValid()) {
          this.collection.create(model);
          return this.parent.close();
        } else {
          return _.each(model.validationError, (function(_this) {
            return function(error) {
              return _this.$("[name=" + error.name + "]").closest('.form-group').addClass('has-error');
            };
          })(this));
        }
      }
    };

    return AddReminderView;

  })(Thorax.View);

  App.AddServiceView = (function(superClass) {
    extend(AddServiceView, superClass);

    function AddServiceView() {
      return AddServiceView.__super__.constructor.apply(this, arguments);
    }

    AddServiceView.prototype.name = 'add_service';

    AddServiceView.prototype.events = {
      'submit form': 'createOrUpdateRecord',
      'click [data-destroy]': 'destroyRecord',
      'rendered': function() {
        return _.defer((function(_this) {
          return function() {
            if (!_this.$el) {
              return;
            }
            _this.$('textarea').autosize();
            return _this.$('input[name=date]').datepicker({
              format: 'M d, yyyy',
              autoclose: true
            });
          };
        })(this));
      }
    };

    AddServiceView.prototype.initialize = function() {
      if (!this.model) {
        this.date = moment();
        return this.currentEstimatedMileage = this.collection.currentEstimatedMileage();
      }
    };

    AddServiceView.prototype.destroyRecord = function(e) {
      e.preventDefault();
      this.model.destroy();
      return this.parent.close();
    };

    AddServiceView.prototype.createOrUpdateRecord = function(e) {
      var model;
      e.preventDefault();
      if (this.model) {
        this.model.save(this.serialize());
        return this.parent.close();
      } else {
        model = new App.Record(this.serialize());
        if (model.isValid()) {
          this.collection.create(model);
          this.parent.close();
          return e.target.reset();
        } else {
          return _.each(model.validationError, (function(_this) {
            return function(error) {
              return _this.$("[name=" + error.name + "]").closest('.form-group').addClass('has-error');
            };
          })(this));
        }
      }
    };

    return AddServiceView;

  })(Thorax.View);

  App.AddVehicleView = (function(superClass) {
    extend(AddVehicleView, superClass);

    function AddVehicleView() {
      return AddVehicleView.__super__.constructor.apply(this, arguments);
    }

    AddVehicleView.prototype.name = 'add_vehicle';

    AddVehicleView.prototype.events = {
      'submit form': 'createVehicle'
    };

    AddVehicleView.prototype.createVehicle = function(e) {
      var model;
      e.preventDefault();
      model = new App.Vehicle(this.serialize());
      if (model.isValid()) {
        this.collection.create(model);
        return this.parent.close();
      } else {
        return _.each(model.validationError, (function(_this) {
          return function(error) {
            return _this.$("[name=" + error.name + "]").closest('.form-group').addClass('has-error');
          };
        })(this));
      }
    };

    return AddVehicleView;

  })(Thorax.View);

  App.EditVehicleNotesView = (function(superClass) {
    extend(EditVehicleNotesView, superClass);

    function EditVehicleNotesView() {
      return EditVehicleNotesView.__super__.constructor.apply(this, arguments);
    }

    EditVehicleNotesView.prototype.name = 'edit_vehicle_notes';

    EditVehicleNotesView.prototype.events = {
      'submit form': 'save',
      'rendered': function() {
        return _.delay((function(_this) {
          return function() {
            return _this.$('textarea').autosize();
          };
        })(this));
      }
    };

    EditVehicleNotesView.prototype.save = function(e) {
      e.preventDefault();
      this.model.save(this.serialize());
      return this.parent.close();
    };

    return EditVehicleNotesView;

  })(Thorax.View);

  App.EditVehicleView = (function(superClass) {
    extend(EditVehicleView, superClass);

    function EditVehicleView() {
      return EditVehicleView.__super__.constructor.apply(this, arguments);
    }

    EditVehicleView.prototype.name = 'edit_vehicle';

    EditVehicleView.prototype.events = {
      'submit form': 'saveVehicle'
    };

    EditVehicleView.prototype.saveVehicle = function(e) {
      e.preventDefault();
      this.model.set(this.serialize(), {
        validate: true
      });
      if (this.model.isValid()) {
        this.model.save();
        return this.parent.close();
      } else {
        return _.each(this.model.validationError, (function(_this) {
          return function(error) {
            return _this.$("[name=" + error.name + "]").closest('.form-group').addClass('has-error');
          };
        })(this));
      }
    };

    return EditVehicleView;

  })(Thorax.View);

  App.ImportRecordsView = (function(superClass) {
    extend(ImportRecordsView, superClass);

    function ImportRecordsView() {
      return ImportRecordsView.__super__.constructor.apply(this, arguments);
    }

    ImportRecordsView.prototype.name = 'import_records';

    ImportRecordsView.prototype.events = {
      'click a[class*=js-]': function(e) {
        return e.preventDefault();
      },
      'click .js-import-records': 'importRecords',
      'click .js-cancel-import': 'cancelImport',
      'submit form': 'previewImport'
    };

    ImportRecordsView.prototype.initialize = function() {
      return this.records = [];
    };

    ImportRecordsView.prototype.previewImport = function(e) {
      var file;
      e.preventDefault();
      file = this.$('input[type=file]')[0].files[0];
      this.preview = true;
      this.render();
      return this.parseFile(file, (function(_this) {
        return function(results) {
          var data, labels;
          data = results.data;
          labels = data.shift();
          _this.records = _.map(data, function(r) {
            return _.zipObject(labels, r);
          });
          _this.collection.reset();
          return _this.collection.add(_this.records);
        };
      })(this));
    };

    ImportRecordsView.prototype.importRecords = function() {
      this.importing = true;
      this.render();
      _.defer((function(_this) {
        return function() {
          _this.collection.reset();
          return _.each(_this.records, function(r) {
            return this.collection.create(r);
          }, _this);
        };
      })(this));
      return this.doneImporting();
    };

    ImportRecordsView.prototype.doneImporting = function() {
      this.doneImporting = true;
      return this.render();
    };

    ImportRecordsView.prototype.cancelImport = function() {
      this.preview = this.importing = void 0;
      return this.render();
    };

    ImportRecordsView.prototype.parseFile = function(file, done) {
      return Papa.parse(file, {
        complete: done
      });
    };

    return ImportRecordsView;

  })(Thorax.View);

  App.PopOverView = (function(superClass) {
    extend(PopOverView, superClass);

    function PopOverView() {
      return PopOverView.__super__.constructor.apply(this, arguments);
    }

    PopOverView.prototype.name = 'popover';

    PopOverView.prototype.className = 'pop-over';

    PopOverView.prototype.width = 340;

    PopOverView.prototype.events = {
      'click .close': 'close',
      'click .back': 'back'
    };

    PopOverView.prototype.stack = [];

    PopOverView.prototype.toggle = function(options) {
      this.stack = [];
      this.stackEmpty = true;
      this.title = options.title;
      if (this.isTextSelected()) {
        return;
      }
      this.render();
      options.view.retain();
      this.stack.push(options);
      this.setView(options.view);
      if (options.view.context) {
        options.view.populate(options.view.context());
      } else {
        options.view.populate({}, {
          children: false
        });
      }
      this.appendTo(App.layout.$el);
      this.setPosition(options);
      return this.selectInput(options);
    };

    PopOverView.prototype.pushView = function(options) {
      this.title = options.title;
      this.stackEmpty = false;
      this.render();
      options.view.retain(this);
      this.stack.push(options);
      this.setView(options.view);
      this.delegateEvents();
      return this.selectInput(options);
    };

    PopOverView.prototype.popView = function() {
      var current, previous;
      current = this.stack.pop();
      previous = _.last(this.stack);
      this.title = previous.title;
      this.stackEmpty = this.isLastInStack(previous);
      this.render();
      current.view.release();
      this.setView(previous.view);
      previous.view.delegateEvents();
      return this.selectInput(options);
    };

    PopOverView.prototype.selectInput = function(options) {
      var selector;
      if (options == null) {
        options = {};
      }
      selector = options.focus || 'input, textarea';
      return this.$(selector).first().select();
    };

    PopOverView.prototype.isTextSelected = function() {
      if (window.getSelection) {
        return !!window.getSelection().toString();
      }
    };

    PopOverView.prototype.isLastInStack = function(view) {
      return this.stack[0] === view;
    };

    PopOverView.prototype.setPosition = function(options) {
      var bounds, elem, height, offset, position, top;
      elem = options.elem;
      top = options.top;
      height = this.$el.outerHeight(true);
      offset = $(elem).offset();
      position = offset;
      bounds = {
        top: $(window).scrollTop(),
        left: 0,
        right: $(window).width(),
        bottom: $(window).height()
      };
      if (this.width > bounds.right) {
        this.width = bounds.right - 10;
      }
      position.right = offset.left + this.width;
      if (_.isNumber(top)) {
        position.top = offset.top + top;
      } else {
        position.top = offset.top + $(elem).outerHeight();
      }
      position.bottom = position.top + height;
      if (position.right > bounds.right) {
        position.left = offset.left - this.width + $(elem).outerWidth();
      }
      if (position.left < bounds.left) {
        position.left = (bounds.right - this.width) / 2;
      }
      if (position.bottom > bounds.bottom + bounds.top) {
        position.top = bounds.bottom - height + bounds.top;
      }
      if (position.top < bounds.top) {
        if (position.top - bounds.top < 10) {
          position.top = bounds.top;
        }
      }
      return this.$el.css({
        left: position.left,
        top: position.top,
        width: this.width
      });
    };

    PopOverView.prototype.back = function(e) {
      e.preventDefault();
      return this.popView();
    };

    PopOverView.prototype.close = function(e) {
      var view;
      if (e) {
        e.preventDefault();
      }
      view = this.getView();
      if (view) {
        view.release();
      }
      this.release();
      return App.popover = new this.constructor;
    };

    return PopOverView;

  })(Thorax.LayoutView);

  App.RecordsView = (function(superClass) {
    extend(RecordsView, superClass);

    function RecordsView() {
      return RecordsView.__super__.constructor.apply(this, arguments);
    }

    RecordsView.prototype.name = 'records';

    RecordsView.prototype.events = {
      'click #records .record': 'showEditServicePopover'
    };

    RecordsView.prototype.initialize = function() {
      this.records = this.collection.groupByYear();
      return this.listenTo(this.collection, 'add sync remove', function() {
        this.records = this.collection.groupByYear();
        return this.render();
      });
    };

    RecordsView.prototype.showEditServicePopover = function(e) {
      e.preventDefault();
      return App.popover.toggle({
        title: 'Edit Service',
        elem: e.currentTarget,
        focus: '[name=mileage]',
        top: -80,
        view: new App.AddServiceView({
          collection: this.collection,
          model: this.collection.get($(e.currentTarget).data('id')),
          vehicle: this.model.toJSON(),
          context: function() {
            var attrs;
            attrs = this.model.attributes;
            return {
              date: moment(new Date(attrs.date)).utc().format('MMM DD, YYYY'),
              mileage: numeral(attrs.mileage).format('0,0'),
              cost: attrs.cost,
              notes: attrs.notes
            };
          }
        })
      });
    };

    return RecordsView;

  })(Thorax.View);

  App.RemindersView = (function(superClass) {
    extend(RemindersView, superClass);

    function RemindersView() {
      return RemindersView.__super__.constructor.apply(this, arguments);
    }

    RemindersView.prototype.name = 'reminders';

    RemindersView.prototype.events = {
      'click .js-add-reminder': 'showAddReminderPopover',
      'click .js-reminder': 'showEditReminderPopover',
      'click a[class*=js-]': function(e) {
        return e.preventDefault();
      }
    };

    RemindersView.prototype.showAddReminderPopover = function(e) {
      return App.popover.toggle({
        title: 'Add Reminder',
        elem: e.currentTarget,
        view: new App.AddReminderView({
          collection: this.collection
        })
      });
    };

    RemindersView.prototype.showEditReminderPopover = function(e) {
      return App.popover.toggle({
        elem: e.currentTarget,
        title: 'Edit Reminder',
        populate: true,
        view: new App.AddReminderView({
          model: $(e.currentTarget).model(),
          collection: this.reminders
        })
      });
    };

    return RemindersView;

  })(Thorax.View);

  App.RemoveVehicleConfirmationView = (function(superClass) {
    extend(RemoveVehicleConfirmationView, superClass);

    function RemoveVehicleConfirmationView() {
      return RemoveVehicleConfirmationView.__super__.constructor.apply(this, arguments);
    }

    RemoveVehicleConfirmationView.prototype.name = 'remove_vehicle_confirmation';

    RemoveVehicleConfirmationView.prototype.events = {
      'submit form': 'removeVehicle'
    };

    RemoveVehicleConfirmationView.prototype.initialize = function() {
      return this.confirmation_word = 'delete';
    };

    RemoveVehicleConfirmationView.prototype.removeVehicle = function(e) {
      var data;
      e.preventDefault();
      data = this.serialize();
      if (data.confirmation === this.confirmation_word) {
        this.model.destroy();
        return App.router.redirectTo('vehicles');
      } else {
        return this.$("[name=confirmation]").closest('.form-group').addClass('has-error');
      }
    };

    return RemoveVehicleConfirmationView;

  })(Thorax.View);

  App.RootView = (function(superClass) {
    extend(RootView, superClass);

    function RootView() {
      return RootView.__super__.constructor.apply(this, arguments);
    }

    RootView.prototype.el = '#app';

    RootView.prototype.initialize = function() {
      Thorax.setRootObject(this);
      _.bindAll(this, 'closePopoversWithClick');
      _.bindAll(this, 'closePopoversWithEsc');
      this.on('load:start', Thorax.loadHandler(function() {
        return NProgress.start();
      }, function() {
        return NProgress.done();
      }));
      $(document).on('click', this.closePopoversWithClick);
      return $(document).on('keyup', this.closePopoversWithEsc);
    };

    RootView.prototype.closePopoversWithClick = function(e) {
      var clickInPopover;
      if (e.originalEvent.defaultPrevented) {
        return;
      }
      clickInPopover = $(e.target).closest('.pop-over').length;
      if (!clickInPopover) {
        return App.popover.close();
      }
    };

    RootView.prototype.closePopoversWithEsc = function(e) {
      var code;
      code = e.keyCode || e.which;
      if (code === 27) {
        return App.popover.close();
      }
    };

    return RootView;

  })(Thorax.LayoutView);

  App.SessionMenu = (function(superClass) {
    extend(SessionMenu, superClass);

    function SessionMenu() {
      return SessionMenu.__super__.constructor.apply(this, arguments);
    }

    SessionMenu.prototype.name = 'session_menu';

    SessionMenu.prototype.events = {
      'click .js-logout': 'logout'
    };

    SessionMenu.prototype.logout = function(e) {
      e.preventDefault();
      return App.session.logout();
    };

    return SessionMenu;

  })(Thorax.View);

  App.SessionView = (function(superClass) {
    extend(SessionView, superClass);

    function SessionView() {
      return SessionView.__super__.constructor.apply(this, arguments);
    }

    SessionView.prototype.name = 'session_view';

    SessionView.prototype.tagName = 'a';

    SessionView.prototype.className = 'btn btn-default';

    SessionView.prototype.events = {
      'click': 'showSessionPopover'
    };

    SessionView.prototype.initialize = function() {
      return this.model = App.session;
    };

    SessionView.prototype.showSessionPopover = function(e) {
      e.preventDefault();
      return App.popover.toggle({
        elem: e.currentTarget,
        view: new App.SessionMenu({
          model: this.model
        })
      });
    };

    return SessionView;

  })(Thorax.View);

  App.VehicleDetailsView = (function(superClass) {
    extend(VehicleDetailsView, superClass);

    function VehicleDetailsView() {
      return VehicleDetailsView.__super__.constructor.apply(this, arguments);
    }

    VehicleDetailsView.prototype.name = 'vehicle_details';

    VehicleDetailsView.prototype.events = {
      'click .js-refresh-details': 'refresh',
      'click a[class*=js-]': function(e) {
        return e.preventDefault();
      }
    };

    VehicleDetailsView.prototype.initialize = function(id) {
      this.vehicles = App.vehicles;
      if (this.vehicles.length) {
        this.model = this.vehicles.get(id);
      } else {
        this.model = new App.Vehicle({
          id: id
        });
        this.model.fetch();
      }
      this.listenTo(this.model, 'change', this.render);
      return this.vehicleHeaderView = new App.VehicleHeaderView({
        model: this.model
      });
    };

    VehicleDetailsView.prototype.refresh = function() {
      return this.model.save();
    };

    return VehicleDetailsView;

  })(Thorax.View);

  App.VehicleSettingsView = (function(superClass) {
    extend(VehicleSettingsView, superClass);

    function VehicleSettingsView() {
      return VehicleSettingsView.__super__.constructor.apply(this, arguments);
    }

    VehicleSettingsView.prototype.name = 'vehicle_settings';

    VehicleSettingsView.prototype.events = {
      'click a[class*=js-]': function(e) {
        return e.preventDefault();
      },
      'click .js-enable-cost': 'enable_cost',
      'click .js-import-records': 'importRecords',
      'click .js-retire-vehicle': 'retireVehicle',
      'click .js-remove-vehicle': 'removeVehicle'
    };

    VehicleSettingsView.prototype.enable_cost = function() {
      return this.model.save({
        enable_cost: !this.model.get('enable_cost')
      });
    };

    VehicleSettingsView.prototype.importRecords = function() {
      return App.popover.pushView({
        title: 'Import Records',
        view: new App.ImportRecordsView({
          model: this.model,
          collection: this.collection
        })
      });
    };

    VehicleSettingsView.prototype.retireVehicle = function() {
      return alert('Not yet implemented');
    };

    VehicleSettingsView.prototype.removeVehicle = function() {
      return App.popover.pushView({
        title: 'Remove Vehicle',
        view: new App.RemoveVehicleConfirmationView({
          model: this.model
        })
      });
    };

    return VehicleSettingsView;

  })(Thorax.View);

  App.VehicleView = (function(superClass) {
    extend(VehicleView, superClass);

    function VehicleView() {
      return VehicleView.__super__.constructor.apply(this, arguments);
    }

    VehicleView.prototype.name = 'vehicle';

    VehicleView.prototype.id = 'vehicle';

    VehicleView.prototype.events = {
      'click .js-add-service': 'showAddServicePopover',
      'click .js-add-reminder': 'showAddReminderPopover',
      'click .js-remove-record': 'removeRecord',
      'click .js-edit-vehicle-notes': 'showEditVehicleNotesPopover',
      'click a[class*=js-]': function(e) {
        return e.preventDefault();
      }
    };

    VehicleView.prototype.initialize = function(id) {
      this.vehicles = App.vehicles;
      if (this.vehicles.length) {
        this.model = this.vehicles.get(id);
      } else {
        this.model = new App.Vehicle({
          id: id
        });
        this.model.fetch();
      }
      this.collection = new App.Records([], {
        vehicleId: id,
        vehicle: this.model
      });
      this.reminders = new App.Reminders([], {
        vehicleId: id
      });
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.collection, 'add sync remove', function() {
        this.milesPerYear = this.collection.milesPerYear();
        return this.render();
      });
      this.recordsView = new App.RecordsView({
        model: this.model,
        collection: this.collection
      });
      this.remindersView = new App.RemindersView({
        collection: this.reminders
      });
      this.vehicleHeaderView = new App.VehicleHeaderView({
        model: this.model
      });
      this.reminders.fetch();
      return this.collection.fetch();
    };

    VehicleView.prototype.removeRecord = function(e) {
      var id, record;
      id = $(e.currentTarget).data('record-id');
      if (confirm('Really delete record?')) {
        record = this.collection.get(id);
        return record.destroy();
      }
    };

    VehicleView.prototype.showAddServicePopover = function(e) {
      return App.popover.toggle({
        title: 'Add Service',
        elem: e.currentTarget,
        focus: '[name=mileage]',
        view: new App.AddServiceView({
          collection: this.collection,
          vehicle: this.model.toJSON()
        })
      });
    };

    VehicleView.prototype.showAddReminderPopover = function(e) {
      return App.popover.toggle({
        title: 'Add Reminder',
        elem: e.currentTarget,
        view: new App.AddReminderView({
          vehicle: this.model,
          collection: this.reminders
        })
      });
    };

    VehicleView.prototype.showEditVehicleNotesPopover = function(e) {
      e.preventDefault();
      return App.popover.toggle({
        elem: e.currentTarget,
        title: 'Edit Vehicle Notes',
        populate: true,
        view: new App.EditVehicleNotesView({
          model: this.model
        })
      });
    };

    return VehicleView;

  })(Thorax.View);

  App.VehiclesMenu = (function(superClass) {
    extend(VehiclesMenu, superClass);

    function VehiclesMenu() {
      return VehiclesMenu.__super__.constructor.apply(this, arguments);
    }

    VehiclesMenu.prototype.name = 'vehicles_menu';

    VehiclesMenu.prototype.collection = App.vehicles;

    VehiclesMenu.prototype.events = {
      'click .add-vehicle': 'showAddVehiclePopover'
    };

    VehiclesMenu.prototype.showAddVehiclePopover = function(e) {
      e.preventDefault();
      return App.popover.pushView({
        title: 'Add Vehicle',
        view: new App.AddVehicleView({
          collection: this.collection
        })
      });
    };

    return VehiclesMenu;

  })(Thorax.View);

  App.VehiclesView = (function(superClass) {
    extend(VehiclesView, superClass);

    function VehiclesView() {
      return VehiclesView.__super__.constructor.apply(this, arguments);
    }

    VehiclesView.prototype.name = 'vehicles';

    VehiclesView.prototype.id = 'vehicles';

    VehiclesView.prototype.events = {
      'click .add-vehicle': 'showAddVehiclePopover',
      'rendered': 'sortable'
    };

    VehiclesView.prototype.sortable = function() {
      return _.defer((function(_this) {
        return function() {
          var collection;
          collection = _this.collection;
          return _this.$('#vehicles-menu').sortable({
            placeholder: "sortable-placeholder col-md-3",
            update: function(e, ui) {
              $(this).children().each(function(i, el) {
                var model;
                model = $(el).model();
                return model.save({
                  position: i
                });
              });
              return collection.sort();
            }
          });
        };
      })(this));
    };

    VehiclesView.prototype.initialize = function() {
      this.collection = App.vehicles;
      return this.sessionView = new App.SessionView;
    };

    VehiclesView.prototype.saveVehicle = function(e) {
      e.preventDefault();
      this.collection.create(this.serialize(e));
      return e.target.reset();
    };

    VehiclesView.prototype.showAddVehiclePopover = function(e) {
      e.preventDefault();
      return App.popover.toggle({
        elem: e.currentTarget,
        title: 'Add Vehicle',
        top: -5,
        view: new App.AddVehicleView({
          collection: this.collection
        })
      });
    };

    return VehiclesView;

  })(Thorax.View);

  App.WelcomeView = (function(superClass) {
    extend(WelcomeView, superClass);

    function WelcomeView() {
      return WelcomeView.__super__.constructor.apply(this, arguments);
    }

    WelcomeView.prototype.name = 'welcome';

    WelcomeView.prototype.id = 'welcome';

    WelcomeView.prototype.events = {
      'submit form': 'requestSession',
      'click .try-again': 'tryAgain'
    };

    WelcomeView.prototype.initialize = function() {
      this.placeholder = 'E.g., ' + this.randomEmail();
      return this.user = {};
    };

    WelcomeView.prototype.requestSession = function(e) {
      e.preventDefault();
      this.authenticating = true;
      this.user = this.serialize();
      App.session.requestSession(this.user);
      return this.render();
    };

    WelcomeView.prototype.tryAgain = function(e) {
      e.preventDefault();
      this.authenticating = false;
      return this.render();
    };

    WelcomeView.prototype.randomEmail = function() {
      var emails;
      emails = ['lando@cloudci.ty', 'robertpaulson@loustave.rn', 'drspaceman@rockefellerpla.ce', 'mal@firef.ly'];
      return _.sample(emails);
    };

    return WelcomeView;

  })(Thorax.View);

  App.ApplicationRouter = (function(superClass) {
    extend(ApplicationRouter, superClass);

    ApplicationRouter.prototype.routes = {
      '': 'welcome',
      'vehicles': 'vehicles',
      'vehicles/:id': 'vehicle',
      'sessions/:token': 'login'
    };

    function ApplicationRouter() {
      _.each(this.routes, function(method, route) {
        if (!this.constructor.prototype[method]) {
          return this.constructor.prototype[method] = function() {
            var options;
            options = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            return this.render.apply(this, [method].concat(slice.call(options)));
          };
        }
      }, this);
      ApplicationRouter.__super__.constructor.apply(this, arguments);
      this.on('route', function() {
        return App.layout.$('.pop-over').remove();
      });
    }

    ApplicationRouter.prototype.redirectTo = function(path) {
      return this.navigate(path, {
        trigger: true
      });
    };

    ApplicationRouter.prototype.render = function() {
      var method, name, options, view;
      method = arguments[0], options = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      name = _.capitalize(method);
      view = (function(func, args, ctor) {
        ctor.prototype = func.prototype;
        var child = new ctor, result = func.apply(child, args);
        return Object(result) === result ? result : child;
      })(App[name + 'View'], options, function(){});
      App.layout.setView(view);
      return App.currentView = view;
    };

    ApplicationRouter.prototype.login = function(token) {
      return App.session.login(token);
    };

    return ApplicationRouter;

  })(Backbone.Router);

  $(App.start);

}).call(this);

//# sourceMappingURL=application.js.map
