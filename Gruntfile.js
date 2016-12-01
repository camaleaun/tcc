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
      tex: {
        command: 'pdflatex paper && bibtex paper && pdflatex paper && pdflatex paper'
      },
      clean: {
        command: 'rm *.aux *.bbl *.blg *.idx *.log *.toc *.lot *.lof *.loq'
      },
      pdf: {
        command: 'mv paper.pdf ../ && git checkout gh-pages && rm paper.pdf && mv ../paper.pdf ./ && git add paper.pdf && git commit -m "New papper pdf" && git push && git checkout paper'
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
        tasks: ['tex']
      }
    }

  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('tex', ['shell:tex', 'shell:clean']);
  grunt.registerTask('clean', ['shell:clean']);
  grunt.registerTask('pdf', ['shell:pdf']);

  grunt.registerTask('default', ['watch']);

};
