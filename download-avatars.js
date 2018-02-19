var request = require("request");
var token = require("./secrets")

console.log('Welcome to the GitHub Avatar Downloader')
function getRepoContributors(repoOwner, repoName, cb) {
//address and acess  
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

//what we're giving the getRepoContributors function
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  result = JSON.parse(result)
  //console.log(result)
  for(let obj of result){
    console.log('Avatar url: ' + obj.avatar_url);
  }
  
});