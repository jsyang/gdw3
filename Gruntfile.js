var config = {

    data : {
        // Re-usable filesystem path variables
        paths : {
            src   : 'src',
            build : 'build'
        }

        // secrets.json is ignored in git because it contains sensitive data
        // See the README for configuration settings
        // secrets: grunt.file.readJSON('secrets.json')
    }
};

module.exports = function (grunt) {
    require('load-grunt-config')(grunt, config);
}
