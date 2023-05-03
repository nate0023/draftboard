import { Select } from "chakra-react-select";
import playerData from "../data/players.json";
import { Stack, HStack, VStack } from "@chakra-ui/react";

const LineItem = () => {
  const colourOptions = [
    { value: "blue", label: "Blue", color: "#0052CC" },
    { value: "purple", label: "Purple", color: "#5243AA" },
    { value: "red", label: "Red", color: "#FF5630" },
    { value: "orange", label: "Orange", color: "#FF8B00" },
    { value: "yellow", label: "Yellow", color: "#FFC400" },
    { value: "green", label: "Green", color: "#36B37E" },
  ];
  const mappedColourOptions = colourOptions.map((option) => ({
    ...option,
    colorScheme: option.value,
  }));
  const mappedQuarterbacks = playerData.quarterbacks.map((option) => ({
    ...option,
    colorScheme: option.name,
  }));
  return (
    <Stack spacing="24px" direction="row">
      <Select
        placeholder="select player"
        name="players"
        options={mappedQuarterbacks}
      />

      <Select
        isMulti
        placeholder="select color"
        name="colors"
        options={mappedColourOptions}
      />
    </Stack>
  );
};

export default LineItem;
