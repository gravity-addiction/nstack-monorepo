config = {
  aws: {
    dbTables: {
      awsKeys: 'aws_keys',
      awsUsers: 'aws_users',
      fileInfo: 's3_file_info',
      folderInfo: 's3_folder_info',
      fileSync: 's3_file_sync',
      videoUploads: 's3_uploads',
    },

    aws_user_id: '***',
    aws_access_key_id: '***',
    aws_secret_access_key: '***',

    aws_public_key: '***',
    aws_public_secret: '***',
    aws_public_region: '***',

    // Master IAM Account
    defaultIAM: {
      signatureVersion: 'v4',
      apiVersion: '2010-05-08'
    },
    // Master S3 Account
    defaultS3: {
      signatureVersion: 'v4',
      apiVersion: '2006-03-01'
    },
    // InCognito
    cognito_region: '***',
    cognito_identity_creds: {
      IdentityPoolId: '***'
    },
    defaultCognitoIdentity: {
      apiVersion: '2014-06-30'
    },
    // URL Signing Parameters
    signingParams: {
      keypairId: '',
      privateKeyString: '-----BEGIN RSA PRIVATE KEY-----\n' +
    '***'+
    '-----END RSA PRIVATE KEY-----',
      expireTime: (new Date().getTime() + 30000)
    },
  },
  rbac: {
    definition: {
      guest: {
        can: ['video:url-sign'],
      },
      user: {
        can: ['s3:cloud-home'],
      },
    },
  },
}
