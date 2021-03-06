const { Case } = require('../../entities/cases/Case');

/**
 * generateStandingPretrialNoticeInteractor
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docketNumber for the case
 * @param {string} providers.trialSessionId the id for the trial session
 * @returns {Uint8Array} notice of trial session pdf
 */
exports.generateStandingPretrialNoticeInteractor = async ({
  applicationContext,
  docketNumber,
  trialSessionId,
}) => {
  const trialSession = await applicationContext
    .getPersistenceGateway()
    .getTrialSessionById({
      applicationContext,
      trialSessionId,
    });

  const caseDetail = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const {
    address1,
    address2,
    city,
    courthouseName,
    judge,
    postalCode,
    startDate,
    startTime,
    state,
  } = trialSession;

  const { caseCaption, docketNumberSuffix, respondents } = caseDetail;

  const contentHtml = await applicationContext
    .getTemplateGenerators()
    .generateStandingPretrialNoticeTemplate({
      applicationContext,
      content: {
        caption: Case.getCaseCaptionNames(caseCaption),
        docketNumberWithSuffix: docketNumber + (docketNumberSuffix || ''),
        trialInfo: {
          address1,
          address2,
          city,
          courthouseName,
          judge,
          postalCode,
          respondents,
          startDate,
          startTime,
          state,
        },
      },
    });

  return await applicationContext.getUseCases().generatePdfFromHtmlInteractor({
    applicationContext,
    contentHtml,
    headerHtml:
      '<div style="text-align:center;"><span class="pageNumber"></span></div>',
    overwriteHeader: true,
  });
};
