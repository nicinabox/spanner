class App.Vehicles extends Thorax.Collection
  model: App.Vehicle
  localStorage: new Backbone.LocalStorage("vehicles")
