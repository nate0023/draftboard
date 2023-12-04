import * as React from 'react';
import { EditablePreview, Box, useColorModeValue, IconButton, Input, useDisclosure, useEditableControls, ButtonGroup, SlideFade, Editable, Tooltip, EditableInput, Stack } from '@chakra-ui/react';
import { CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { useConfig } from '../contexts/ConfigProvider';

export default function DrafteeNameBar() {
  const { settings } = useConfig();

  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps, getEditButtonProps } = useEditableControls();

    return isEditing ? (
      <ButtonGroup
        justifyContent='end'
        size='sm'
        w='full'
        spacing={2}
        mt={2}>
        <IconButton
          icon={<CheckIcon />}
          {...getSubmitButtonProps()}
        />
        <IconButton
          icon={<CloseIcon boxSize={3} />}
          {...getCancelButtonProps()}
        />
      </ButtonGroup>
    ) : null;
  }

  const createPlayerBoxes = () => {
    var boxes = [];
    for (var i = 0; i < settings.playerCount; i++) {
      boxes.push(
        <Editable
          width='100%'
          defaultValue={'Team #' + (i + 1)}
          isPreviewFocusable={true}
          selectAllOnFocus={false}
          textAlign='center'
          key={'team' + i}>
          <Tooltip
            label='Click to edit'
            shouldWrapChildren={true}>
            <EditablePreview
              py={2}
              px={4}
              _hover={{
                background: 'dimgray',
              }}
            />
          </Tooltip>
          <Input
            py={2}
            px={4}
            as={EditableInput}
          />
          <EditableControls />
        </Editable>
      );
    }
    return boxes;
  };

  return (
    <div className='nameBar'>
      <div
        style={{
          height: 'inherit',
          width: '25px',
          background: '#000000',
          float: 'left',
          color: 'white',
          writingMode: 'sideways-lr',
          textAlign: 'center',
        }}>
        TEAMS
      </div>

      <Stack
        direction='row'
        align={'center'}
        h='60px'>
        {createPlayerBoxes()}
      </Stack>
    </div>
  );
}
