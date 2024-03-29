import { Case } from '../../shared/src/business/entities/cases/Case';
import { docketClerkCreatesATrialSession } from './journey/docketClerkCreatesATrialSession';
import { docketClerkViewsTrialSessionList } from './journey/docketClerkViewsTrialSessionList';
import {
  loginAs,
  refreshElasticsearchIndex,
  setupTest,
  uploadPetition,
} from './helpers';
import petitionsClerkSetsATrialSessionsSchedule from './journey/petitionsClerkSetsATrialSessionsSchedule';

const test = setupTest();

describe('case inventory report journey', () => {
  beforeAll(() => {
    jest.setTimeout(50000);
  });

  afterAll(() => {
    test.closeSocket();
  });

  const initialCaseInventoryCounts = {};
  const createdDocketNumbers = [];
  const trialLocation = `Indianapolis, Indiana, ${Date.now()}`;

  loginAs(test, 'docketclerk');
  it('cache the initial case inventory counts', async () => {
    await test.runSequence('openCaseInventoryReportModalSequence');
    //New
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: Case.STATUS_TYPES.new,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.new = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //New, Judge Savan
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Savan',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.newSavan = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared, Judge Savan
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: Case.STATUS_TYPES.calendared,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendaredSavan = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //Calendared
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.calendared = test.getState(
      'caseInventoryReportData.totalCount',
    );
    //Judge Savan
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Savan',
    });
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    initialCaseInventoryCounts.Savan = test.getState(
      'caseInventoryReportData.totalCount',
    );
  });

  //Create a trial session and set as calendared
  loginAs(test, 'docketclerk');
  docketClerkCreatesATrialSession(test, {
    judge: {
      name: 'Judge Savan',
      userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
    },
    trialLocation,
  });
  docketClerkViewsTrialSessionList(test, { trialLocation });
  loginAs(test, 'petitionsclerk');
  petitionsClerkSetsATrialSessionsSchedule(test);

  loginAs(test, 'petitioner');
  for (let i = 0; i < 2; i++) {
    it(`create case ${i + 1}`, async () => {
      const caseDetail = await uploadPetition(test);
      createdDocketNumbers.push(caseDetail.docketNumber);
    });
  }

  loginAs(test, 'docketclerk');
  it('manually add first case to the trial session', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: createdDocketNumbers[0],
    });
    await test.runSequence('openAddToTrialModalSequence');
    await test.runSequence('updateModalValueSequence', {
      key: 'trialSessionId',
      value: test.trialSessionId,
    });
    await test.runSequence('addCaseToTrialSessionSequence');
  });

  it('get the updated case inventory counts', async () => {
    await refreshElasticsearchIndex();

    //New (+1 from initial)
    await test.runSequence('openCaseInventoryReportModalSequence');
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: Case.STATUS_TYPES.new,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    let updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.new + 1,
    );
    //New, Judge Savan (same as initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Savan',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.newSavan,
    );
    //Calendared, Judge Savan (+1 from initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: Case.STATUS_TYPES.calendared,
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendaredSavan + 1,
    );
    //Calendared (+1 from initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.calendared + 1,
    );
    //Judge Savan (+1 from initial)
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'associatedJudge',
      value: 'Savan',
    });
    await test.runSequence('updateScreenMetadataSequence', {
      key: 'status',
      value: '',
    });
    await test.runSequence('submitCaseInventoryReportModalSequence');
    updatedCaseInventoryCount = test.getState(
      'caseInventoryReportData.totalCount',
    );
    expect(updatedCaseInventoryCount).toEqual(
      initialCaseInventoryCounts.Savan + 1,
    );
  });

  it('view the printable report', async () => {
    await test.runSequence('gotoPrintableCaseInventoryReportSequence');
  });
});
