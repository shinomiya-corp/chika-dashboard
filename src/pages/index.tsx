import React, { useCallback, useEffect } from 'react';
import { LoginPrompt } from '../components/molecules/LoginPrompt';
import { GuildBars } from '../components/organisms/GuildBars';
import { Layout } from '../components/organisms/Layout';
import { useStore } from '../controllers/store';
import { useMeQuery } from '../graphql/generated';

export default function Home() {
  const { data, loading, error } = useMeQuery();
  const { setUser, setGuilds, setActiveGuild } = useStore(
    useCallback(
      // eslint-disable-next-line no-shadow
      ({ setUser, setGuilds, setActiveGuild }) => ({
        setUser,
        setGuilds,
        setActiveGuild,
      }),
      [],
    ),
  );
  useEffect(() => {
    setActiveGuild();
  }, [setActiveGuild]);
  useEffect(() => {
    setUser(data?.getUser);
    setGuilds(data?.getUser.guilds || []);
  }, [data, setUser, setGuilds]);

  // TODO: loading spinner
  if (loading) return null;
  // FIXME: handle case when there are no guilds

  return (
    <Layout>
      <GuildBars />
      <LoginPrompt open={!!error} />
    </Layout>
  );
}
