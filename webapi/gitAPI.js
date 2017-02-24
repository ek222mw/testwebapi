/*jshint esversion: 6 */

var useragent = "express-github-oauth";
var webhookEnd = "http://b7bab060.ngrok.io/githubwebhook";
var rp = require('request-promise-native');

function postData(authToken, url, data) {
    var options = {
        method: "POST",
        uri: "https://api.github.com/orgs/testarenorg/hooks",
        headers: {
            'User-Agent': useragent,
            "Authorization": `token ${authToken}`
        },
        json: true,
        body: data
    };
    return rp(options);
}

function fetchData(authToken, url) {
    var options = {
        uri: url,
        headers: {
            'User-Agent': useragent,
            "Authorization": `token ${authToken}`
        },
        json: true
    };
    return rp(options);
}

module.exports = (authToken) => {
    return {

    organizationWebhookExists: function(org) {
        // Does return true organization webhook already have been created
    },
    createOrganizationWebhook: function(org, events) {
        var url = `https://api.github.com/orgs/${org}/hooks`;
        events = events || ["push"];
        var webhookdata = {
            "name": "web",
            "active": true,
            "events": events,
            "config": {
                "url": "http://b7bab060.ngrok.io/githubwebhook",
                "content_type": "json"
            }
        };

        return postData(authToken, url, webhookdata);
    },
    // Orgs
    getAllOrganizations: function() {
        var url = "https://api.github.com/user/orgs";
        return fetchData(authToken, url);
    },
    getOneOrganization: function(org) {
        var url = `https://api.github.com/orgs/`+org;
        return fetchData(authToken, url);
    },
    getOneOrganizationRepos: function(org) {
        var url = `https://api.github.com/orgs/`+org+'/repos';
        return fetchData(authToken, url);
    },
    getOneOrganizationEvents: function(org) {
        var url = `https://api.github.com/orgs/`+org+'/events';
        return fetchData(authToken, url);
    },
    createRepoWebhook: function(repo, authToken) {

    },
    checkIfRepoWebhookExists: function(repo, authToken) {

    }

};
};
