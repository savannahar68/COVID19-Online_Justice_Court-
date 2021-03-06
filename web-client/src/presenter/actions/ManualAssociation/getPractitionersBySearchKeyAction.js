import { state } from 'cerebral';

/* * Gets practitioners whose name or barNumber match the searchKey
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionersBySearchKeyInteractor use case
 * @returns {object} contains the practitioners returned from the getPractitionersBySearchKeyInteractor use case
 */
export const getPractitionersBySearchKeyAction = async ({
  applicationContext,
  get,
  path,
}) => {
  const searchKey = get(state.form.practitionerSearch);

  const practitioners = await applicationContext
    .getUseCases()
    .getPractitionersBySearchKeyInteractor({ applicationContext, searchKey });

  if (practitioners.length) {
    return path.success({
      practitioners,
    });
  } else {
    return path.error({
      errors: {
        practitionerSearchError:
          'No matching counsel was found. Check your information and try again.',
      },
    });
  }
};
