import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { set } from 'cerebral/factories';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { state } from 'cerebral';
import { updatePetitionDetailsAction } from '../actions/updatePetitionDetailsAction';
import { validatePetitionDetailsAction } from '../actions/validatePetitionDetailsAction';

export const updatePetitionDetailsSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePetitionDetailsAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      setCurrentPageAction('Interstitial'),
      updatePetitionDetailsAction,
      setCaseAction,
      set(state.caseDetailPage.showEditPetition, false),
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setAlertErrorAction,
      navigateToCaseDetailCaseInformationAction,
    ],
  },
];
