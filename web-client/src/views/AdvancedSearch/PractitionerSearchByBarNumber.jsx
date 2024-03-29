import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerSearchByBarNumber = connect(
  {
    advancedSearchForm: state.advancedSearchForm,
    clearAdvancedSearchFormSequence: sequences.clearAdvancedSearchFormSequence,
    updateAdvancedSearchFormValueSequence:
      sequences.updateAdvancedSearchFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({
    advancedSearchForm,
    clearAdvancedSearchFormSequence,
    submitPractitionerNameSearchSequence,
    updateAdvancedSearchFormValueSequence,
    validationErrors,
  }) => {
    return (
      <>
        <div className="header-with-blue-background display-flex flex-justify">
          <h3>Search by Bar Number</h3>
          <Button
            link
            className="margin-left-1 tablet:margin-left-205 margin-right-0 padding-0 ustc-button--mobile-inline"
            icon={['fas', 'times-circle']}
            onClick={() => {
              clearAdvancedSearchFormSequence();
            }}
          >
            Clear Search
          </Button>
        </div>
        <div className="blue-container">
          <form
            onSubmit={e => {
              e.preventDefault();
              submitPractitionerNameSearchSequence();
            }}
          >
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-6">
                <FormGroup errorText={validationErrors.barNumber}>
                  <label className="usa-label" htmlFor="bar-number">
                    Bar number <span className="usa-hint">(required)</span>
                  </label>
                  <input
                    className="usa-input"
                    id="bar-number"
                    name="barNumber"
                    type="text"
                    value={advancedSearchForm.barNumber || ''}
                    onChange={e => {
                      updateAdvancedSearchFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              </div>
            </div>

            <div className="grid-row">
              <div className="tablet:grid-col-5">
                <Button
                  className="advanced-search__button margin-top-2"
                  type="submit"
                >
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  },
);
