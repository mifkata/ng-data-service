module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        karma: {
            unit: {
                configFile: 'karma.config.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-karma');
};
