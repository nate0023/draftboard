import { ConfigProvider } from "../contexts/ConfigProvider";
import TopBar from "./TopBar";
import LineItem from "./LineItem";

const Views = () => {
  return (
    <ConfigProvider>
      <TopBar />
      <LineItem />
    </ConfigProvider>
  );
};

export default Views;
