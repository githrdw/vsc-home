import React from 'react';
import {
  Box,
  Divider,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { useRecoilState } from 'recoil';
import { WidthProvider, Responsive } from 'react-grid-layout';
import { useMemo } from 'react';
import {
  HamburgerIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
} from '@chakra-ui/icons';
import { $layouts, $recentOpened } from '../../state';
// import GridLayout from 'react-grid-layout'

const GridLayout = WidthProvider(Responsive);

const grid = {
  cols: { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 },
  rowHeight: 30,
  verticalCompact: false,
};

export const Grid = () => {
  const [firstRecent] = useRecoilState($recentOpened);
  const [layouts, setLayouts] = useRecoilState($layouts);

  const _layouts = useMemo(() => {
    return JSON.stringify(layouts);
  }, [layouts]);

  return (
    <>
      <code className="selection-allowed">{_layouts}</code>
      <GridLayout
        layouts={layouts}
        {...grid}
        onLayoutChange={(l, layouts: any) => setLayouts(layouts)}
        measureBeforeMount
      >
        <Box bg="white.2" key="a" borderRadius="sm">
          <Box p={2} borderRadius="sm" fontSize="lg">
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<HamburgerIcon />}
                size="xs"
                variant="outline"
              />
              <Portal>
                <MenuList>
                  <MenuItem icon={<AddIcon />} command="⌘T">
                    New Tab
                  </MenuItem>
                  <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
                    New Window
                  </MenuItem>
                  <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
                    Open Closed Tab
                  </MenuItem>
                  <MenuItem icon={<EditIcon />} command="⌘O">
                    Open File...
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
            Welcome on board!
          </Box>
          <Divider />
          <Box className="selection-allowed" p={2} borderRadius="sm">
            {firstRecent}
          </Box>
        </Box>
        <Box bg="black.2" key="b" borderRadius="sm">
          <Box p={2} borderRadius="sm" fontSize="lg">
            Welcome on board!
          </Box>
          <Divider />
          <Box className="selection-allowed" p={2} borderRadius="sm">
            SelectMe
          </Box>
        </Box>
        <Box bg="blue.2" key="c" borderRadius="sm">
          <Box p={2} borderRadius="sm" fontSize="lg">
            Welcome on board!
          </Box>
          <Divider />
          <Box className="selection-allowed" p={2} borderRadius="sm">
            SelectMe
          </Box>
        </Box>
        <Box bg="green.2" key="d" borderRadius="sm">
          <Box p={2} borderRadius="sm" fontSize="lg">
            Welcome on board!
          </Box>
          <Divider />
          <Box className="selection-allowed" p={2} borderRadius="sm">
            SelectMe
          </Box>
        </Box>
        <Box bg="red.2" key="e" borderRadius="sm">
          <Box p={2} borderRadius="sm" fontSize="lg">
            Riksjatravel
          </Box>
          <Divider />
          <Box className="selection-allowed" p={2} borderRadius="sm">
            SelectMe
          </Box>
        </Box>
        <Box bg="red.2" key="f" borderRadius="sm">
          <Box p={2} borderRadius="sm" fontSize="lg">
            Riksjatravel
          </Box>
          <Divider />
          <Box className="selection-allowed" p={2} borderRadius="sm">
            SelectMe
          </Box>
        </Box>
      </GridLayout>
    </>
  );
};

export default Grid;
