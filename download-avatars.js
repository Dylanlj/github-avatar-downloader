var request = require("request");
var token = require("./secrets")
console.log(token.GITHUB_TOKEN)
console.log('Welcome to the GitHub Avatar Downloader')

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url : "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
     'User-Agent': token.GITHUB_TOKEN
    }
  };
  

  request(options, function(err, res, body) {
    cb(err, body);
  });
}

//what we're giving the getRepoContributors function
getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
});