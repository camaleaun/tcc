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
    },

    sass: {
      ui: {
        options: {
          sourcemap: 'none',
          style: 'compressed'
        },
        files: {
          'ui/css/style.css': 'ui/scss/style.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ]
      },
      style: {
        src: [
          'ui/css/style.css'
        ]
      }
    },

    uglify: {
      ui: {
        src: 'ui/js/script.js',
        dest: 'ui/js/script.min.js'
      }
    },

    watch: {
      style: {
        files: 'ui/scss/*.scss',
        tasks: ['style']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('style', ['sass', 'autoprefixer']);

  grunt.registerTask('bower', ['shell', 'copy']);
  grunt.registerTask('install', ['bower', 'uglify']);

  grunt.registerTask('default', ['watch']);

};
