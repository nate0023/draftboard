import { Button, Select, HStack, VStack, Stack, Input, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, FormLabel, Checkbox, useDisclosure, NumberInput } from '@chakra-ui/react';
import * as React from 'react';
import { MdBuild, MdUndo, MdOndemandVideo } from 'react-icons/md';
import { useConfig } from '../contexts/ConfigProvider';
import { useBoardState } from '../contexts/BoardStateProvider';
import { usePlayerContext } from '../contexts/PlayerProvider';
import { Formik } from 'formik';
import Countdown, { zeroPad } from 'react-countdown';
import PlayerBox from './PlayerBox';

const { useState, useEffect } = require('react');

var timerApi;
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return (
      <div
        className='timerCompleted'
        onClick={handleReset}>
        Click to Reset
      </div>
    );
  } else {
    return (
      <Stack
        direction='row'
        w='full'
        spacing={0}>
        <div className='countdownText'>
          {minutes + 60 * hours}:{zeroPad(seconds)}
        </div>
        <div className='timerButtonsPanel'>
          <Stack
            direction='column'
            h='120px'
            spacing={0}>
            <div
              className='startButton'
              onClick={handleStart}>
              Start
            </div>
            <div
              className='pauseButton'
              onClick={handlePause}>
              Pause
            </div>
            <div
              className='resetButton'
              onClick={handleReset}>
              Reset
            </div>
          </Stack>
        </div>
      </Stack>
    );
  }
};

const setRef = (countdown) => {
  if (countdown) {
    timerApi = countdown.getApi();
  }
};

function handleStart() {
  timerApi.start();
}
function handlePause() {
  timerApi.pause();
}
function handleReset() {
  timerApi.stop();
}
function parseMilliseconds(timeString) {
  var splitString = timeString.split(':');
  var minutes = splitString[0];
  var seconds = splitString[1];

  return (+minutes * 60 + +seconds) * 1000; //plus sign in front of values is used to convert string to int
}

export default function TopBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { settings, setSettings, setIsVideoPlayerOpen } = useConfig();
  const { board, resetBoard, makePlayerPick, undoPlayerPick, pickCount, boardStatus, setBoardStatus, maxPickAmount, setRecentDraftedPlayer } = useBoardState();
  const [position, setPosition] = useState('');
  const { players, setPlayers } = usePlayerContext();
  const [name, setName] = useState('');
  const [checked, setChecked] = useState(true);

  const [filteredData, setFilteredData] = useState([]);
  // const [filteredData, setFilteredData] = useState(
  //   () => JSON.parse(localStorage.getItem('players')) ?? playerData.sort((a, b) => a.rank - b.rank)
  // );
  const [isClearingBoard, setIsClearingBoard] = useState(false);

  // useEffect(() => {
  //   if (filteredData && filteredData.length > 0) {
  //     localStorage.setItem('players', JSON.stringify(filteredData));
  //   }
  // }, [filteredData]);

  //everytime the board changes (meaning someone is drafted or undrafted) then we need to filter our data again
  useEffect(() => {
    if (board && board.length > 0) filterAndSortData();
  }, [board]);

  //when the name and position fields are changed, then filter data
  useEffect(() => {
    filterAndSortData();
  }, [name, position]);

  const handleNameChange = (event) => {
    const { value } = event.target;
    setName(value);
    filterAndSortData();
  };

  const handlePositionChange = (event) => {
    const { value } = event.target;
    setPosition(value);
    filterAndSortData();
  };

  const isPlayerUndrafted = (player) => {
    for (let i = 0; i < board.length; i++) {
      if (player.first === board[i].firstName && player.last === board[i].lastName && player.position === board[i].position && player.team === board[i].team) {
        return false;
      }
    }
    return true;
  };

  //TODO current issue: will filter results down but never goes back, and undo doesnt work.
  // need to find a way to keep track of drafted players while also being able to filter
  const filterAndSortData = () => {
    const filteredFileData = players.filter(
      (item) => item.position.toLowerCase().includes(position.toLowerCase()) && (item.first + ' ' + item.last).toLowerCase().includes(name.toLowerCase()) && isPlayerUndrafted(item)
      //!item.drafted
    );
    filteredFileData.sort((a, b) => a.rank - b.rank);
    setFilteredData(filteredFileData);
  };

  const getNextHighestRankUndraftedPlayer = () => {
    const filteredData = players.filter((item) => !item.drafted);
    filteredData.sort((a, b) => a.rank - b.rank);
    return filteredData[0];
  };

  //if timer runs out, top ranked player gets auto drafted, and timer is restarted
  const setAutoDraftPick = () => {
    if (timerApi.isCompleted() && boardStatus === 'in_progress') {
      setPick(getNextHighestRankUndraftedPlayer());
      //if the board isnt complete, then restart the timer
      if (boardStatus === 'in_progress') {
        handleStart();
      }
    } else {
      handleReset();
    }
  };

  const setStartDraft = () => {
    setBoardStatus('in_progress');
  };

  //triggers pick, and then re-sorts data on screen
  const setPick = (pick) => {
    makePlayerPick(pick, 'test', pickCount);
    filterAndSortData();
  };

  const undoPick = () => {
    // only undo if first pick has been made
    if (pickCount > 1) {
      const data = players.filter(
        (item) =>
          item.position.toLowerCase().includes(board[board.length - 2].position.toLowerCase()) &&
          item.first.toLowerCase().includes(board[board.length - 2].firstName.toLowerCase()) &&
          item.last.toLowerCase().includes(board[board.length - 2].lastName.toLowerCase())
      );
      data[0].drafted = false;
      undoPlayerPick();
      filterAndSortData();
    }
  };

  function generateSearchResultPlayerBoxes() {
    var boxes = [];
    if (filteredData !== undefined && filteredData !== null && filteredData.length > 0) {
      for (let i = 0; i < 5; i++) {
        if (filteredData[i]) {
          //fixes issue when only one/two players are returned in search
          boxes.push(
            <PlayerBox
              firstName={filteredData[i].first}
              lastName={filteredData[i].last}
              position={filteredData[i].position}
              team={filteredData[i].team}
              bye={filteredData[i].bye}
              key={'suggestedPlayer' + i}
              onClick={() => setPick(filteredData[i])}
              className={'suggestedPlayerBox'}
            />
          );
        }
      }
    }
    return boxes;
  }

  return (
    <div className='topBar'>
      <div className='timer'>
        <Countdown
          date={Date.now() + parseMilliseconds(settings.timerValue)}
          autoStart={false}
          renderer={renderer}
          ref={setRef}
          onComplete={setAutoDraftPick}
        />
      </div>
      {pickCount > maxPickAmount ? (
        <span>draft is over</span>
      ) : boardStatus === 'waiting_to_start' ? (
        <div className='startDraftOverlay'>
          <Button
            className='startDraftCenter'
            onClick={() => {
              setStartDraft();
              handleStart();
            }}>
            Start Draft
          </Button>
          <span
            style={{ top: '5px', right: '10px', position: 'absolute' }}
            className=''>
            Check settings before starting ----&gt;
          </span>
        </div>
      ) : (
        <div className='playerDisplay'>
          <Stack
            direction='column'
            height='inherit'
            spacing={0}
            align={'end'}
            paddingRight={4}
            paddingLeft={4}>
            <span>Position: </span>
            <Select
              placeholder='All'
              width='120px'
              size='sm'
              name='positionSelect'
              w={'90px'}
              onChange={(e) => handlePositionChange(e)}>
              <option value='QB'>QB</option>
              <option value='RB'>RB</option>
              <option value='WR'>WR</option>
              <option value='TE'>TE</option>
              <option value='K'>K</option>
              <option value='DST'>DST</option>
            </Select>
            <span>Name: </span>
            <Input
              size='sm'
              placeholder='Enter a name...'
              _placeholder={{ color: 'black' }}
              name='playerEntry'
              width='200px'
              onChange={(e) => handleNameChange(e)}></Input>
          </Stack>

          <div className='searchResults'>
            <p>Search Results:</p>
            <Stack direction={'row'}>{generateSearchResultPlayerBoxes()}</Stack>
          </div>
        </div>
      )}

      <div className='buttonGroupRight'>
        <Button
          leftIcon={<MdBuild />}
          colorScheme='gray'
          variant='solid'
          onClick={onOpen}>
          Settings
        </Button>
        {/* <Button
          leftIcon={<MdImportExport />}
          colorScheme='green'
          variant='outline'
          width='130px'>
          Export
        </Button> */}

        <Button
          leftIcon={<MdUndo />}
          colorScheme='red'
          variant='solid'
          onClick={() => undoPick()}>
          Undo
        </Button>

        <Button
          leftIcon={<MdOndemandVideo />}
          colorScheme='blue'
          variant='solid'
          onClick={() => setIsVideoPlayerOpen(true)}>
          Video Player
        </Button>
      </div>

      <Modal
        onClose={() => {
          onClose();
          setIsClearingBoard(false);
        }}
        isOpen={isOpen}
        isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DraftBoard Configuration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{
                playerCount: settings.playerCount,
                roundCount: settings.roundCount,
                timerValue: settings.timerValue,
                snakeDraft: settings.snakeDraft,
              }}
              onSubmit={(values) => {
                const vals = { ...values };
                onClose();
                setIsClearingBoard(false);

                setSettings({
                  playerCount: vals.playerCount,
                  roundCount: vals.roundCount,
                  timerValue: vals.timerValue,
                  snakeDraft: checked,
                });
              }}>
              {({ handleChange, handleSubmit, setFieldValue }) => (
                <VStack
                  m='auto'
                  justify='center'
                  h='30vh'
                  spacing='4'>
                  {/* <NumberInputx
                    name='playerCount'
                    label='How many members are in your draft?'
                  /> */}
                  {/* <Form> */}
                  <HStack spacing={1}>
                    <FormLabel>Player Count:</FormLabel>
                    <NumberInput
                      min={1}
                      max={20}
                      name='playerCount'
                      width={81}
                      isDisabled={boardStatus === 'in_progress' ? true : false}
                      defaultValue={settings.playerCount}
                      onChange={(v) => {
                        setFieldValue('playerCount', v);
                      }}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {/* <HStack> */}
                    {/* <NumberInput
                      name='roundCount'
                      label='round Count'
                    /> */}
                    <FormLabel>Round Count:</FormLabel>
                    <NumberInput
                      defaultValue={settings.roundCount}
                      onChange={(v) => {
                        setFieldValue('roundCount', v);
                      }}
                      min={1}
                      max={20}
                      name='roundCount'
                      width={81}
                      isDisabled={boardStatus === 'in_progress' ? true : false}>
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {/* </HStack> */}
                  </HStack>
                  <HStack>
                    <FormLabel>Timer: </FormLabel>
                    <Input
                      defaultValue={settings.timerValue}
                      w={100}
                      name='timerValue'
                      //value={values.timerValue}
                      onChange={handleChange}
                      isDisabled={boardStatus === 'in_progress' ? true : false}
                    />
                    <FormLabel>Snake Draft? </FormLabel>
                    <Checkbox
                      iconColor='gray.900'
                      colorScheme='white'
                      defaultChecked={settings.snakeDraft}
                      onChange={(e) => setChecked(e.target.checked)}
                      isDisabled={boardStatus === 'in_progress' ? true : false}></Checkbox>
                  </HStack>
                  <HStack>
                    <Button
                      type='submit'
                      onClick={handleSubmit}>
                      Save
                    </Button>
                    <Button
                      onClick={() => {
                        onClose();
                        setIsClearingBoard(false);
                      }}>
                      Close
                    </Button>
                  </HStack>
                  {/* </Form> */}
                </VStack>
              )}
            </Formik>
            {!isClearingBoard && (
              <Stack>
                <Button
                  w={300}
                  m='auto'
                  onClick={() => setIsClearingBoard(true)}
                  colorScheme='red'>
                  Reset Board
                </Button>
              </Stack>
            )}
            {isClearingBoard && (
              <Stack>
                <Button
                  onClick={() => {
                    handleReset(); //reset timer
                    resetBoard();
                    setIsClearingBoard(false);
                  }}
                  colorScheme='red'>
                  Yes, Reset Board
                </Button>
                <Button onClick={() => setIsClearingBoard(false)}>Cancel</Button>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
