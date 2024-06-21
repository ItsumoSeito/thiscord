import aws from 'aws-sdk';

const cognito = new aws.CognitoIdentityServiceProvider();

export const handler = async (event: any) => {
  const params = {
    GroupName: 'Users',
    UserPoolId: event.userPoolId,
    Username: event.userName,
  };

  try {
    await cognito.adminAddUserToGroup(params).promise();
    return event;
  } catch (err: any) {
    throw new Error(`Error adding user to group: ${err.message}`);
  }
};
