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
import { useTranslation } from "react-i18next";

import CompetitionAddEdit, { type CompetitionAddEditProps } from "./CompetitionAddEdit";
import { Competition, CompetitionNew } from "../../types";

type DialogCompetitionAddEditProps = Pick<CompetitionAddEditProps, "data"> & {
  /**
   * Valid when adding or editing a Competition
   * - when Competition is provided, it's editing
   * - when Date is provided, it's adding with predefined date
   * - when true is provided, it's adding without predefined date
   */
  data?: Competition | Date | true;

  /**
   * Confirmation callback
   */
  onConfirm: (competitionNew?: CompetitionNew) => void;
};
export default function DialogCompetitionAddEdit({ data, onConfirm }: DialogCompetitionAddEditProps) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure({
    isOpen: data !== undefined,
    onClose: onConfirm, // will pass undefined e.g. onConfirm(undefined)
  });

  const isAdding = data instanceof Date || data === true;

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
        <ModalHeader>{t(`message.${isAdding ? "competitionAdd" : "competitionEdit"}.title`)}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <CompetitionAddEdit data={data} onAction={onConfirm} isFullWidth />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>{t("action.close")}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
