import { ITEM_LAYOUT_MODES, ROOT_ID } from '../../../../src/config/constants';
import { buildItemPath, HOME_PATH } from '../../../../src/config/paths';
import {
  buildItemCard,
  buildItemMenu,
  ITEM_MENU_BUTTON_CLASS,
  ITEM_MENU_MOVE_BUTTON_CLASS,
  NAVIGATION_HOME_LINK_ID,
} from '../../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../../fixtures/items';

const moveItem = ({ id: movedItemId, toItemPath }) => {
  const menuSelector = `#${buildItemCard(
    movedItemId,
  )} .${ITEM_MENU_BUTTON_CLASS}`;
  cy.get(menuSelector).click();
  cy.get(
    `#${buildItemMenu(movedItemId)} .${ITEM_MENU_MOVE_BUTTON_CLASS}`,
  ).click();

  cy.fillTreeModal(toItemPath);
};

describe('Move Item in Grid', () => {
  it('move item on Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    cy.visit(HOME_PATH);
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[0];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[1];
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItemInGrid(toItem);
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('move item in item', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    const { id: toItem, path: toItemPath } = SAMPLE_ITEMS.items[3];
    moveItem({ id: movedItem, toItemPath });

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.goToItemInGrid(toItem);
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  it('move item to Home', () => {
    cy.setUpApi(SAMPLE_ITEMS);
    const { id } = SAMPLE_ITEMS.items[0];

    // go to children item
    cy.visit(buildItemPath(id));
    cy.switchMode(ITEM_LAYOUT_MODES.GRID);

    // move
    const { id: movedItem } = SAMPLE_ITEMS.items[2];
    const toItem = ROOT_ID;
    moveItem({ id: movedItem, toItemPath: toItem });

    cy.wait('@moveItem');

    cy.get(`#${buildItemCard(movedItem)}`).should('not.exist');

    // check in new parent
    cy.get(`#${NAVIGATION_HOME_LINK_ID}`).click();
    cy.get(`#${buildItemCard(movedItem)}`).should('exist');
  });

  describe('Error handling', () => {
    it('error while moving item does not create in interface', () => {
      cy.setUpApi({ ...SAMPLE_ITEMS, moveItemError: true });
      const { id } = SAMPLE_ITEMS.items[0];

      // go to children item
      cy.visit(buildItemPath(id));
      cy.switchMode(ITEM_LAYOUT_MODES.GRID);

      // move
      const { id: movedItem } = SAMPLE_ITEMS.items[2];
      const { path: toItemPath } = SAMPLE_ITEMS.items[3];
      moveItem({ id: movedItem, toItemPath });

      cy.wait('@moveItem').then(() => {
        // check item is still there
        cy.get(`#${buildItemCard(movedItem)}`).should('exist');
      });
    });
  });
});