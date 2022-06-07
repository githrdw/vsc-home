import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  Flex,
  ButtonGroup,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import React from 'react';
import { BiCodeBlock } from 'react-icons/bi';
import {
  FaListUl,
  FaListOl,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaCode,
} from 'react-icons/fa';

interface FloatingActions {
  open: boolean;
  children: React.ReactNode;
  toggleBlock: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    style: string
  ) => void;
  applyStyle: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    style: string
  ) => void;
}

const FloatingActions = ({
  open,
  children,
  toggleBlock,
  applyStyle,
}: FloatingActions) => {
  return (
    <Popover isOpen={open} placement="top" autoFocus={false}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent width="unset">
        <PopoverArrow />
        <Flex>
          <ButtonGroup size="md" isAttached variant="ghost">
            <IconButton
              variant="ghost"
              aria-label="Heading 1"
              icon={<span>H1</span>}
              onMouseDown={e => toggleBlock(e, 'header-one')}
            />
            <IconButton
              onMouseDown={e => toggleBlock(e, 'header-two')}
              aria-label="Heading 2"
              icon={<span>H2</span>}
            />
            <IconButton
              aria-label="Unordered list item"
              onMouseDown={e => toggleBlock(e, 'unordered-list-item')}
              icon={<FaListUl />}
            />
            <IconButton
              aria-label="Ordered list item"
              onMouseDown={e => toggleBlock(e, 'ordered-list-item')}
              icon={<FaListOl />}
            />
          </ButtonGroup>
          <Divider height="18px" orientation="vertical" />
          <ButtonGroup size="md" isAttached variant="ghost">
            <IconButton
              aria-label="Bold"
              icon={<FaBold />}
              onMouseDown={e => applyStyle(e, 'BOLD')}
            />
            <IconButton
              aria-label="Italic"
              icon={<FaItalic />}
              onMouseDown={e => applyStyle(e, 'ITALIC')}
            />
            <IconButton
              aria-label="Underline"
              icon={<FaUnderline />}
              onMouseDown={e => applyStyle(e, 'UNDERLINE')}
            />
            <IconButton
              aria-label="Strikethrough"
              icon={<FaStrikethrough />}
              onMouseDown={e => applyStyle(e, 'STRIKETHROUGH')}
            />
          </ButtonGroup>
          <Divider height="18px" orientation="vertical" />
          <IconButton
            variant="ghost"
            aria-label="Code"
            icon={<FaCode />}
            title="Inline code"
            onMouseDown={e => applyStyle(e, 'CODE')}
          />
          <IconButton
            variant="ghost"
            aria-label="Code"
            icon={<BiCodeBlock />}
            title="Codeblock"
            onMouseDown={e => toggleBlock(e, 'code-block')}
          />
        </Flex>
      </PopoverContent>
    </Popover>
  );
};

export default FloatingActions;
