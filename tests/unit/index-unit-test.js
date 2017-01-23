'use strict';

var expect = require('chai').expect;
var mockery = require('mockery');
var sinon = require('sinon');

describe('Index unit tests', function () {
    var subject;
    var setIdentityPoolRolesStub = sinon.stub();
    var event;

    before(function () {
        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        var awsSdkStub = {
            CognitoIdentity: function () {
                this.setIdentityPoolRoles = setIdentityPoolRolesStub;
            }
        };

        mockery.registerMock('aws-sdk', awsSdkStub);
        subject = require('../../src/index');
    });
    beforeEach(function () {
        setIdentityPoolRolesStub.reset().resetBehavior();
        setIdentityPoolRolesStub.yields();
        event = {
            ResourceProperties: {
                IdentityPoolId: true,
                Roles: { authenticated: '' }
            }
        };
    });
    after(function () {
        mockery.deregisterAll();
        mockery.disable();
    });

    describe('validate', function () {
        it('should succeed', function (done) {
            subject.validate(event);
            done();
        });
        it('should fail if IdentityPoolId is not set', function (done) {
            delete event.ResourceProperties.IdentityPoolId;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property IdentityPoolId/);
            done();
        });
        it('should fail if IdentityPoolName is not set', function (done) {
            delete event.ResourceProperties.Roles;
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Roles/);
            done();
        });
        it('should fail if IdentityPoolName is not set', function (done) {
            event.ResourceProperties.Roles = {};
            function fn () {
                subject.validate(event);
            }
            expect(fn).to.throw(/Missing required property Roles. Must have at least one key./);
            done();
        });
    });

    describe('create', function () {
        it('should succeed', function (done) {
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal(null);
                expect(setIdentityPoolRolesStub.calledOnce).to.equal(true);
                expect(response.physicalResourceId).not.to.equal(undefined);
                done();
            });
        });
        it('should fail due to createIdentityPoolError error', function (done) {
            setIdentityPoolRolesStub.yields('createIdentityPoolError');
            subject.create(event, {}, function (error, response) {
                expect(error).to.equal('createIdentityPoolError');
                expect(setIdentityPoolRolesStub.calledOnce).to.equal(true);
                expect(response).to.equal(undefined);
                done();
            });
        });
    });

    describe('update', function () {
        it('should succeed', function (done) {
            event.ResourceProperties.RoleMappings = [{}]; // Coverage
            subject.update(event, {}, function (error) {
                expect(error).to.equal(null);
                expect(setIdentityPoolRolesStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to setIdentityPoolRolesError error', function (done) {
            setIdentityPoolRolesStub.yields('setIdentityPoolRolesError');
            subject.update(event, {}, function (error) {
                expect(error).to.equal('setIdentityPoolRolesError');
                expect(setIdentityPoolRolesStub.calledOnce).to.equal(true);
                done();
            });
        });
    });

    describe('delete', function () {
        it('should succeed', function (done) {
            event.PhysicalResourceId = 'eu-west-1:bef2c0b3-f3ce-4de0-aec1-8765trfvbh_1234567890';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(null);
                setIdentityPoolRolesStub.calledWith({
                    IdentityPoolId: 'IdentityPoolId',
                    Roles: {},
                    RoleMappings: {}
                });
                expect(setIdentityPoolRolesStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should fail due to setIdentityPoolRolesError error', function (done) {
            setIdentityPoolRolesStub.yields('setIdentityPoolRolesError');
            event.PhysicalResourceId = 'eu-west-1:bef2c0b3-f3ce-4de0-aec1-8765trfvbh_1234567890';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal('setIdentityPoolRolesError');
                expect(setIdentityPoolRolesStub.calledOnce).to.equal(true);
                done();
            });
        });
        it('should succeed when calling delete with invalid id', function (done) {
            event.PhysicalResourceId = 'InvalidId';
            subject.delete(event, {}, function (error) {
                expect(error).to.equal(null);
                expect(setIdentityPoolRolesStub.called).to.equal(false);
                done();
            });
        });
    });
});
