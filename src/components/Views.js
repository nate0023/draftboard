import { ConfigProvider } from '../contexts/ConfigProvider';
import { BoardStateProvider } from '../contexts/BoardStateProvider';
import { PlayerProvider } from '../contexts/PlayerProvider';
import TopBar from './TopBar';
import LineItem from './LineItem';
import DrafteeNameBar from './DrafteeNameBar';
import DraggableDiv from './DraggableDiv';

const Views = () => {
  return (
    // <div style={{ background: '#333', position: 'absolute', top: '0', right: '0', bottom: '0', left: '0' }}>
    <div>
      <ConfigProvider>
        <PlayerProvider>
          <BoardStateProvider>
            <TopBar />
            <DrafteeNameBar />
            <div style={{ marginTop: '180px' }}>
              <LineItem />
            </div>
            <DraggableDiv />
          </BoardStateProvider>
        </PlayerProvider>
      </ConfigProvider>
    </div>
  );
};

export default Views;
