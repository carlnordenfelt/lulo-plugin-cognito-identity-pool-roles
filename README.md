# lulo Cognito Identity Pool Roles

lulo Cognito Identity Pool Roles sets Roles for Amazon Cognito Identify Pools.

lulo Cognito Identity Pool Roles is a [lulo](https://github.com/carlnordenfelt/lulo) plugin

# Installation
```
npm install lulo-plugin-cognito-identity-pool-roles --save
```

## Usage
### Properties
* IdentityPoolId: Id of the Identity Pool. Required.
* Roles: Object map with authenticated/unauthenticated role arns. Required.
* For further properties, see the [AWS SDK Documentation for CognitoIdentity::createIdentityPool](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentity.html#createIdentityPool-property)

**Note:** Since the `RoleMappings` keys can be complex and will sometimes be built with `Fn::Join` which can't serve as JSON keys
you must provide RoleMappings as an `Array` instead of an object and add the extra property `Key` with the key value.
The Custom Resource will transform the array to a proper RoleMappings object for you.

### Return Values

None

### Required IAM Permissions
The Custom Resource Lambda requires the following permissions for this plugin to work:
```
{
    "Effect": "Allow",
    "Action": [
        "cognito-identity:SetIdentityPoolRoles"
    ],
    "Resource": "*"
}
```

## License
[The MIT License (MIT)](/LICENSE)

## Change Log
[Change Log](/CHANGELOG.md)
