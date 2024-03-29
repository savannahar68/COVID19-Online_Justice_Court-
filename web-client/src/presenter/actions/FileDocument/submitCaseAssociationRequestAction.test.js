import { presenter } from '../../presenter';
import { runAction } from 'cerebral/test';
import { submitCaseAssociationRequestAction } from './submitCaseAssociationRequestAction';
import sinon from 'sinon';

describe('submitCaseAssociationRequestAction', () => {
  let submitCaseAssociationRequestStub;
  let submitPendingCaseAssociationRequestStub;

  beforeEach(() => {
    submitCaseAssociationRequestStub = sinon.stub();
    submitPendingCaseAssociationRequestStub = sinon.stub();

    presenter.providers.applicationContext = {
      getCurrentUser: () => ({
        email: 'practitioner1@example.com',
      }),
      getUseCases: () => ({
        submitCaseAssociationRequestInteractor: submitCaseAssociationRequestStub,
        submitPendingCaseAssociationRequestInteractor: submitPendingCaseAssociationRequestStub,
      }),
    };
  });

  it('should call submitCaseAssociationRequest', async () => {
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Entry of Appearance',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitCaseAssociationRequestStub.calledOnce).toEqual(true);
  });

  it('should call submitPendingCaseAssociationRequest', async () => {
    await runAction(submitCaseAssociationRequestAction, {
      modules: {
        presenter,
      },
      state: {
        caseDetail: {},
        form: {
          documentType: 'Notice of Intervention',
          primaryDocumentFile: {},
        },
      },
    });

    expect(submitPendingCaseAssociationRequestStub.calledOnce).toEqual(true);
  });
});
