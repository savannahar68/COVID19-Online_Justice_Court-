const { query } = require('../../dynamodbClientService');

exports.getInboxMessagesForUser = async ({ applicationContext, userId }) => {
  const workItems = await query({
    ExpressionAttributeNames: {
      '#pk': 'pk',
      '#sk': 'sk',
    },
    ExpressionAttributeValues: {
      ':pk': `user-${userId}`,
      ':prefix': 'workitem',
    },
    KeyConditionExpression: '#pk = :pk and begins_with(#sk, :prefix)',
    applicationContext,
  });
  return workItems.filter(
    workItem =>
      !workItem.isQC && !workItem.completedAt && workItem.assigneeId === userId,
  );
};
