const { Case } = require('../../entities/cases/Case');
const { forwardWorkItemInteractor } = require('./forwardWorkItemInteractor');
const { MOCK_CASE } = require('../../../../src/test/mockCase');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('forwardWorkItemInteractor', () => {
  let applicationContext;

  let mockWorkItem = {
    caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    createdAt: '',
    docketNumber: '101-18',
    docketNumberSuffix: 'S',
    document: {
      sentBy: 'petitioner',
    },
    isQC: true,
    messages: [],
    sentBy: 'docketclerk',
    workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
  };

  it('updates the case and work item with the latest info', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        section: 'petitions',
        userId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      }),
      getPersistenceGateway: () => ({
        deleteWorkItemFromInbox: () => null,
        getCaseByCaseId: () => ({
          ...MOCK_CASE,
          documents: [
            {
              createdAt: '2018-11-21T20:49:28.192Z',
              docketNumber: '101-18',
              documentId: 'def81f4d-1e47-423a-8caf-6d2fdc3d3859',
              documentType: 'Proposed Stipulated Decision',
              processingStatus: 'pending',
              userId: 'petitioner',
              workItems: [
                {
                  assigneeId: null,
                  assigneeName: null,
                  caseId: 'd3d92ca6-d9b3-4bd6-8328-e94a9fc36f88',
                  caseStatus: Case.STATUS_TYPES.new,
                  createdAt: '2019-07-12T17:09:41.027Z',
                  docketNumber: '106-19',
                  docketNumberSuffix: null,
                  document: {
                    createdAt: '2019-07-12T17:09:41.026Z',
                    documentId: '5bd2f4eb-e08a-41e4-8d18-13b9ffd4514c',
                    documentType: 'Petition',
                    filedBy: 'ABC Test',
                    processingStatus: 'pending',
                    receivedAt: '2019-07-12T17:09:41.026Z',
                    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                    workItems: [],
                  },
                  gsi1pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  isInitializeCase: true,
                  isQC: true,
                  messages: [
                    {
                      createdAt: '2019-07-12T17:09:41.027Z',
                      from: 'Test Petitioner',
                      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                      message:
                        'Petition filed by ABC Test is ready for review.',
                      messageId: '818bb44d-1512-4a82-b524-a179ed5f7589',
                    },
                  ],
                  pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  section: 'petitions',
                  sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  sk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  updatedAt: '2019-07-12T17:09:41.027Z',
                  workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                },
                {
                  assigneeId: null,
                  assigneeName: null,
                  caseId: 'd3d92ca6-d9b3-4bd6-8328-e94a9fc36f88',
                  caseStatus: Case.STATUS_TYPES.new,
                  createdAt: '2019-07-12T17:09:41.027Z',
                  docketNumber: '106-19',
                  docketNumberSuffix: null,
                  document: {
                    createdAt: '2019-07-12T17:09:41.026Z',
                    documentId: '5bd2f4eb-e08a-41e4-8d18-13b9ffd4514c',
                    documentType: 'Petition',
                    filedBy: 'ABC Test',
                    processingStatus: 'pending',
                    receivedAt: '2019-07-12T17:09:41.026Z',
                    userId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                    workItems: [],
                  },
                  gsi1pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  isInitializeCase: true,
                  isQC: true,
                  messages: [
                    {
                      createdAt: '2019-07-12T17:09:41.027Z',
                      from: 'Test Petitioner',
                      fromUserId: '7805d1ab-18d0-43ec-bafb-654e83405416',
                      message:
                        'Petition filed by ABC Test is ready for review.',
                      messageId: '818bb44d-1512-4a82-b524-a179ed5f7589',
                    },
                  ],
                  pk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  section: 'petitions',
                  sentBy: '7805d1ab-18d0-43ec-bafb-654e83405416',
                  sk: 'workitem-c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  updatedAt: '2019-07-12T17:09:41.027Z',
                  workItemId: 'a54ba5a9-b37b-479d-9201-067ec6e335bb',
                },
              ],
            },
          ],
        }),
        getUserById: ({ userId }) => MOCK_USERS[userId],
        getWorkItemById: async () => mockWorkItem,
        putWorkItemInOutbox: () => null,
        saveWorkItemForPaper: () => null,
        updateCase: () => null,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    const workItem = await forwardWorkItemInteractor({
      applicationContext,
      assigneeId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      message: 'success',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(workItem).toMatchObject({
      assigneeId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
      assigneeName: 'Docketclerk',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseStatus: undefined,
      caseTitle: undefined,
      completedAt: undefined,
      completedBy: undefined,
      completedByUserId: undefined,
      completedMessage: undefined,
      docketNumber: '101-18',
      docketNumberSuffix: 'S',
      document: {
        sentBy: 'petitioner',
      },
      isInitializeCase: undefined,
      isQC: false,
      isRead: undefined,
      messages: [
        {
          from: 'Petitionsclerk',
          fromUserId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
          message: 'success',
          to: 'Docketclerk',
          toUserId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
        },
      ],
      section: 'docket',
      sentBy: 'Petitionsclerk',
      sentBySection: 'petitions',
      sentByUserId: 'c7d90c05-f6cd-442c-a168-202db587f16f',
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
  });

  it('throws an error when an unauthorized user tries to access the use case', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => ({
        name: 'Tax Payer',
        role: User.ROLES.petitioner,
        userId: 'd7d90c05-f6cd-442c-a168-202db587f16f',
      }),
      getPersistenceGateway: () => ({
        getUserById: ({ userId }) => MOCK_USERS[userId],
        getWorkItemById: async () => mockWorkItem,
      }),
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    let error;
    try {
      await forwardWorkItemInteractor({
        applicationContext,
        assigneeId: 'a7d90c05-f6cd-442c-a168-202db587f16f',
        message: 'success',
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
    } catch (e) {
      error = e;
    }
    expect(error).toBeDefined();
  });
});
