/**
 * delete a user's case note
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @returns {object} the details of a caseNote
 */
export const deleteUserCaseNoteAction = async ({
  applicationContext,
  props,
}) => {
  const { caseId, trialSessionId } = props;

  await applicationContext.getUseCases().deleteUserCaseNoteInteractor({
    applicationContext,
    caseId,
  });

  return {
    userNote: {
      caseId,
      trialSessionId,
    },
  };
};
