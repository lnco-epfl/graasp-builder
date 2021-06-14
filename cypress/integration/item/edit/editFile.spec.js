import { DEFAULT_ITEM_LAYOUT_MODE } from '../../../../src/config/constants';
import { ITEM_LAYOUT_MODES } from '../../../../src/enums';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import { IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3 } from '../../../fixtures/files';
import { EDITED_FIELDS } from '../../../fixtures/items';
import { EDIT_ITEM_PAUSE } from '../../../support/constants';
import { editCaptionFromViewPage, editItem } from './utils';

describe('Edit File', () => {
  beforeEach(() => {
    cy.setUpApi({ items: [IMAGE_ITEM_DEFAULT, VIDEO_ITEM_S3] });
  });

  describe('View Page', () => {
    it('edit caption', () => {
      cy.visit(buildItemPath(IMAGE_ITEM_DEFAULT.id));
      const caption = 'new caption';
      editCaptionFromViewPage({ caption });
      cy.wait(`@editItem`).then(({ request: { url, body } }) => {
        expect(url).to.contain(IMAGE_ITEM_DEFAULT.id);
        // caption content might be wrapped with html tags
        expect(body?.description).to.contain(caption);
      });
    });
  });

  describe('List', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);

      if (DEFAULT_ITEM_LAYOUT_MODE !== ITEM_LAYOUT_MODES.LIST) {
        cy.switchMode(ITEM_LAYOUT_MODES.LIST);
      }

      const itemToEdit = IMAGE_ITEM_DEFAULT;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.LIST,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });
  });

  describe('Grid', () => {
    it('edit file on Home', () => {
      cy.visit(HOME_PATH);
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      const itemToEdit = VIDEO_ITEM_S3;

      // edit
      editItem(
        {
          ...itemToEdit,
          ...EDITED_FIELDS,
        },
        ITEM_LAYOUT_MODES.GRID,
      );

      cy.wait('@editItem').then(
        ({
          response: {
            body: { id, name },
          },
        }) => {
          // check item is edited and updated
          expect(id).to.equal(itemToEdit.id);
          expect(name).to.equal(EDITED_FIELDS.name);
          cy.wait(EDIT_ITEM_PAUSE);
          cy.wait('@getOwnItems');
        },
      );
    });
  });
});
