module.exports = function (app) {
  var restApiRoot = app.get('restApiRoot');
  var _ = require('lodash');
  var models = app.models();

  /**
   * Copied from loopback explorer
   * Given a propType (which may be a function, string, or array),
   * get a string type.
   * @param  {*} propType Prop type description.
   * @return {String}     Prop type string.
   */
  function getPropType(propType) {
    if (typeof propType === 'function') {
      // See https://github.com/strongloop/loopback-explorer/issues/32
      // The type can be a model class
      return propType.modelName || propType.name.toLowerCase();
    } else if (Array.isArray(propType)) {
      return 'array';
    } else if (typeof propType === 'object') {
      // Anonymous objects, they are allowed e.g. in accepts/returns definitions
      return 'object';
    }
    return propType;
  }


  app.get(restApiRoot + '/model', function(req, res) {
    var schema = {};

    models.forEach(function(model) {
      var name = model.modelName;
      var modelDetails = app.loopback.findModel(name);
      var path = modelDetails.sharedClass.http;
      //Clone the properties so we don't mess them up when we stringify the type
      var originalProps = modelDetails.definition.properties;
      var props = JSON.parse(JSON.stringify( originalProps));
      console.log(props);
      
      Object.keys(props).forEach(function(key) {
        var prop = props[key];
        prop.type = getPropType(originalProps[key].type);
      });
      schema[name] = props;
      console.log(name, schema[name]); 
    });

    res.send(schema);
  });
};
