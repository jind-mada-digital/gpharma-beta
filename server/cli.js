/* const express = require('express');
const expressListEndpoints = require('express-list-endpoints');
const app = require('./server');

const routes = expressListEndpoints(app);

// Print the list of routes
console.log('List of routes:', routes); */

const expressListEndpoints = require('express-list-endpoints');
const app = require('./server'); // Import the Express app from server.js
const yargs = require('yargs');

// Define the command-line options and arguments using yargs
const argv = yargs
  .command('route', 'List all routes for a module', (yargs) => {
    yargs.option('module', {
      alias: 'm',
      description: 'Name of the module',
      type: 'string',
      demandOption: true, // Requires the -m or --module option
    });
  })
  .help()
  .alias('help', 'h').argv;

// Check for the "route" command
if (argv._[0] === 'route') {
  // Get the module name from the command line arguments
  const moduleName = argv.module;

  // Get the list of routes
  const routes = expressListEndpoints(app);

  // Filter routes based on the module name
  const filteredRoutes = routes.filter((route) => route.path.includes(`/${moduleName}/`));

  // Print the list of filtered routes
  console.log(`List of routes for module '${moduleName}':`);
  filteredRoutes.forEach((route) => {
    console.log(`${route.methods.join(', ')}: ${route.path}`);
  });
} else {
  // Handle other commands or provide usage instructions
  console.log('Usage: node cli.js route --module <module>');
}
