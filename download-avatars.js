var request = require("request");
var token = require("./secrets");
var fs = require('fs');
var repoOwner = process.argv.slice(2 , 3);
var repoName = process.argv.slice(3 , 4);

//terminates the program if the user didn't give a second command line argument
if(!repoName[0]){
  throw 'You need to submit both a repo owner and repo name!';
};

//holds the body and header of the request
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
     'User-Agent': 'request',
     'Authorization': 'token' + token.GITHUB_TOKEN
    };
  };
//requests the webpage with the proper authentication with the callback function inside receiving info
  request(options, function(err, res, body) {
    cb(err, body);
  });
};

//downloads the avatar images and stores them in a file base on their login name, using the URL and names found by getRepoContributers, 
function downloadImageByURL(url, filePath) {
  request.get(url)
    .on('error', function (err){
      throw err;
    })
    .pipe(fs.createWriteStream(filePath));
};

//initiates the program and provides a callback and part of the URL filepath
getRepoContributors(repoOwner, repoName, function(err, result) {
  console.log("Errors:", err);
//converts from string to Object using JSON
  result = JSON.parse(result);
//loops through objects in api array pulling image url and login name and passes them to downloadImageUrl function
  for(let obj of result){
    downloadImageByURL( obj.avatar_url, `./avatars/${obj.login}.jpg`);
  };
});


