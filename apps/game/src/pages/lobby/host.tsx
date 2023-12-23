import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input, Button } from '@movie/ui';
import { useLobby } from '~/hooks/useLobby';
import { Page } from '~/components/Page';

const Host = () => {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const { isLoading, error, openRoom } = useLobby();

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
      body="Enter your name and create a room!"
    >
      {isLoading ? (
        <div>Creating room...</div>
      ) : error ? (
        <div>Uh oh! An error occurred when creating the room...</div>
      ) : (
        <>
          <Input
            label="Name"
            required
            helpText="Enter your display name"
            onChange={handleDisplayNameChange}
          />
          <Button
            disabled={!displayName}
            onClick={handleHostClick}
          >
            Create room
          </Button>
        </>
      )}
    </Page>
  );
};

export default Host;
