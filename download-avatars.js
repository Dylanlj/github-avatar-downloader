
var request = require("request");
var token = require("./secrets");
var fs = require('fs');
var repoOwner = process.argv.slice(2 , 3);
var repoName = process.argv.slice(3 , 4);

if(!repoName[0]){
throw 'You need to submit both a repo owner and repo name!'
}


  function getRepoContributors(repoOwner, repoName, cb) {
    var options = {
      url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
      headers: {
       'User-Agent': 'request',
       'Authorization': 'token' + token.GITHUB_TOKEN
      }
    }

    request(options, function(err, res, body) {
      cb(err, body);
    })
  }

  function downloadImageByURL(url, filePath) {
    request.get(url)
      .on('error', function (err){
        throw err;
      })
      .pipe(fs.createWriteStream(filePath))
  }

  getRepoContributors(repoOwner, repoName, function(err, result) {
    console.log("Errors:", err);
    result = JSON.parse(result)
    for(let obj of result){
      downloadImageByURL( obj.avatar_url, `./avatars/${obj.login}.jpg`)
    }
  });


