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

import UserEventAddEdit from "./UserEventAddEdit";
import { UserEvent, UserEventNew } from "../../types";

type DialogUserEventAddEditProps = {
  /**
   * Valid when editing a UserEvent
   */
  userEvent?: UserEvent;
  /**
   * Valid when adding a UserEvent with predefined date
   */
  date?: Date;

  /**
   * Confirmation callback
   */
  onConfirm: (userEventNew?: UserEventNew) => void;
};
export default function DialogUserEventAddEdit({ date, userEvent, onConfirm }: DialogUserEventAddEditProps) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!userEvent || !!date,
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
        <ModalHeader>{t(`message.${userEvent ? "userEventEdit" : "userEventAdd"}.title`)}</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <UserEventAddEdit userEvent={userEvent} date={date} onAction={onConfirm} isFullWidth />
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>{t("action.close")}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
