import { Document } from '../../../../shared/src/business/entities/Document';
import { applicationContext } from '../../applicationContext';
import { completeDocumentTypeSectionHelper as completeDocumentTypeSectionHelperComputed } from './completeDocumentTypeSectionHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const completeDocumentTypeSectionHelper = withAppContextDecorator(
  completeDocumentTypeSectionHelperComputed,
  applicationContext,
);

describe('completeDocumentTypeSectionHelper', () => {
  it("should return an empty object given there's no caseDetail", () => {
    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {},
        form: {},
      },
    });

    expect(result).toEqual({});
  });

  it('returns document info with a primary document only', () => {
    const categoryKey = 'Application';
    const categoryIdx = 0;

    const { category, documentType } = Document.CATEGORY_MAP[categoryKey][
      categoryIdx
    ];

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          caseId: 'case-id-123',
        },
        form: {
          category,
          documentType,
        },
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.primary.showNonstandardForm).toBe(false);
  });

  it('returns document info with primary and secondaryDocument info', () => {
    const categoryKey = 'Motion';
    const categoryIdx = 22;

    const { category, documentType } = Document.CATEGORY_MAP[categoryKey][
      categoryIdx
    ];

    const result = runCompute(completeDocumentTypeSectionHelper, {
      state: {
        caseDetail: {
          caseId: 'case-id-123',
        },
        form: {
          category,
          documentType,
          secondaryDocument: {
            category: 'Motion',
            documentType: 'Motion for Leave to File',
          },
        },
      },
    });

    expect(result.primary).toBeTruthy();
    expect(result.secondary).toBeTruthy();
    expect(result.primary.showNonstandardForm).toBe(true);
    expect(result.primary.showSecondaryDocumentSelect).toBe(false);
  });
});
