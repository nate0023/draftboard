import { ConfigProvider } from "../contexts/ConfigProvider";
import TopBar from "./TopBar";
import LineItem from "./LineItem";

const Views = () => {
  return (
    <div style={{'background':'#333', 'position':'absolute', 'top':'0', 'right':'0', 'bottom':'0', 'left':'0'}}>
    <ConfigProvider>
      <TopBar />
      <LineItem />
    </ConfigProvider>
    </div>
  );
};

export default Views;
