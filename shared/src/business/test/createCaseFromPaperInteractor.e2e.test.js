const sinon = require('sinon');
const {
  createCaseFromPaperInteractor,
} = require('../useCases/createCaseFromPaperInteractor');
const {
  createTestApplicationContext,
} = require('./createTestApplicationContext');
const {
  getDocumentQCInboxForSectionInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForSectionInteractor');
const {
  getDocumentQCInboxForUserInteractor,
} = require('../useCases/workitems/getDocumentQCInboxForUserInteractor');
const { Case } = require('../entities/cases/Case');
const { getCaseInteractor } = require('../useCases/getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');

const RECEIVED_DATE = '2019-02-01T22:54:06.000Z';

describe('createCaseFromPaperInteractor integration test', () => {
  let applicationContext;

  beforeEach(() => {
    sinon.stub(window.Date.prototype, 'toISOString').returns(RECEIVED_DATE);
    applicationContext = createTestApplicationContext({
      user: {
        name: 'Alex Petitionsclerk',
        role: User.ROLES.petitionsClerk,
        userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
      },
    });
  });

  afterEach(() => {
    window.Date.prototype.toISOString.restore();
  });

  it('should persist the paper case into the database', async () => {
    MOCK_CASE.contactPrimary = {
      address1: '123 Abc Ln',
      city: 'something',
      countryType: 'domestic',
      name: 'Bob Jones',
      phone: '1234567890',
      postalCode: '12345',
      state: 'CA',
    };

    const { caseId } = await createCaseFromPaperInteractor({
      applicationContext,
      petitionFileId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
      petitionMetadata: {
        ...MOCK_CASE,
        caseCaption: 'Bob Jones2, Petitioner',
        createdAt: RECEIVED_DATE,
        mailingDate: 'testing',
        petitionFile: { name: 'something' },
        petitionFileSize: 1,
        receivedAt: RECEIVED_DATE,
        requestForPlaceOfTrialFile: new File(
          [],
          'requestForPlaceOfTrialFile.pdf',
        ),
        requestForPlaceOfTrialFileSize: 1,
        stinFile: { name: 'something else' },
        stinFileSize: 1,
      },
      stinFileId: '72de0fac-f63c-464f-ac71-0f54fd248484',
    });

    const createdCase = await getCaseInteractor({
      applicationContext,
      caseId,
    });

    expect(createdCase).toMatchObject({
      caseCaption: 'Bob Jones2, Petitioner',
      caseTitle:
        'Bob Jones2, Petitioner v. Commissioner of Internal Revenue, Respondent',
      createdAt: RECEIVED_DATE,
      docketNumber: '101-19',
      docketNumberSuffix: null,
      docketRecord: [
        {
          description: 'Petition',
          filedBy: 'Petr. Bob Jones',
          filingDate: RECEIVED_DATE,
        },
      ],
      documents: [
        {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Petr. Bob Jones',
          receivedAt: RECEIVED_DATE,
          workItems: [
            {
              assigneeId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
              assigneeName: 'Alex Petitionsclerk',
              caseStatus: Case.STATUS_TYPES.new,
              createdAt: RECEIVED_DATE,
              docketNumber: '101-19',
              docketNumberSuffix: null,
              document: {
                documentId: 'c7eb4dd9-2e0b-4312-ba72-3e576fd7efd8',
                documentType: 'Petition',
                filedBy: 'Petr. Bob Jones',
              },
              isInitializeCase: true,
              messages: [
                {
                  createdAt: RECEIVED_DATE,
                  from: 'Alex Petitionsclerk',
                  fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
                  message:
                    'Petition filed by Petr. Bob Jones is ready for review.',
                },
              ],
              section: 'petitions',
              sentBy: 'Alex Petitionsclerk',
              sentByUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            },
          ],
        },
        {
          createdAt: RECEIVED_DATE,
          documentType: 'Statement of Taxpayer Identification',
          eventCode: 'STIN',
          filedBy: 'Petr. Bob Jones',
          receivedAt: RECEIVED_DATE,
        },
      ],
      initialDocketNumberSuffix: '_',
      initialTitle:
        'Bob Jones2, Petitioner v. Commissioner of Internal Revenue, Respondent',
      noticeOfAttachments: false,
      orderForAmendedPetition: false,
      orderForAmendedPetitionAndFilingFee: false,
      orderForFilingFee: false,
      orderForOds: false,
      orderForRatification: false,
      orderToShowCause: false,
      receivedAt: RECEIVED_DATE,
      status: Case.STATUS_TYPES.new,
      userId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
    });

    const petitionsclerkInbox = await getDocumentQCInboxForUserInteractor({
      applicationContext,
      userId: applicationContext.getCurrentUser().userId,
    });

    expect(petitionsclerkInbox).toMatchObject([
      {
        assigneeName: 'Alex Petitionsclerk',
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: null,
        document: {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Petr. Bob Jones is ready for review.',
          },
        ],
        section: 'petitions',
        sentBy: 'Alex Petitionsclerk',
      },
    ]);

    const petitionsSectionInbox = await getDocumentQCInboxForSectionInteractor({
      applicationContext,
      section: 'petitions',
    });

    expect(petitionsSectionInbox).toMatchObject([
      {
        assigneeName: 'Alex Petitionsclerk',
        caseStatus: Case.STATUS_TYPES.new,
        docketNumber: '101-19',
        docketNumberSuffix: null,
        document: {
          createdAt: RECEIVED_DATE,
          documentType: 'Petition',
          eventCode: 'P',
        },
        isInitializeCase: true,
        messages: [
          {
            from: 'Alex Petitionsclerk',
            fromUserId: 'a805d1ab-18d0-43ec-bafb-654e83405416',
            message: 'Petition filed by Petr. Bob Jones is ready for review.',
          },
        ],
        section: 'petitions',
        sentBy: 'Alex Petitionsclerk',
      },
    ]);
  });
});
