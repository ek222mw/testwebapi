const rp = require('request-promise-native');
var USER_AGENT = "slack-api-poc";
const HOOK_ENDPOINT = "http://32cf8a0e.ngrok.io/hook";

function postAPIData(authorizationToken, url) {
    let options = {
        method: "POST",
        uri: url,
        headers: {
            'User-Agent': USER_AGENT,
        }
    };
    return rp(options);
}


module.exports = (authorizationToken) => {
    return {

      postInviteTeam: function(email) {

          const url = `https://slack.com/api/users.admin.invite?token=${authorizationToken}&email=${email}`;
          return postAPIData(authorizationToken,url);
      }

    };
};
