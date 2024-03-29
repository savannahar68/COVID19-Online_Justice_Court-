import { fakeFile, loginAs, setupTest } from './helpers';
import { formattedCaseDetail as formattedCaseDetailComputed } from '../src/presenter/computeds/formattedCaseDetail';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../src/withAppContext';

// docketClerk
import { docketClerkAddsTranscriptDocketEntryFromOrder } from './journey/docketClerkAddsTranscriptDocketEntryFromOrder';
import { docketClerkCreatesAnOrder } from './journey/docketClerkCreatesAnOrder';
import { docketClerkServesOrder } from './journey/docketClerkServesOrder';
import { docketClerkViewsDraftOrder } from './journey/docketClerkViewsDraftOrder';
// petitioner
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';

const formattedCaseDetail = withAppContextDecorator(
  formattedCaseDetailComputed,
);

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});
test.draftOrders = [];

describe('Docket Clerk Adds Transcript to Docket Record', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 0);
  //old transcript that should be available to the user
  docketClerkAddsTranscriptDocketEntryFromOrder(test, 0, {
    day: '01',
    month: '01',
    year: '2019',
  });
  docketClerkServesOrder(test, 0);
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkViewsDraftOrder(test, 1);
  //new transcript that should NOT be available to the user
  const today = new Date();
  docketClerkAddsTranscriptDocketEntryFromOrder(test, 1, {
    day: today.getDate(),
    month: today.getMonth() + 1,
    year: today.getFullYear(),
  });
  docketClerkServesOrder(test, 1);

  loginAs(test, 'petitioner');
  it('petitioner views transcript on docket record', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });
    const formattedCase = runCompute(formattedCaseDetail, {
      state: test.getState(),
    });
    const transcriptDocuments = formattedCase.formattedDocketEntries.filter(
      document => document.eventCode === 'TRAN',
    );
    //first transcript should be available to the user
    expect(transcriptDocuments[0].showLinkToDocument).toEqual(true);
    //second transcript should NOT be available to the user
    expect(transcriptDocuments[1].showLinkToDocument).toEqual(false);
  });
});
