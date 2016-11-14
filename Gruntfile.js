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
      pdflatex: {
        command: 'pdflatex paper && bibtex paper && pdflatex paper && pdflatex paper'
      },
      clean: {
        command: 'rm *.aux *.bbl *.blg *.idx *.log *.toc *.lot *.lof *.loq'
      }
    },

    watch: {
      monograph: {
        files: [
          '**/*.tex',
          '*.tex',
          '*.cls',
          '*.bib'
        ],
        tasks: ['pdflatex']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('pdflatex', ['shell:pdflatex', 'shell:clean']);

  grunt.registerTask('default', ['watch']);

};
