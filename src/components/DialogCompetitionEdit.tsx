import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

import CompetitionAddEdit from "./CompetitionAddEdit";
import { Competition, CompetitionNew } from "../types";

type DialogCompetitionEditProps = {
  competition?: Competition;
  onConfirm: (competitionNew?: CompetitionNew) => void;
};
export default function DialogCompetitionEdit({
  competition,
  onConfirm,
}: DialogCompetitionEditProps) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!competition,
    onClose: onConfirm, // will pass undefined e.g. onConfirm(undefined)
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      scrollBehavior="inside"
      isCentered
      //   motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Competition</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <CompetitionAddEdit
            competition={competition}
            onAction={onConfirm}
            isFullWidth
          />
          ;
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
