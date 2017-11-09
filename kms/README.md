# KMS Stack
Creates a KMS Key to use when encrypting your secret credentials.

## Create Stack
- First update [_cim.yml](_cim.yml) and add the IAM users you wish to have access to encrypt and decrypt.  Keep the `root` user.  Make sure you use your AWS account ID.
- Create the stack: `cim stack-up`.
- Record the KMS Key ID in the stack output.

## Encrypt Secrets
- Install https://github.com/ddffx/kms-cli and setup your AWS environment vars.
- Encrypt each string as outlined below.
- Add the encrypted strings to the [app/_cim.yml](../app/_cim.yml).  The format is `${kms.decrypt(<encreted string>)}`


### How to Encrypt
Create a file called `encrypt.json`
```
{
  "keyId" : "<your kms key id>",
  "plainText": "<your client id>",
  "awsRegion": "<aws region>",
  "awsProfile": "<aws profile"
}
```
Use this command to perform the encryption : `kms-cli encrypt --file encrypt.json`