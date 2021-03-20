import React, { useMemo, useContext } from 'react';
import { Button } from '@chakra-ui/react';

import EventBus from '@hooks/event-bus';

const ListItem = ({ Icon, path }: any) => {
  const Bus = useContext(EventBus);

  const name = useMemo(() => {
    if (!path) return null;
    const [, _name] = path.match(/.*[\\|/](.*)$/);
    return _name;
  }, [path]);

  const openFolder = () => {
    Bus.emit('vscode.openFolder', { path })
      .then(() => console.warn('Open'))
      .catch(() => console.error('Something went wrong'));
  };

  return (
    <Button
      leftIcon={<Icon />}
      isFullWidth={true}
      justifyContent="flex-start"
      fontWeight="normal"
      px={2}
      color="inherit"
      onClick={openFolder}
    >
      {name}
    </Button>
  );
};

export default ListItem;
