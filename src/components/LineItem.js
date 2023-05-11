import { Select } from "chakra-react-select";
import playerData from "../data/players.json";
import { Stack } from "@chakra-ui/react";
import { useConfig } from "../contexts/ConfigProvider";

const mappedQuarterbacks = playerData.quarterbacks.map((option) => ({
  ...option,
  colorScheme: option.name,
}));


const LineItem = () => {
  const { settings } = useConfig();  

  //this function will create player selection boxes based on the player list set in the config
  //CLEAN THIS
  const createPlayerBoxes = () => {
    var boxes = [];
    for (var i = 0; i < settings.qbCount; i++) {
      boxes.push(
        <Select
          placeholder="select qb"
          name="qb"
          key={'qb'+i}
          options={mappedQuarterbacks}
        />
      );
    }
    for (var j = 0; j < settings.rbCount; j++) {
      boxes.push(
        <Select
          placeholder="select rb"
          name="rb"
          key={'rb'+j}
          options={mappedQuarterbacks}
        />
      );
    }
    for (var k = 0; k < settings.wrCount; k++) {
      boxes.push(
        <Select
          placeholder="select wr"
          name="wr"
          key={'wr'+k}
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
        <div style={{ width: "100%", borderBottom: "2px dashed #000000" }} key={i}>
          <Stack style={{margin:"10px"}} spacing="24px" direction="row">
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
