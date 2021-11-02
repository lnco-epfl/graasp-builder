import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { buildItemPath } from '../../config/paths';
import { hooks } from '../../config/queryClient';
import { buildItemLink } from '../../config/selectors';
import ItemMenu from './ItemMenu';

const { useMember } = hooks;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  header: {
    display: 'flex',
  },
  avatar: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  title: {
    fontSize: '0.9rem',
    fontWeight: 'bold',
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  subtitle: {
    fontSize: '0.72rem',
  },
}));

const CustomCardHeader = ({ item, canEdit }) => {
  const { id, creator, name, type } = item;
  const classes = useStyles();
  const { t } = useTranslation();

  const { data: member } = useMember(creator);

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {/* todo: add avatar for member */}
        <Avatar src={member?.get('extra')?.avatar} className={classes.avatar} />
        <div>
          <Link to={buildItemPath(id)} className={classes.link}>
            <Typography id={buildItemLink(id)} className={classes.title}>
              {name}
            </Typography>
          </Link>
          <Typography className={classes.subtitle}>
            {t('Type by author', {
              type,
              author: member?.get('name'),
            })}
          </Typography>
        </div>
      </div>
      <ItemMenu item={item} canEdit={canEdit} />
    </div>
  );
};

CustomCardHeader.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    creator: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  canEdit: PropTypes.bool.isRequired,
};

export default CustomCardHeader;
