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
        command: 'pdflatex joseli && bibtex joseli && pdflatex joseli && pdflatex joseli'
      },
      clean: {
        command: 'rm *.aux *.bbl *.blg *.idx *.log *.toc *.lot *.lof *.loq'
      },
      pdf: {
        command: 'mv joseli.pdf ../ && git checkout gh-pages && rm joseli.pdf && mv ../joseli.pdf ./ && git add joseli.pdf && git commit -m "New joseli pdf" && git push && git checkout joseli'
      }
    },

    watch: {
      monograph: {
        files: [
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
