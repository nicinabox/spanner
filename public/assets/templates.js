this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["add_reminder"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "    <a href=\"#\" class=\"btn btn-danger pull-right\" data-destroy>\n      Remove\n    </a>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<form action=\"\">\n  <div class=\"form-group\">\n    <label class=\"control-label\" for=\"reminder\">Reminder</label>\n    <input type=\"text\" class=\"form-control\" name=\"reminder\"\n      placeholder=\"E.g., Change oil at 60,000\" required>\n  </div>\n\n  <input type=\"hidden\" name=\"vehicle_id\" value="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n  <button class=\"btn btn-success\">Save</button>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.model : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</form>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["add_service"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "      <input type=\"text\" name=\"mileage\" class=\"form-control\"\n        value=\""
    + escapeExpression(((helpers.formatNumber || (depth0 && depth0.formatNumber) || helperMissing).call(depth0, "0,0", (depth0 != null ? depth0.currentEstimatedMileage : depth0), {"name":"formatNumber","hash":{},"data":data})))
    + "\" placeholder=\"E.g., 13,500\">\n      <small class=\"help-block\">\n        Your current mileage (we estimated)\n      </small>\n";
},"3":function(depth0,helpers,partials,data) {
  return "      <input type=\"text\" name=\"mileage\" class=\"form-control\" placeholder=\"E.g., 13,500\">\n";
  },"5":function(depth0,helpers,partials,data) {
  return "    <div class=\"form-group\">\n      <label class=\"control-label\" for=\"cost\">Cost</label>\n      <input type=\"number\" name=\"cost\" class=\"form-control\"\n        placeholder=\"E.g., 40\">\n    </div>\n";
  },"7":function(depth0,helpers,partials,data) {
  return "    <a href=\"#\" class=\"btn btn-danger pull-right\" data-destroy>\n      Remove\n    </a>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<form action=\"\">\n  <div class=\"form-group\">\n    <label class=\"control-label\" for=\"date\">Date</label>\n    <input type=\"text\" name=\"date\" class=\"form-control\"\n      value=\""
    + escapeExpression(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"date","hash":{},"data":data}) : helper)))
    + "\">\n  </div>\n\n  <div class=\"form-group\">\n    <label class=\"control-label\" for=\"mileage\">Mileage</label>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.currentEstimatedMileage : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  </div>\n\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.vehicle : depth0)) != null ? stack1.settings : stack1)) != null ? stack1.enableCost : stack1), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  <div class=\"form-group\">\n    <label class=\"control-label\" for=\"notes\">Notes</label>\n    <textarea name=\"notes\" class=\"form-control\"\n      placeholder=\"E.g., Change oil, oil filter\"></textarea>\n  </div>\n\n  <input type=\"hidden\" name=\"vehicle_id\" value="
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + ">\n  <button class=\"btn btn-success\">Save</button>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.model : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</form>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["add_vehicle"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<form action=\"\">\n  <div class=\"form-group\">\n    <label class=\"control-label\" for=\"\">Name</label>\n    <input type=\"text\" name=\"name\" class=\"form-control\" placeholder=\"E.g., 2015 Mini Cooper GP\">\n  </div>\n\n  <button class=\"btn btn-success\">Save</button>\n</form>\n";
  },"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["import_records"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "  <p class=\"help-block\">\n    All done! It's safe to navigate away.\n  </p>\n";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.preview : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.program(9, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.importing : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data) {
  return "      <p class=\"help-block\">\n        Sit tight for a second...\n      </p>\n";
  },"7":function(depth0,helpers,partials,data) {
  return "      <p class=\"help-block\">\n        Take a second to look over the records. They aren't saved yet.\n      </p>\n\n      <nav>\n        <a href=\"#\" class=\"js-import-records btn btn-success\">\n          Looks good, import\n        </a>\n        <a href=\"#\" class=\"js-cancel-import btn btn-secondary pull-right\">\n          Cancel\n        </a>\n      </nav>\n";
  },"9":function(depth0,helpers,partials,data) {
  return "    <form action=\"\" multipart=\"true\">\n      <p class=\"help-block\">\n        Upload a CSV with date, mileage, notes, and (optionally) cost fields.\n      </p>\n\n      <div class=\"form-group\">\n        <label for=\"\" class=\"control-label\">Upload CSV</label>\n        <input type=\"file\" name=\"records\" class=\"form-control\" required>\n      </div>\n\n      <button class=\"btn btn-success\">Preview</button>\n    </form>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.doneImporting : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["popover"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "  <header class=\"pop-over-header\">\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.stackEmpty : depth0), {"name":"unless","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    <h4>"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h4>\n\n    <a href=\"#\" class=\"close\">&times;</a>\n  </header>\n";
},"2":function(depth0,helpers,partials,data) {
  return "      <a href=\"#\" class=\"back\">\n        <i class=\"fa fa-angle-left\"></i>\n      </a>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.title : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n<div class=\"pop-over-content\">\n  "
    + escapeExpression(((helper = (helper = helpers['layout-element'] || (depth0 != null ? depth0['layout-element'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"layout-element","hash":{},"data":data}) : helper)))
    + "\n</div>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["records"] = Handlebars.template({"1":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "    <div class=\"record-year\">\n      <h3>"
    + escapeExpression(((helper = (helper = helpers.year || (depth0 != null ? depth0.year : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"year","hash":{},"data":data}) : helper)))
    + "</h3>\n      <table class=\"table table-striped\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.records : depth0), {"name":"each","hash":{},"fn":this.program(2, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      </table>\n    </div>\n";
},"2":function(depth0,helpers,partials,data,depths) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "          <tr data-id=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n            <td class=\"date\">"
    + escapeExpression(((helpers.formatDate || (depth0 && depth0.formatDate) || helperMissing).call(depth0, "MMM DD", (depth0 != null ? depth0.date : depth0), {"name":"formatDate","hash":{},"data":data})))
    + "</td>\n            <td class=\"mileage\">"
    + escapeExpression(((helpers.formatNumber || (depth0 && depth0.formatNumber) || helperMissing).call(depth0, "000,000", (depth0 != null ? depth0.mileage : depth0), {"name":"formatNumber","hash":{},"data":data})))
    + "</td>\n\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depths[2] != null ? depths[2].settings : depths[2])) != null ? stack1.enableCost : stack1), {"name":"if","hash":{},"fn":this.program(3, data, depths),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n            <td class=\"notes\">"
    + escapeExpression(((helper = (helper = helpers.notes || (depth0 != null ? depth0.notes : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"notes","hash":{},"data":data}) : helper)))
    + "</td>\n          </tr>\n";
},"3":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "              <td class=\"cost\">"
    + escapeExpression(((helpers.formatNumber || (depth0 && depth0.formatNumber) || helperMissing).call(depth0, "$0", (depth0 != null ? depth0.cost : depth0), {"name":"formatNumber","hash":{},"data":data})))
    + "</td>\n";
},"5":function(depth0,helpers,partials,data) {
  return "    <div class=\"no-results\">\n      <h3>You don't have any records yet.</h3>\n      <p>\n        Try adding your purchase as the first one.\n      </p>\n    </div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data,depths) {
  var stack1, buffer = "<div id=\"records\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.records : depth0), {"name":"each","hash":{},"fn":this.program(1, data, depths),"inverse":this.program(5, data, depths),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"useData":true,"useDepths":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["reminders"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "";
},"3":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "  <div id=\"reminders\">\n    <h5 class=\"text-muted\">\n      <span class=\"fa fa-clock-o fa-fw\"></span>\n      Reminders\n    </h5>\n\n";
  stack1 = ((helpers.collection || (depth0 && depth0.collection) || helperMissing).call(depth0, {"name":"collection","hash":{
    'class': ("list-unstyled"),
    'tag': ("ul")
  },"fn":this.program(4, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n";
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "      <li>\n        <a href=\"#\" class=\"js-reminder\">\n          "
    + escapeExpression(((helper = (helper = helpers.reminder || (depth0 != null ? depth0.reminder : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"reminder","hash":{},"data":data}) : helper)))
    + "\n        </a>\n      </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.empty || (depth0 && depth0.empty) || helperMissing).call(depth0, (depth0 != null ? depth0.collection : depth0), {"name":"empty","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["remove_vehicle_confirmation"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<form action=\"\">\n  <div class=\"form-group\">\n    <p class=\"help-block\">\n      If you're getting rid of this vehicle, consider Retiring it instead so your records will be preserved.\n    </p>\n\n    <label class=\"control-label\" for=\"\">Type the word: <em>"
    + escapeExpression(((helper = (helper = helpers.confirmation_word || (depth0 != null ? depth0.confirmation_word : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"confirmation_word","hash":{},"data":data}) : helper)))
    + "</em></label>\n    <input type=\"text\" name=\"confirmation\" class=\"form-control\">\n  </div>\n\n  <button class=\"btn btn-danger\">Remove</button>\n</form>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["rename_vehicle"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<form action=\"\">\n  <div class=\"form-group\">\n    <label for=\"name\">Name</label>\n    <input type=\"text\" name=\"name\" class=\"form-control\"\n      value=\""
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "\">\n  </div>\n  <button class=\"btn btn-success\">Change</button>\n</form>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["session_menu"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<ul class=\"nav nav-pills nav-stacked\">\n  <li>\n    <a href=\"#\" class=\"js-logout text-danger\">Log Out</a>\n  </li>\n</ul>\n";
  },"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["session_view"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return escapeExpression(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"email","hash":{},"data":data}) : helper)))
    + "\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["vehicle"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "        <p class=\"text-muted text-right\">\n          You drive about "
    + escapeExpression(((helpers.formatNumber || (depth0 && depth0.formatNumber) || helperMissing).call(depth0, "0,000", (depth0 != null ? depth0.milesPerYear : depth0), {"name":"formatNumber","hash":{},"data":data})))
    + " miles a year\n        </p>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div id=\"header\">\n  <nav class=\"navbar navbar-default navbar-fixed-top\">\n\n    <div class=\"container-fluid\">\n      <div class=\"\">\n        <div class=\"col-sm-4\">\n          <a href=\"#vehicles\" class=\"back btn\">\n            <i class=\"fa fa-chevron-left\"></i>\n          </a>\n          <a href=\"#\" class=\"js-name btn btn-default\">\n            "
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\n          </a>\n          <a href=\"#\" class=\"js-settings btn btn-default\">\n            Settings\n          </a>\n        </div>\n        <div class=\"col-sm-4 hidden-sm hidden-xs\">\n          <form class=\"navbar-form\">\n            <input type=\"search\" name=\"filter\" id=\"filter\" class=\"form-control text-center\"\n              placeholder=\"Search\">\n          </form>\n        </div>\n        <div class=\"col-sm-4\">\n          <nav class=\"pull-right\">\n            <a href=\"#\" class=\"js-vehicles btn btn-default\">\n              Vehicles\n            </a>\n\n            "
    + escapeExpression(((helpers.view || (depth0 && depth0.view) || helperMissing).call(depth0, (depth0 != null ? depth0.sessionView : depth0), {"name":"view","hash":{},"data":data})))
    + "\n          </nav>\n        </div>\n      </div>\n    </div>\n\n  </nav>\n</div>\n\n<div class=\"container action-bar\">\n  <div class=\"row\">\n    <div class=\"col-sm-4\">\n      <nav>\n        <a href=\"#\" class=\"js-add-service btn btn-secondary\">\n          + Add Service\n        </a>\n        <a href=\"#\" class=\"js-add-reminder btn btn-secondary\">\n          + Add Reminder\n        </a>\n      </nav>\n    </div>\n\n    <div class=\"col-sm-4 pull-right\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.milesPerYear : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\n  </div>\n</div>\n\n<div id=\"main\">\n  <div class=\"container\">\n    "
    + escapeExpression(((helpers.view || (depth0 && depth0.view) || helperMissing).call(depth0, (depth0 != null ? depth0.remindersView : depth0), {"name":"view","hash":{},"data":data})))
    + "\n    "
    + escapeExpression(((helpers.view || (depth0 && depth0.view) || helperMissing).call(depth0, (depth0 != null ? depth0.recordsView : depth0), {"name":"view","hash":{},"data":data})))
    + "\n  </div>\n</div>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["vehicle_settings"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "        <i class=\"fa fa-check pull-right\"></i>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<ul class=\"nav nav-pills nav-stacked\">\n  <li>\n    <a href=\"#\" class=\"js-enable-cost\">\n      Enable Cost\n\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.settings : depth0)) != null ? stack1.enableCost : stack1), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </a>\n  </li>\n  <li>\n    <a href=\"#\" class=\"js-import-records\">\n      Import&hellip;\n    </a>\n  </li>\n  <li>\n    <a href=\"#\" class=\"text-danger js-remove-vehicle\">\n      Remove&hellip;\n    </a>\n  </li>\n</ul>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["vehicles"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "        <div class=\"col-md-3\">\n";
  stack1 = ((helpers.link || (depth0 && depth0.link) || helperMissing).call(depth0, "vehicles/{{_id}}", {"name":"link","hash":{
    'expand-tokens': (true),
    'class': ("vehicle")
  },"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </div>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "            <span>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div id=\"header\">\n  <nav class=\"navbar navbar-default navbar-fixed-top\">\n    <div class=\"container-fluid\">\n      <div class=\"\">\n        <div class=\"col-sm-4\">\n        </div>\n        <div class=\"col-sm-4 text-center\">\n          <a href=\"/\" id=\"logo\">\n            <img src=\"/assets/wrench.png\" alt=\"\">\n          </a>\n        </div>\n        <div class=\"col-sm-4\">\n          <nav class=\"pull-right\">\n            "
    + escapeExpression(((helpers.view || (depth0 && depth0.view) || helperMissing).call(depth0, (depth0 != null ? depth0.sessionView : depth0), {"name":"view","hash":{},"data":data})))
    + "\n          </nav>\n        </div>\n      </div>\n    </div>\n\n  </nav>\n</div>\n\n\n<div id=\"main\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <h5 class=\"row-heading\">\n        <span class=\"fa fa-car fa-fw\"></span>\n        All Vehicles\n      </h5>\n";
  stack1 = ((helpers.collection || (depth0 && depth0.collection) || helperMissing).call(depth0, {"name":"collection","hash":{
    'id': ("vehicles-menu")
  },"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n      <form class=\"col-md-3\">\n        <a href=\"#\" class=\"vehicle add-vehicle\">\n          <span>Add a vehicle&hellip;</span>\n        </a>\n      </form>\n    </div>\n\n  </div>\n</div>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["vehicles_menu"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "  <li>\n";
  stack1 = ((helpers.link || (depth0 && depth0.link) || helperMissing).call(depth0, "vehicles/{{_id}}", {"name":"link","hash":{
    'expand-tokens': (true)
  },"fn":this.program(2, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </li>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "      "
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.collection || (depth0 && depth0.collection) || helperMissing).call(depth0, {"name":"collection","hash":{
    'class': ("nav nav-pills nav-stacked"),
    'tag': ("ul")
  },"fn":this.program(1, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "<hr>\n<ul class=\"nav nav-pills nav-stacked\">\n  <li>\n    <a href=\"#\" class=\"add-vehicle\">Add vehicle&hellip;</a>\n  </li>\n</ul>\n";
},"useData":true});;
this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["welcome"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "            <h4 class=\"text-success\">\n              <i class=\"fa fa-check\"></i>\n              Check your email for a link.\n\n              <a href=\"#\" class=\"try-again\">Try again.</a>\n            </h4>\n\n";
  },"3":function(depth0,helpers,partials,data) {
  var stack1, helper, lambda=this.lambda, escapeExpression=this.escapeExpression, functionType="function", helperMissing=helpers.helperMissing;
  return "            <form class=\"form-inline\">\n              <div class=\"form-group\">\n                <input id=\"user\" name=\"user\" type=\"email\" class=\"form-control\"\n                  value=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.user : depth0)) != null ? stack1.user : stack1), depth0))
    + "\" placeholder=\""
    + escapeExpression(((helper = (helper = helpers.placeholder || (depth0 != null ? depth0.placeholder : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"placeholder","hash":{},"data":data}) : helper)))
    + "\" autofocus>\n              </div>\n\n              <button class=\"btn btn-primary\">Sign In</button>\n            </form>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div id=\"main\">\n  <div class=\"container\">\n    <div class=\"text-center\">\n      <h2>\n        Easily keep service records for all your vehicles\n      </h2>\n      <br>\n\n      <div class=\"row\">\n        <div class=\"col-sm-6 col-sm-offset-3\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.authenticating : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </div>\n      </div>\n\n    </div>\n  </div>\n</div>\n";
},"useData":true});;