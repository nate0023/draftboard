import React from "react";
import { MdBuild, MdImportExport, MdRestartAlt } from "react-icons/md";
import { Button, HStack, VStack } from "@chakra-ui/react";
import { useConfig } from "../contexts/ConfigProvider";
import { Field, Form, Formik } from "formik";
import { NumberInputControl } from "formik-chakra-ui";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
} from "@chakra-ui/react";

function formPositionArray(qb,rb,wr) {
  var posArray = [];
  for(var i =0; i < qb; i++){
    posArray.push('qb');
  }
  for(var j =0; j < rb; j++){
    posArray.push('rb');
  }
  for(var k =0; k < wr; k++){
    posArray.push('wr');
  }
  console.log(posArray);
  return posArray;
}

function getPositionCount(positionArray,position) {
  console.log(positionArray);
  var count = positionArray.filter(element => {
    if (element === position) {
      return true;
    }
    return false;
  }).length.toString();
  return count;
}


export default function TopBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { settings, setSettings } = useConfig();

  // const saveConfig = () => {
  //   setSettings({ playerCount: 6 });
  // };
  return (
    <div className="topBar">
      <div className="buttonGroupRight">
        <Button
          leftIcon={<MdBuild />}
          colorScheme="whiteAlpha"
          variant="outline"
          width="130px"
          onClick={onOpen}
        >
          Settings
        </Button>
        <Button
          leftIcon={<MdImportExport />}
          colorScheme="green"
          variant="outline"
          width="130px"
        >
          Export
        </Button>
        <Button
          leftIcon={<MdRestartAlt />}
          colorScheme="red"
          variant="outline"
          width="130px"
        >
          Clear
        </Button>
      </div>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>DraftBoard Configuration</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Formik
              initialValues={{ playerCount: settings.playerCount, qbCount: settings.qbCount, rbCount: settings.rbCount, wrCount: settings.wrCount }}
              onSubmit={(values, actions) => {
                const vals = { ...values };
                onClose();
                
                setSettings({ playerCount: vals.playerCount , qbCount: vals.qbCount, rbCount: vals.rbCount, wrCount: vals.wrCount});
                console.log(vals)
              }}
            >
              {(props) => (
                <VStack
                  as={Form}
                  w={{}}
                  m="auto"
                  justify="center"
                  h="30vh"
                  spacing="1rem"
                >
                  <NumberInputControl
                    name="playerCount"
                    label="How many members are in your draft?"
                  />
                  <HStack>
                  <NumberInputControl
                    name="qbCount"
                    label=""
                  />
                  <NumberInputControl
                    name="rbCount"
                    label=""
                  />
                  <NumberInputControl
                    name="wrCount"
                    label=""
                  />
                  </HStack>
                  <HStack>
                    <Button type="submit">Save</Button>
                    <Button onClick={onClose}>Close</Button>
                  </HStack>
                </VStack>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
