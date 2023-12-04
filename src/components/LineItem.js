import { Select } from 'chakra-react-select';
import playerData from '../data/players.json';
import { Stack } from '@chakra-ui/react';
import { useConfig } from '../contexts/ConfigProvider';
import { useBoardState } from '../contexts/BoardStateProvider';
import { FaLongArrowAltRight, FaLongArrowAltLeft, FaLongArrowAltDown } from 'react-icons/fa';
import * as React from 'react';
import PlayerBox from './PlayerBox';

const { useEffect } = require('react');

const LineItem = () => {
  const { settings } = useConfig();
  const { board, setBoard, pickCount, setPickCount } = useBoardState();

  useEffect(() => {
    renderLineItems();
  }, [board]);

  //this function will create player selection boxes based on the player amount set in the config
  //CLEAN THIS
  const createPlayerBoxes = (currentRound) => {
    var arrowCounter = 1; //needed this for counter to display arrows. the i value in loop below wouldn't work
    var boxes = [];
    if (currentRound === 1) {
      currentRound = 0;
    } else {
      currentRound = currentRound * +settings.playerCount - +settings.playerCount;
    }
    for (let i = currentRound; i < currentRound + +settings.playerCount; i++) {
      //for (let i = currentRound + +settings.playerCount; i > currentRound; i--) {
      if (!board || !board[i] || board[i].firstName === undefined || board[i].firstName === null) {
        boxes.push(
          <div
            key={'playerBox' + i}
            style={{
              height: '85px',
              width: '100%',
              borderRight: '1px solid black',
              margin: '0px',
              padding: '0px',
              position: 'relative',
              zIndex: '-1',
            }}>
            <p className='emptyBoxArrow'>
              {settings.snakeDraft && (currentRound / 10) % 2 === 0 ? (
                arrowCounter % 10 === 0 ? (
                  <FaLongArrowAltDown />
                ) : (
                  <FaLongArrowAltRight />
                )
              ) : settings.snakeDraft && arrowCounter % 10 === 0 ? (
                <FaLongArrowAltDown />
              ) : settings.snakeDraft ? (
                <FaLongArrowAltLeft />
              ) : (
                <FaLongArrowAltRight />
              )}
            </p>
            {/* <PlayerBox firstName={'Empty'} /> */}
          </div>
        );
      } else {
        boxes.push(
          <div
            style={{
              height: '85px',
              width: '100%',
              borderRight: '1px solid black',
              margin: '0px',
              padding: '0px',
            }}
            key={'playerBox' + i}>
            <PlayerBox
              firstName={board[i].firstName}
              lastName={board[i].lastName}
              position={board[i].position}
              team={board[i].team}
              bye={board[i].bye}
              className={'playerBox'}
            />
          </div>
        );
      }
      arrowCounter++;
    }
    //this line checks for snake draft. if yes, it will reverse every other row
    if (settings.snakeDraft && (currentRound / 10) % 2 !== 0) boxes.reverse();

    return boxes;
  };

  //this function will render lineItems based on rounds there are in the draft. set in the config
  const renderLineItems = () => {
    let items = [];
    for (var i = 0; i < settings.roundCount; i++) {
      items.push(
        <div
          style={{ width: '100%', borderBottom: '2px dashed #000000' }}
          key={'lineItem' + i}>
          <div
            style={{
              height: '85px',
              width: '25px',
              background: '#000000',
              float: 'left',
              color: 'white',
              writingMode: 'sideways-lr',
              textAlign: 'center',
            }}>
            {'R' + (i + 1)}
          </div>
          <Stack direction='row'>{createPlayerBoxes(i + 1)}</Stack>
        </div>
      );
    }

    return items;
  };

  return renderLineItems();
};

export default LineItem;
