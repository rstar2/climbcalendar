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

type DialogCompetitionAddEditProps = {
  /**
   * Valid when editing a Competition
   */
  competition?: Competition;
  /**
   * Valid when adding a Competition with predefined date
   */
  date?: Date;

  /**
   * Confirmation callback
   */
  onConfirm: (competitionNew?: CompetitionNew) => void;
};
export default function DialogCompetitionAddEdit({ date, competition, onConfirm }: DialogCompetitionAddEditProps) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!competition || !!date,
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
        <ModalHeader>{competition ? "Edit" : "Add"} Competition</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <CompetitionAddEdit competition={competition} date={date} onAction={onConfirm} isFullWidth />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}