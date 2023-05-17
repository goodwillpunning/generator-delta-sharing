'use strict';

var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    // Next, add your custom code
    // This method adds support for a `--babel` flag
    this.option('babel');
  }

  // Placeholder for an init method
  initializing() {
    this.log('Initializing...');
  }

  // Gather user input for generating a React app for Delta Sharing
  async prompting() {
    this.answers = await this.prompt([
      {
        name: "appName",
        message: "Enter a name for your app",
        default: "My Delta Sharing App",
        store: true
      },
      {
        name: "description",
        message: "Enter a description of the app",
        default: "An app for sharing datasets.",
        store: true
      },
      {
        name: "authorName",
        message: "Enter the author's name",
        store: true
      },
      {
        name: "authorEmail",
        message: "Enter the author's email",
        store: true
      },
      {
        type: "input",
        name: "endpoint",
        message: "Enter the Delta sharing server URL",
        default: "https://sharing.delta.io/delta-sharing/",
        store: true
      },
      {
        type: "input",
        name: "bearerToken",
        message: "Enter the sharing token",
        store: true
      }
    ]);
  }

  // Placeholder method for writing the app files
  writing() {
    this.log("Writing app name", this.answers.endpoint);
    this.log("Writing cool feature", this.answers.bearerToken);
  }

  // Placeholder method for installing depepndencies from NPM
  installing() {
    this.log("Installing dependencies...");
  }
}
