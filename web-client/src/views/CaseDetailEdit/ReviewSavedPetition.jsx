import { AddressDisplay } from '../CaseDetail/PetitionerInformation';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CaseDifferenceModalOverlay } from '../StartCase/CaseDifferenceModalOverlay';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { Focus } from '../../ustc-ui/Focus/Focus';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { OrdersNeededSummary } from '../StartCaseInternal/OrdersNeededSummary';
import { PDFPreviewButton } from '../PDFPreviewButton';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const ConfirmServeToIrsModal = () => (
  <ConfirmModal
    cancelLabel="No, Take Me Back"
    confirmLabel="Yes, Serve"
    preventCancelOnBlur={true}
    title="Are You Sure You Want to Serve This Petition to the IRS?"
    onCancelSequence="clearModalSequence"
    onConfirmSequence="saveCaseAndServeToIrsSequence"
  ></ConfirmModal>
);

export const ReviewSavedPetition = connect(
  {
    caseDetail: state.caseDetail,
    constants: state.constants,
    documentId: state.documentId,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    navigateToEditSavedDocumentDetailSequence:
      sequences.navigateToEditSavedDocumentDetailSequence,
    openConfirmServeToIrsModalSequence:
      sequences.openConfirmServeToIrsModalSequence,
    reviewSavedPetitionHelper: state.reviewSavedPetitionHelper,
    saveCaseAndServeToIrsSequence: sequences.saveCaseAndServeToIrsSequence,
    saveSavedCaseForLaterSequence: sequences.saveSavedCaseForLaterSequence,
    showModal: state.showModal,
    startCaseHelper: state.startCaseHelper,
  },
  ({
    caseDetail,
    constants,
    documentId,
    formCancelToggleCancelSequence,
    navigateToEditSavedDocumentDetailSequence,
    openConfirmServeToIrsModalSequence,
    reviewSavedPetitionHelper,
    saveCaseAndServeToIrsSequence,
    saveSavedCaseForLaterSequence,
    showModal,
    startCaseHelper,
  }) => {
    const { caseId } = caseDetail;

    return (
      <>
        <CaseDetailHeader />
        <section
          className="usa-section grid-container"
          id="ustc-start-a-case-form"
        >
          <Focus>
            <h2 id="file-a-document-header" tabIndex="-1">
              Review the Petition
            </h2>
          </Focus>

          {reviewSavedPetitionHelper.hasOrders && (
            <OrdersNeededSummary caseInformation={caseDetail} />
          )}

          <div className="grid-container padding-x-0 create-case-review">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-7 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">
                      Parties
                      <Button
                        link
                        aria-label="edit parties"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        icon="edit"
                        onClick={() => {
                          navigateToEditSavedDocumentDetailSequence({
                            caseId,
                            documentId,
                            tab: 'partyInfo',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="filing-parties"
                        >
                          Party type
                        </label>
                        {caseDetail.partyType}
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <label
                          className="usa-label usa-label-display"
                          htmlFor="filing-contact-primary"
                        >
                          Petitioner’s contact information
                        </label>
                        {caseDetail.contactPrimary && (
                          <address aria-labelledby="primary-label">
                            {AddressDisplay(
                              caseDetail.contactPrimary,
                              constants,
                              {
                                nameOverride:
                                  startCaseHelper.showCaseNameForPrimary &&
                                  startCaseHelper.caseName,
                              },
                            )}
                          </address>
                        )}
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        {startCaseHelper.hasContactSecondary && (
                          <>
                            <label
                              className="usa-label usa-label-display"
                              htmlFor="filing-contact-secondary"
                            >
                              Spouse’s contact information
                            </label>
                            {AddressDisplay(
                              caseDetail.contactSecondary,
                              constants,
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-5 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">
                      Case Information
                      <Button
                        link
                        aria-label="edit case information"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        icon="edit"
                        onClick={() => {
                          navigateToEditSavedDocumentDetailSequence({
                            caseId,
                            documentId,
                            tab: 'caseInfo',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-6 margin-bottom-05">
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Date received
                          </label>
                          {reviewSavedPetitionHelper.receivedAtFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Case caption
                          </label>
                          {caseDetail.caseCaption}{' '}
                          {constants.CASE_CAPTION_POSTFIX}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Requested trial location
                          </label>
                          {caseDetail.preferredTrialCity}
                        </div>
                      </div>
                      <div className="tablet:grid-col-6 margin-bottom-1">
                        {caseDetail.mailingDate && (
                          <div className="margin-top-3 margin-bottom-2">
                            <label
                              className="usa-label usa-label-display"
                              htmlFor="mailing-date"
                            >
                              Mailing date
                            </label>
                            {caseDetail.mailingDate}
                          </div>
                        )}

                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-procedure"
                          >
                            Case procedure
                          </label>
                          {caseDetail.procedureType}
                        </div>

                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-location"
                          >
                            Filing fee
                          </label>
                          {
                            reviewSavedPetitionHelper.petitionPaymentStatusFormatted
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid-container padding-x-0 create-case-review">
            <div className="grid-row grid-gap">
              <div className="tablet:grid-col-7 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">
                      IRS Notice
                      <Button
                        link
                        aria-label="edit IRS notice information"
                        className="margin-right-0 margin-top-1 padding-0 float-right"
                        icon="edit"
                        onClick={() => {
                          navigateToEditSavedDocumentDetailSequence({
                            caseId,
                            documentId,
                            tab: 'irsNotice',
                          });
                        }}
                      >
                        Edit
                      </Button>
                    </h3>
                    <div className="grid-row grid-gap">
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        <div>
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Notice attached to petition?
                          </label>
                          {reviewSavedPetitionHelper.hasIrsNoticeFormatted}
                        </div>
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-type"
                          >
                            Type of notice/case
                          </label>
                          {caseDetail.caseType}
                        </div>
                      </div>
                      <div className="tablet:grid-col-4 margin-bottom-1">
                        {reviewSavedPetitionHelper.shouldShowIrsNoticeDate && (
                          <div>
                            <label
                              className="usa-label usa-label-display"
                              htmlFor="filing-type"
                            >
                              Date of notice
                            </label>
                            {reviewSavedPetitionHelper.irsNoticeDateFormatted}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col-5 margin-bottom-4">
                <div className="card height-full margin-bottom-0">
                  <div className="content-wrapper">
                    <h3 className="underlined">Attachments</h3>
                    <div>
                      {reviewSavedPetitionHelper.petitionFile && (
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-petition"
                          >
                            Petition
                          </label>
                          <div className="grid-row">
                            <div className="grid-col flex-auto">
                              <PDFPreviewButton
                                file={reviewSavedPetitionHelper.petitionFile}
                                title="Petition"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.stinFile && (
                        <div className="margin-top-3 margin-bottom-2">
                          <label
                            className="usa-label usa-label-display"
                            htmlFor="filing-parties"
                          >
                            Statement of Taxpayer Identification
                          </label>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  file={reviewSavedPetitionHelper.stinFile}
                                  title="Statement of Taxpayer Identification"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.requestForPlaceOfTrialFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <label
                            className="usa-label usa-label-display margin-top-3"
                            htmlFor="filing-parties"
                          >
                            Request for Place of Trial
                          </label>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  file={
                                    reviewSavedPetitionHelper.requestForPlaceOfTrialFile
                                  }
                                  title="Request for Place of Trial"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {reviewSavedPetitionHelper.ownershipDisclosureFile && (
                        <div className="margin-top-3 margin-bottom-3">
                          <label
                            className="usa-label usa-label-display margin-top-3"
                            htmlFor="filing-parties"
                          >
                            Ownership Disclosure Statement
                          </label>
                          <div>
                            <div className="grid-row">
                              <div className="grid-col flex-auto">
                                <PDFPreviewButton
                                  file={
                                    reviewSavedPetitionHelper.ownershipDisclosureFile
                                  }
                                  title="Ownership Disclosure Statement"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="margin-top-5">
            <Button
              id="submit-case"
              onClick={() => {
                openConfirmServeToIrsModalSequence();
              }}
            >
              Serve to IRS
            </Button>
            <Button secondary onClick={() => saveSavedCaseForLaterSequence()}>
              Save for Later
            </Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </div>
        </section>
        {showModal === 'CaseDifferenceModalOverlay' && (
          <CaseDifferenceModalOverlay />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={saveCaseAndServeToIrsSequence}
          />
        )}
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToDashboardSequence" />
        )}
        {showModal == 'ConfirmServeToIrsModal' && <ConfirmServeToIrsModal />}
      </>
    );
  },
);
