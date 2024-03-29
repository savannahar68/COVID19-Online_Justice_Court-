import { Case } from '../../../shared/src/business/entities/cases/Case';

export const docketClerkUpdatesCaseStatusToReadyForTrial = test => {
  return it('Docket clerk updates case status to General Docket - At Issue (Ready for Trial)', async () => {
    test.setState('caseDetail', {});

    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const currentStatus = test.getState('caseDetail.status');

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('showModal')).toEqual('UpdateCaseModalDialog');

    expect(test.getState('modal.caseStatus')).toEqual(currentStatus);

    await test.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: Case.STATUS_TYPES.generalDocket,
    });

    await test.runSequence('clearModalSequence');

    expect(test.getState('caseDetail.status')).toEqual(currentStatus);
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('modal.caseStatus')).toBeUndefined();

    await test.runSequence('openUpdateCaseModalSequence');

    expect(test.getState('showModal')).toEqual('UpdateCaseModalDialog');
    expect(test.getState('modal.caseStatus')).toEqual(currentStatus);

    await test.runSequence('updateModalValueSequence', {
      key: 'caseStatus',
      value: Case.STATUS_TYPES.generalDocketReadyForTrial,
    });

    await test.runSequence('submitUpdateCaseModalSequence');

    expect(test.getState('caseDetail.status')).toEqual(
      Case.STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(test.getState('caseDetail.associatedJudge')).toEqual(
      Case.CHIEF_JUDGE,
    );
    expect(test.getState('showModal')).toEqual('');
    expect(test.getState('modal.caseStatus')).toBeUndefined();
  });
};
