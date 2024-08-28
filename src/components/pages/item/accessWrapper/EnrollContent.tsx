import { Stack, Typography } from '@mui/material';

import { Button } from '@graasp/ui';

import { CircleUser } from 'lucide-react';

import { useBuilderTranslation } from '@/config/i18n';

const EnrollContent = (): JSX.Element => {
  const { t: translateBuilder } = useBuilderTranslation();
  return (
    <Stack
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
      gap={2}
    >
      <CircleUser size={40} />
      <Typography variant="h3">
        {translateBuilder('Enroll to this item')}
      </Typography>
      <Typography variant="subtitle2">
        {translateBuilder('Continue here to enroll and access this item.')}
      </Typography>
      <Button>{translateBuilder('Enroll')}</Button>
    </Stack>
  );
};

export default EnrollContent;
