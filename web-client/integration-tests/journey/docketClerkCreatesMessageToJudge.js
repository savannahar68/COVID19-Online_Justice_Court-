export const docketClerkCreatesMessageToJudge = (test, message) => {
  return it('Docket clerk sends message to judgeSavan', async () => {
    const workItem = test.petitionerNewCases[0].documents[3].workItems[0];
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.petitionerNewCases[0].docketNumber,
      documentId: test.petitionerNewCases[0].documents[3].documentId,
    });

    // judgeSavan
    const assigneeId = 'dabbad00-18d0-43ec-bafb-654e83405416';

    test.setState('form', {
      [workItem.workItemId]: {
        assigneeId: assigneeId,
        forwardMessage: message,
        section: 'SavansChambers',
      },
    });

    await test.runSequence('submitForwardSequence', {
      workItemId: workItem.workItemId,
    });

    const caseDetail = test.getState('caseDetail');
    let updatedWorkItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === workItem.workItemId) {
          updatedWorkItem = item;
        }
      }),
    );

    expect(updatedWorkItem.assigneeId).toEqual(assigneeId);
  });
};
