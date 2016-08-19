/*jslint node: true*/

module.exports = function (grunt) {

  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project configuration.
  grunt.initConfig({
    // Meta data
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      bowerInstall: {
        command: 'bower install'
      }
    },

    copy: {
      ui: {
        files: [
          {
            expand: true,
            cwd: 'bower_components/jquery/dist/',
            src: ['jquery.slim.{js,js.map,min.js}'],
            dest: 'ui/js/'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/css/',
            src: ['bootstrap.{css,css.map,min.css}'],
            dest: 'ui/css/'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/js/',
            src: ['bootstrap*'],
            dest: 'ui/js/'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap/dist/fonts/',
            src: ['*'],
            dest: 'ui/fonts'
          },
          {
            expand: true,
            cwd: 'bower_components/bootstrap-sass/assets/stylesheets/',
            src: ['**/*.scss'],
            dest: 'ui/scss/twbs/'
          }
        ]
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('bower', ['shell', 'copy']);
  grunt.registerTask('install', ['bower']);

  grunt.registerTask('default', ['bower']);

};
