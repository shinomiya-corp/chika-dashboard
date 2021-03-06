import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { FormikProvider, useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import React from 'react';
import * as yup from 'yup';
import {
  GuildConfig,
  useUpdateShiritoriMutation,
} from '../../graphql/generated';
import { CardGutterBottom } from '../atoms/CardGutterBottom';
import { ResetShiritoriButton } from '../atoms/ResetButton';
import { ShiritoriForm } from '../atoms/ShiritoriForm';

const validationSchema = yup.object({
  handSize: yup
    .number()
    .min(1, 'Pls dawg just put in a normal number')
    .max(12, 'The maximum is 12')
    .required("Don't leave me empty!"),
  minLen: yup
    .number()
    .min(1, 'Seems kinda sussy to me')
    .required("Don't leave me empty!"),
});

interface IShiritoriSettingsCard {
  config: GuildConfig;
}

export interface IShiritoriFormik {
  handSize: number;
  minLen: number;
}

export const ShiritoriSettingsCard: React.FC<IShiritoriSettingsCard> = ({
  config,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [updateShiritori] = useUpdateShiritoriMutation();
  const { shiriHandSize, shiriMinLen, id } = config;
  const formik = useFormik<IShiritoriFormik>({
    initialValues: {
      handSize: shiriHandSize,
      minLen: shiriMinLen,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async ({ handSize, minLen }, { setSubmitting }) => {
      if (handSize === shiriHandSize && minLen === shiriMinLen) return;
      await updateShiritori({ variables: { input: { id, handSize, minLen } } });
      enqueueSnackbar('Shiritori settings updated', { variant: 'success' });
      setSubmitting(false);
    },
  });

  return (
    <CardGutterBottom>
      <CardHeader title="Shiritori" subheader="Settings for Shiritori." />
      <FormikProvider value={formik}>
        <CardContent>
          <ShiritoriForm />
        </CardContent>
        <CardActions>
          <ResetShiritoriButton guildId={config.id} />
        </CardActions>
      </FormikProvider>
    </CardGutterBottom>
  );
};
