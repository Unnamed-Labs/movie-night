import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button } from '@movie/ui';
import { useLobby } from '~/hooks/useLobby';
import { Page } from '~/components/Page';

const Host = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const { loading, error, openRoom } = useLobby();

  const handleHostClick = async () => {
    const lobbyId = await openRoom(displayName);
    void router.push(`/lobby/${lobbyId}`);
  };

  const handleDisplayNameChange = (val: string) => {
    setDisplayName(val);
  };

  return (
    <Page
      title="Movie Night"
      body="enter your name and create a room!"
      loading={loading}
      error={error}
    >
      <Input
        label="name"
        required
        helpText="enter your display name"
        onChange={handleDisplayNameChange}
      />
      <Button
        label="create room"
        disabled={!displayName}
        onClick={handleHostClick}
      />
    </Page>
  );
};

export default Host;
