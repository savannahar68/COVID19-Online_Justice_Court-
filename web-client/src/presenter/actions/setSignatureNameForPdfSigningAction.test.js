import { presenter } from '../presenter';
import { runAction } from 'cerebral/test';
import { setSignatureNameForPdfSigningAction } from './setSignatureNameForPdfSigningAction';

let user = {
  section: 'SavanChambers',
};

let judgeUser = {
  name: 'Judge Savan',
};

presenter.providers.applicationContext = {
  getChiefJudgeNameForSigning: () => 'Judge Buch',
  getCurrentUser: () => user,
  getUseCases: () => ({
    getJudgeForUserChambersInteractor: () => judgeUser,
  }),
};

describe('setSignatureNameForPdfSigningAction', () => {
  it('sets the Chief Judge for non chamber users', async () => {
    user.section = 'docketclerk';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual('Judge Buch');
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Chief Judge',
    );
  });

  it('sets the chamber judge for chamber users', async () => {
    judgeUser.judgeFullName = 'Robert N. Savan, Jr.';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'SavanChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Robert N. Savan, Jr.',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });

  it('sets special trial for special trial judge', async () => {
    judgeUser.judgeFullName = 'Robert N. Savan, Jr.';
    judgeUser.judgeTitle = 'Special Trial Judge';
    user.section = 'SavanChambers';
    const result = await runAction(setSignatureNameForPdfSigningAction, {
      modules: {
        presenter,
      },
    });
    expect(result.state.pdfForSigning.nameForSigning).toEqual(
      'Robert N. Savan, Jr.',
    );
    expect(result.state.pdfForSigning.nameForSigningLine2).toEqual(
      'Special Trial Judge',
    );
  });
});
