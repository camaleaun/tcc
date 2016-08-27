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
      },
      cloneAce: {
        command: 'git clone https://github.com/ajaxorg/ace.git editor/ace/.ace.tmp && mv editor/ace/.ace.tmp/* editor/ace/ && rm editor/ace/.ace.tmp/.gitignore && mv editor/ace/.ace.tmp/.* editor/ace/ && rm -d editor/ace/.ace.tmp/'
      },
      clearAce: {
        command: 'rm -r editor/ace/lib/ace/ext/* editor/ace/lib/ace/snippets/* editor/ace/lib/ace/theme/'
      },
      startAceNpm: {
        command: 'npm install --prefix editor/ace'
      },
      copyUalAce: {
        command: 'cp -r editor/ace/mode/ editor/ace/lib/ace/ && cp -r editor/ace/theme/ editor/ace/lib/ace/'
      },
      clearAceMode: {
        command: "find editor/ace/lib/ace/mode/. ! -name 'text*' -exec rm -r -f {} + || rm editor/ace/lib/ace/mode/texti*"
      },
      buildAce: {
        command: 'node editor/ace/Makefile.dryice.js -m -nc --target editor/ace/build'
      },
      removeAce: {
        command: 'rm -r editor/ace/a* editor/ace/b* editor/ace/d* editor/ace/e* editor/ace/l* editor/ace/to*'
      }
    },

    concat: {
      aceUal: {
        files: {
          'editor/js/aceual.js': ['editor/ace/build/src-min-noconflict/ace.js', 'editor/ace/build/src-min-noconflict/mode-ual.js', 'editor/ace/build/src-min-noconflict/theme-ual.js']
        },
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
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('style', ['sass', 'autoprefixer']);

  grunt.registerTask('bower', ['shell', 'copy']);
  grunt.registerTask('install', ['bower', 'uglify']);

  grunt.registerTask('default', ['watch']);

};
