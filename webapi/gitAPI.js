/*jshint esversion: 6 */
const rp = require('request-promise-native');
const USER_AGENT = "hapi-github-oauth-poc";
const HOOK_ENDPOINT = "http://32cf8a0e.ngrok.io/hook";

function _fetchAPIData(authorizationToken, url) {
    let options = {
        uri: url,
        headers: {
            'User-Agent': USER_AGENT,
            "Authorization": `token ${authorizationToken}`
        },
        json: true
    };

    return rp(options);
}

function _postAPIData(authorizationToken, url, data) {
    let options = {
        method: "POST",
        uri: "https://api.github.com/orgs/testarenorg/hooks",
        headers: {
            'User-Agent': USER_AGENT,
            "Authorization": `token ${authorizationToken}`
        },
        json: true,
        body: data
    };
    return rp(options);
}

module.exports = (authorizationToken) => {
    return {
    // Organizations
    getOrganizations: function() {
        const url = "https://api.github.com/user/orgs";
        return _fetchAPIData(authorizationToken, url);
    },
    getOrganization: function(organization) {
        console.log(authorizationToken);
        const url = `https://api.github.com/orgs/${organization}`;
        return _fetchAPIData(authorizationToken, url);
    },
    getOrganizationRepos: function(organization) {
        const url = `https://api.github.com/orgs/${organization}/repos`;
        return _fetchAPIData(authorizationToken, url);
    },
    getOrganizationEvents: function(organization) {
        const url = `https://api.github.com/orgs/${organization}/events`;
        return _fetchAPIData(authorizationToken, url);
    },
    organizationWebhookExists: function(organization) {
        // Return true if organization webhook already created
    },
    createOrganizationWebhook: function(organization, events) {
        events = events || ["push"];
        const url = `https://api.github.com/orgs/${organization}/hooks`;
        const data = {
            "name": "web",
            "active": true,
            "events": events,
            "config": {
                "url": "http://32cf8a0e.ngrok.io/hook",
                "content_type": "json"
            }
        };

        return _postAPIData(authorizationToken, url, data);
    },


    // Repos
    repoWebhookExists: function(repo, authorizationToken) {

    },
    createRepoWebhook: function(repo, authorizationToken) {

    }
};
};
