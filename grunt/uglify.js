module.exports = {
    build : {
        files : [{
            expand : true,
            cwd    : 'src/js',
            src    : '*.js',
            dest   : 'build'
        }]
    }
};