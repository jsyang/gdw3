module.exports = {
"build": {
      "options":{
        "uglify":true,
        "cssmin":true
      },
      "files" : [{
        "expand": true,
        "cwd":"build",
        "src":["*.html"],
        "dest":"build"
      }]
    }
};
