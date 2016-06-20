module.exports = {
"build": {
      "options": {
        "removeComments": true,
        "collapseWhitespace": true,
        "conservativeCollapse": true
      },
      "files" : [{
        "expand": true,
        "cwd":"build",
        "src":["*.html"],
        "dest":"build"
      }]
    }
};
