import * as React from 'react';

export default function PlayerBox({ firstName, lastName, position, team, bye, onClick, className }) {
  const getPositionColor = () => {
    switch (position) {
      case 'QB':
        return 'indianred';
      case 'RB':
        return 'royalblue';
      case 'WR':
        return 'seagreen';
      case 'TE':
        return 'tomato';
      case 'K':
        return 'plum';
      case 'DST':
        return 'chocolate';
      default:
        return '';
    }
  };

  // if (firstName === 'Empty') {
  //   return <div className='emptyPlayerBox'>test</div>;
  // }
  // else if (firstName === 'Current') {
  if (firstName === 'Current') {
    return (
      <div className='currentPlayerBox'>
        <p>Please Select a Player...</p>
      </div>
    );
  } else {
    return (
      <div
        className={className}
        style={{ backgroundColor: getPositionColor() }}
        onClick={onClick}>
        <span
          style={{
            margin: '0px',
            padding: '0px',
            width: '25%',
            backgroundColor: 'rgba(0,0,0,0.3)',
            float: 'left',
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
          {position}
        </span>
        <span style={{ float: 'right', paddingRight: '10px' }}>{firstName}</span>
        <br />
        <span
          style={{
            float: 'right',
            fontSize: '1.5em',
            fontWeight: 'bold',
            paddingRight: '10px',
            width: '90%',
            textAlign: 'right',
          }}>
          {lastName}
        </span>
        <br />
        <span style={{ float: 'left', paddingLeft: '10px', width: '50%' }}>{'BYE ' + bye}</span>
        <span style={{ float: 'right', width: '50%', paddingRight: '10px', textAlign: 'right' }}>{team}</span>
      </div>
    );
  }
}
