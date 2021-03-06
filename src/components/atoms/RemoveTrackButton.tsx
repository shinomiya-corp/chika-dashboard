import IconButton from '@material-ui/core/IconButton';
import RemoveCircleRoundedIcon from '@material-ui/icons/RemoveCircleRounded';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import {
  Track,
  TracksDocument,
  useRemoveTrackMutation,
} from '../../graphql/generated';
import { IconButtonSpinner } from './IconButtonSpinner';

interface IRemoveTrackButton {
  guildId: string;
  track: Pick<Track, 'id' | 'title'>;
}

export const RemoveTrackButton: React.FC<IRemoveTrackButton> = ({
  guildId,
  track,
}) => {
  const { id: trackId, title } = track;
  const [removeTrack] = useRemoveTrackMutation({
    refetchQueries: [{ query: TracksDocument, variables: { guildId } }],
  });
  const { enqueueSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleClick() {
    setIsSubmitting(true);
    await removeTrack({
      variables: {
        input: { guildId, trackId },
      },
    });
    enqueueSnackbar(
      <span>
        Removed <b>{_.truncate(title)}</b>
      </span>,
      { variant: 'warning' },
    );
    setIsSubmitting(false);
  }
  return (
    <IconButton size="small" onClick={handleClick} disabled={isSubmitting}>
      <RemoveCircleRoundedIcon />
      <IconButtonSpinner size="small" loading={isSubmitting} />
    </IconButton>
  );
};
