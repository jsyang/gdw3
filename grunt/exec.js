var REPO = '../gdw3-deploy';


 var exports = {
    'copyAssets' : [
        'rm -rf build',
        'mkdir build',
        'cp index.html build',
        'rsync -av --exclude="gfx/PDNs" gfx build',
        'cp -R sfx build'
    ],
    'deploy'     : [
        'cp -Rf build/ ' + REPO,
        'cd ' + REPO,
        'git add .',
        'git commit -am "update GH pages"',
        'git push'
    ]
};

Object.keys(exports)
    .forEach(function toString(key){
       if(exports[key] instanceof Array){
           exports[key] = exports[key].join(' ; ');
       }
    });

module.exports = exports;