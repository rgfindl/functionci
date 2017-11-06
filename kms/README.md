# KMS Key
Create a KMS Key to use when encrypting your secret Slack credentials.

## Create Stack
- First update `_cim.yml` and add the IAM users you wish to have access to encrypt and decrypt.  Keep the `root` user.  Make sure you use your AWS account ID.
- Create the stack: `cim stack-up`
- Record the KMS Key ID in the stack output.

## Encrypt Secrets
- Install https://github.com/ddffx/kms-cli and setup your AWS environment vars
- Update the json files within this folder
- Encrypt using these commands: 
  - `kms-cli encrypt --file slack-client-id.json`
  - `kms-cli encrypt --file slack-verification-token.json`
  - `kms-cli encrypt --file slack-webhook.json`
  - `kms-cli encrypt --file slack-github-token.json`
- Add the encrypted strings to the `app/_cim.yml`.  The format is `${kms.decrypt(<encreted string>)}`
