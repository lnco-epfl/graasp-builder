import { FolderItemFactory } from '@graasp/sdk';

import { buildItemPath } from '@/config/paths';
import { REQUEST_MEMBERSHIP_BUTTON_ID } from '@/config/selectors';

import { CURRENT_USER } from '../../../../fixtures/members';

it('Request membership when signed in', () => {
  const item = FolderItemFactory();
  cy.setUpApi({
    items: [item],
  });

  cy.visit(buildItemPath(item.id));

  // click on enroll
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).click();

  // check endpoint
  cy.wait('@requestMembership');

  // button is disabled
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('be.disabled');
});

it('Membership request is already sent', () => {
  const item = FolderItemFactory();
  cy.setUpApi({
    items: [item],
    membershipRequests: [{ item, member: CURRENT_USER }],
  });

  cy.visit(buildItemPath(item.id));

  // button is disabled
  cy.get(`#${REQUEST_MEMBERSHIP_BUTTON_ID}`).should('be.disabled');
});
