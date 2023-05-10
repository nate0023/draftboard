import { Select } from "chakra-react-select";
import playerData from "../data/players.json";
import { Stack, Divider, Center } from "@chakra-ui/react";
import { useConfig } from "../contexts/ConfigProvider";

const mappedQuarterbacks = playerData.quarterbacks.map((option) => ({
  ...option,
  colorScheme: option.name,
}));


const LineItem = () => {
  const { settings } = useConfig();  

  //this function will create player selection boxes based on the player list set in the config
  const createPlayerBoxes = () => {
    var boxes = [];
    for (var i = 0; i < settings.playerCount; i++) {
      boxes.push(
        <Select
          placeholder="select player"
          name="players"
          key={i}
          options={mappedQuarterbacks}
        />
      );
    }
    return boxes;
  };

  //this function will render lineItems based on how many people are in the league. set in the config
  const renderLineItems = () => {
    let items = [];
    for (var i = 0; i < settings.playerCount; i++) {
      items.push(
        <div style={{ width: "100%", borderBottom: "1px dashed #000000" }}>
          <Stack spacing="24px" direction="row" key={i}>
          {createPlayerBoxes()}
          </Stack>
        </div>
      );
    }
    return items;
  };

  return (
    renderLineItems()
  );
};

export default LineItem;
