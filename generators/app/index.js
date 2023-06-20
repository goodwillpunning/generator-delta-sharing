'use strict';

const Generator = require('yeoman-generator');
const parseAuthor = require('parse-author');
const path = require('path');
const validatePackageName = require('validate-npm-package-name');
const localPackageJson = require('../../package.json');
const extend = require('lodash.merge');

const NODE_APP_TYPE = "Node.js (backend only)";
const REACT_APP_TYPE = "React.js App";

const NODE_TEMPLATE_PATH = "delta-sharing-nodejs-template/**";
const REACT_TEMPLATE_PATH = "delta-sharing-app-template/**";

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

    // Read local `package.json`
    this.package = this.fs.readJSON(this.destinationPath('package.json'), {});

    // Stub out package info
    this.props = {
      name: this.package.name,
      description: this.package.description,
      version: this.package.version,
      homepage: this.package.homepage,
      repositoryName: this.options.repositoryName
    };
    
    // Parse author information
    if (typeof this.package.author === 'object') {

      this.props.authorName = this.package.author.name;
      this.props.authorEmail = this.package.author.email;
      this.props.authorUrl = this.package.author.url;

    } else if (typeof this.package.author === 'string') {

      let info = parseAuthor(this.package.author);
      this.props.authorName = info.name;
      this.props.authorEmail = info.email;
      this.props.authorUrl = info.url;

    }
  }

  // Gather user input for generating a React app for Delta Sharing
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "list",
        name: "appType",
        message: "Enter app type",
        choices: [
          NODE_APP_TYPE,
          REACT_APP_TYPE
        ],
        store: true
      },
      {
        name: "appName",
        message: "Enter a name for your app",
        default: "My Delta Sharing App",
        store: true
      },
      {
        name: "appDescription",
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
        type: "password",
        name: "bearerToken",
        message: "Enter the sharing token"
      }
    ]);
  }

  writing() {

    var templatePath;
    if (this.answers.appType == NODE_APP_TYPE) {
      this.log("Writing Node.js app template...");
      templatePath = NODE_TEMPLATE_PATH;
    } else if (this.answers.appType == REACT_APP_TYPE) {
      this.log("Writing React.js app template...");
      templatePath = REACT_TEMPLATE_PATH;
    } else {
      throw new Error("Invalid app type detected.");
    }

    // Copy the appropriate app template
    this.fs.copy(
      this.templatePath(templatePath),
      this.destinationRoot(),
      { globOptions: { dot: true } }
    );

    // Programmatically extend the `package.json` file
    const existingPkgJson = this.fs.readJSON(this.destinationPath('package.json'), {});
    const newPkgJson = extend({
      name: this.answers.appName,
      version: '0.1.0',
      description: this.answers.appDescription,
      author: {
        name: this.answers.authorName,
        email: this.answers.authorEmail
      },
      keywords: ["delta-sharing"],
      engines: {
        npm: '>= 10.0.0'
      }
    }, existingPkgJson);

    // Extend or create package.json file in destination path
    this.log("Writing new `package.json` file to path.");
    this.log(newPkgJson);
    this.fs.extendJSON(this.destinationPath('package.json'), newPkgJson);

  }

  // Placeholder method for installing depepndencies from NPM
  installing() {
    this.log("Installing dependencies...");
    // Deprecated. Yeoman will automatically call this once during the queue
    // this.npmInstall();
  }
}
