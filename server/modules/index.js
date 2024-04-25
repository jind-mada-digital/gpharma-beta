/* const { getModules } = require('./moduleRegistry');

// Load the registered modules dynamically
const modules = getModules();

modules.forEach( (module) => {
  // Invoke any necessary initialization logic in the module's index.js file
  require(`./modules/${module.name.toLowerCase().replace(/\s+/g, '-')}/index.js`);
}); */