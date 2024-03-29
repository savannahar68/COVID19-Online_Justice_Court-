const client = require('../../dynamodbClientService');

exports.updateTrialSession = async ({
  applicationContext,
  trialSessionToUpdate,
}) => {
  return await client.put({
    Item: {
      gsi1pk: 'trial-session-catalog',
      pk: `trial-session-${trialSessionToUpdate.trialSessionId}`,
      sk: `trial-session-${trialSessionToUpdate.trialSessionId}`,
      ...trialSessionToUpdate,
    },
    applicationContext,
  });
};
