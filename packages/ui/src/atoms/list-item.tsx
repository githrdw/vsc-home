import React, { useMemo } from 'react';
import { Button } from '@chakra-ui/react';

const ListItem = ({ Icon, path, label, onClick }: any) => {
  const name = useMemo(() => {
    if (label) return label;
    if (!path) return null;
    const [, _name] = path.match(/.*[\\|/](.*)$/);
    return _name;
  }, [path]);

  return (
    <Button
      leftIcon={<Icon />}
      isFullWidth={true}
      justifyContent="flex-start"
      fontWeight="normal"
      px={2}
      color="inherit"
      onClick={onClick}
    >
      {name}
    </Button>
  );
};

export default ListItem;
