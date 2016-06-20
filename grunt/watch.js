module.exports = {
  options : { 
    livereload : false, 
    debounceDelay : 500 
  },
  dev : {
    files : [
      'src/**/*',
      'index.html',
      'gfx/**/*',
      'sfx/**/*'
    ],
    tasks : [
      'build'
    ]
  }
}
