/*jshint esversion: 6 */
var userAgent = "slack-api";
var rp = require('request-promise-native');

function postAPIData(authorizationToken, url) {
    let options = {
        method: "POST",
        uri: url,
        headers: {
            'User-Agent': userAgent,
        }
    };
    return rp(options);
}

function postWebhookData(user,data){
  var options = {
    method: "POST",
    uri: "https://hooks.slack.com/services/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",
    form: '{ "channel": '+'"@'+user+'"'+',"text": '+'"'+data+'"'+'}',
    headers: {
        'User-Agent': userAgent,
    }
  };
  return rp(options);
}


module.exports = (authToken) => {
    return {

      postInviteTeam: function(email) {

          var url = `https://slack.com/api/users.admin.invite?token=${authToken}&email=${email}`;
          return postAPIData(authToken,url);
      },
      postWebhook: function(user, data)
      {
        return postWebhookData(user, data);
      }

    };
};
