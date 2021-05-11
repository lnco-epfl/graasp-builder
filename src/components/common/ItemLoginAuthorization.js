import React from 'react';
import { useMutation } from 'react-query';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Button, Container, makeStyles, Typography } from '@material-ui/core';
import ItemLoginScreen from '../item/ItemLoginScreen';
import ForbiddenText from './ForbiddenText';
import {
  ITEM_LOGIN_SCREEN_FORBIDDEN_ID,
  ITEM_SCREEN_ERROR_ALERT_ID,
} from '../../config/selectors';
import { useCurrentMember } from '../../hooks/member';
import { useItem, useItemLogin } from '../../hooks/item';
import Loader from './Loader';
import { SIGN_OUT_MUTATION_KEY } from '../../config/keys';
import ErrorAlert from './ErrorAlert';

const useStyles = makeStyles(() => ({
  container: {
    textAlign: 'center',
  },
}));

const ItemLoginAuthorization = () => (ChildComponent) => {
  const ComposedComponent = () => {
    const classes = useStyles();
    const { t } = useTranslation();
    const { itemId } = useParams();
    const { data: user, isLoading: isMemberLoading } = useCurrentMember();
    const { data: itemLogin, isLoading: isItemLoginLoading } = useItemLogin(
      itemId,
    );
    const {
      data: item,
      isLoading: isItemLoading,
      error,
      isError: isItemError,
    } = useItem(itemId);
    const { mutate: signOut } = useMutation(SIGN_OUT_MUTATION_KEY);

    const handleSignOut = () => {
      signOut();
    };

    const renderAuthenticatedAlternative = () => (
      <>
        <Button color="primary" onClick={handleSignOut}>
          {t('sign out to access as light user')}
        </Button>
        <Typography>{t('or')}</Typography>
        <Typography>
          {t('Ask the creator to share this item with you')}
        </Typography>
      </>
    );

    if (isMemberLoading || isItemLoginLoading || isItemLoading) {
      // get item login if the user is not authenticated and the item is empty
      return <Loader />;
    }

    if (
      isItemError &&
      [
        getReasonPhrase(StatusCodes.BAD_REQUEST),
        getReasonPhrase(StatusCodes.NOT_FOUND),
      ].includes(error.message)
    ) {
      return <ErrorAlert id={ITEM_SCREEN_ERROR_ALERT_ID} />;
    }

    // signed out but can sign in with item login
    if ((!user || user.isEmpty()) && itemLogin && !itemLogin.isEmpty()) {
      return <ItemLoginScreen />;
    }

    // the item could be fetched without errors
    // because the user is signed in and has access
    if (item && !item.isEmpty()) {
      // eslint-disable-next-line react/jsx-props-no-spreading
      return <ChildComponent />;
    }

    // either the item does not allow item login
    // or the user is already signed in as normal user and hasn't the access to this item
    return (
      <Container className={classes.container}>
        <ForbiddenText id={ITEM_LOGIN_SCREEN_FORBIDDEN_ID} />
        {user && !user.isEmpty() && renderAuthenticatedAlternative()}
      </Container>
    );
  };

  return ComposedComponent;
};

export default ItemLoginAuthorization;