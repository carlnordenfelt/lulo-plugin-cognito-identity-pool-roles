'use strict';

var aws = require('aws-sdk');
var cognitoIdentity = new aws.CognitoIdentity({ apiVersion: '2014-06-30' });

var pub = {};

pub.validate = function (event) {
    if (!event.ResourceProperties.IdentityPoolId) {
        throw new Error('Missing required property IdentityPoolId');
    }
    if (!event.ResourceProperties.Roles) {
        throw new Error('Missing required property Roles');
    }
    if (Object.keys(event.ResourceProperties.Roles).length === 0) {
        throw new Error('Missing required property Roles. Must have at least one key.');
    }
};

pub.create = function (event, _context, callback) {
    var params = event.ResourceProperties;
    delete params.ServiceToken;
    if (params.RoleMappings) {
        var roleMappings = {};
        params.RoleMappings.forEach(function (roleMapping) {
            roleMappings[roleMapping.Key] = roleMapping;
            delete roleMappings[roleMapping.Key].Key;
        });
        params.RoleMappings = roleMappings;
    }
    cognitoIdentity.setIdentityPoolRoles(params, function (error, _response) {
        callback(error);
    });
};

pub.update = function (event, context, callback) {
    pub.create(event, context, callback);
};

pub.delete = function (event, context, callback) {
    event.ResourceProperties.Roles = {};
    event.ResourceProperties.RoleMappings = [{}];
    pub.create(event, context, callback);
};

module.exports = pub;
