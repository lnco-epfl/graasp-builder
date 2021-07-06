import { PERMISSION_LEVELS } from '../../../src/enums';
import { buildItemPath } from '../../../src/config/paths';
import { ITEM_SETTINGS_BUTTON_CLASS } from '../../../src/config/selectors';
import { SAMPLE_ITEMS } from '../../fixtures/items';
import { MEMBERS } from '../../fixtures/members';

const shareItem = ({ member, permission }) => {
  cy.get(`.${ITEM_SETTINGS_BUTTON_CLASS}`).click();

  cy.fillShareForm({ member, permission });
};

describe('Create Membership', () => {
  it('share item from settings', () => {
    cy.setUpApi({ ...SAMPLE_ITEMS, members: Object.values(MEMBERS) });

    // go to children item
    const { id } = SAMPLE_ITEMS.items[0];
    cy.visit(buildItemPath(id));

    // share
    const member = MEMBERS.ANNA;
    const permission = PERMISSION_LEVELS.READ;
    shareItem({ id, member, permission });

    cy.wait('@shareItem').then(({ request: { url, body } }) => {
      expect(url).to.contain(id);
      expect(body?.permission).to.equal(permission);
      expect(body?.memberId).to.equal(member.id);
    });
  });
});