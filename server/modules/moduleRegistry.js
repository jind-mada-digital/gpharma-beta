const fs = require('fs');
const path = require('path');

// Store the registered modules
const modules = [];

// Register a new module
const registerModule = async ( module ) => {
  try {
    const module = await import(modulePath);
    modules.push(module.handler);
  } catch (error) {
    console.error(`Failed to register module at path: ${modulePath}`, error);
  }
};

/**
 * Get all registered modules.
 *
 * This function scans the current directory for subdirectories that contain an 'index.js' file.
 * It loads and registers each module dynamically and returns an array of registered modules.
 *
 * @returns {Object[]} An array of registered modules.
 */
const getModules = () => {

  const currentFolder = __dirname;

  let modules = [];

  // Get the contents of the current directory
  const currentFolderContents = fs.readdirSync(currentFolder);

  // Filter subdirectories with an 'index.js' file (representing modules)
  const directoriesWithIndexFile = currentFolderContents.filter( (name) => {

    const fullPath = path.join(currentFolder, name);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const files = fs.readdirSync(fullPath);
      return files.includes('index.js');
    }
    return false;
  });

  // Load and register each module
  for( let moduleFolder of directoriesWithIndexFile ){
    // path.join to construct the correct path to the module's index.js file
    const modulePath = path.join(currentFolder, moduleFolder, 'index');
    const module = require(modulePath);
    modules.push(module);
  }

  return modules;
}

// Export the module registry functions
module.exports = { registerModule, getModules };