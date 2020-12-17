import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { withStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button } from '@material-ui/core';
import * as Api from '../../api/item';

const styles = () => ({
  root: {
    height: 240,
    flexGrow: 1,
    maxWidth: 400,
  },
});

const FetchingTreeItem = ({ id }) => (
  <TreeItem
    key={`fetching-${id}`}
    nodeId={`fetching-${id}`}
    label="fetching children..."
  />
);

FetchingTreeItem.propTypes = {
  id: PropTypes.string.isRequired,
};

class MoveItemModal extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      root: PropTypes.string.isRequired,
    }).isRequired,
    ownedItems: PropTypes.instanceOf(List).isRequired,
    t: PropTypes.func.isRequired,
  };

  state = {};

  handleClose = () => {
    const { onClose } = this.props;
    onClose();
  };

  onConfirm = () => {
    const { onClose } = this.props;
    // eslint-disable-next-line no-console
    onClose();
  };

  onSelect = (e, value) => {
    // eslint-disable-next-line no-console
    console.log(value);
  };

  fetchChildren = async ({ id }) => {
    const { tree } = this.state;
    const children = await Api.getChildren(id);

    this.setState({ tree: tree.concat(children) });
  };

  renderItemTreeItem = (items) =>
    items?.map((item) => {
      const { id: itemId, name } = item;

      return (
        <TreeItem
          key={itemId}
          nodeId={itemId}
          label={name}
          onClick={() => this.fetchChildren(item)}
        />
      );
    });

  render() {
    const { open, classes, ownedItems, t } = this.props;
    return (
      <Dialog
        onClose={this.handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">
          {t('Where do you want to move the item?')}
        </DialogTitle>
        <TreeView
          className={classes.root}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          onNodeSelect={this.onSelect}
        >
          {this.renderItemTreeItem(ownedItems)}
        </TreeView>
        <Button onClick={this.onConfirm} color="primary" variant="contained">
          {t('Confirm')}
        </Button>
      </Dialog>
    );
  }
}

const mapStateToProps = ({ item }) => ({
  items: item.getIn(['items']),
  ownedItems: item.getIn(['own']),
});

const mapDispatchToProps = {};

const ConnectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MoveItemModal);
const TranslatedComponent = withTranslation()(ConnectedComponent);
export default withStyles(styles)(TranslatedComponent);