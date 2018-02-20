require('dotenv').config()
var mkdirp = require('mkdirp');
var request = require("request");
var fs = require('fs');
var repoOwner = process.argv.slice(2 , 3);
var repoName = process.argv.slice(3 , 4);

//terminates the program if the user didn't give a second command line argument
if(!repoName[0]){
  console.log('You need to submit both a repo owner and repo name!');
  process.exit();
};
if(!process.env.GITHUB_TOKEN){
  console.log('.env file is missing')
  process.exit()
}

//holds the body and header of the request
function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
     'User-Agent': 'request',
     'Authorization': 'token' + process.env.GITHUB_TOKEN
    }
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
getRepoContributors(repoOwner, repoName, function(err, body) {
  result = JSON.parse(body);
  if(result.message === 'Not Found'){
    console.log('The provided owner/repo does not exist');
    process.exit();
  };
//creates the directory avatars if one doesn't already exists
  mkdirp('./avatars');
//loops through objects in api the array pulling image url and login name and passes them to downloadImageUrl function  
  for(let obj of result){
    downloadImageByURL( obj.avatar_url, `./avatars/${obj.login}.jpg`);
  };
});


