var gulp = require("gulp");
var argv = require("yargs").argv;

// Get the environment variables, or use defaults
var bump = argv.bump || "prerelease";
var branch = argv.branch || "master";

// Set the options on the component template
require("@ctek/gulp-tasks/templates/component").opts.config = {
  bump: bump,
  branch: branch,
  bowerFiles: [
    "!bower_components",
    "!bower_components/**/*",
    "!node_modules",
    "!node_modules/**/*",
    "!demo",
    "!demo/**/*",
    "!release",
    "!release/**/*",
    "!src",
    "!src/**/*",
    "!test",
    "!test/**/*",
    "!typings",
    "!typings/**/*",
    "!package.json",
    "!gulpfile.js",
    "!Jenkinsfile",
    "!tsconfig*",
    "!tslint*",
    "!typings*",
    "!index.html",
    "**/*"
  ]
};

gulp.task("build-dev", ["component:build-dev"]);
gulp.task("build-prod", ["component:build-prod"]);
gulp.task("release-dev", ["component:release-dev"]);
gulp.task("release-prod", ["component:release-prod"]);
