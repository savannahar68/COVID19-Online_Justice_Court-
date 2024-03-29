import { state } from 'cerebral';

/**
 * changes the path based on if the practitioner is already in the case
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for accessing local storage
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or failure)
 * @returns {string} the scanner source name from local storage
 */
export const isPractitionerInCaseAction = async ({ get, path }) => {
  const caseDetail = get(state.caseDetail);
  const practitioners = get(state.modal.practitionerMatches);

  if (
    practitioners.length === 1 &&
    caseDetail.practitioners.find(
      practitioner => practitioner.userId === practitioners[0].userId,
    )
  ) {
    return path.yes();
  } else {
    return path.no();
  }
};
