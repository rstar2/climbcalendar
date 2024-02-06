import { ElementRef, useRef } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

type DialogUserEventDeleteConfirmProps = {
  id?: string;
  onConfirm: (confirmed: boolean) => void;
};

export default function DialogUserEventDeleteConfirm({ id, onConfirm }: DialogUserEventDeleteConfirmProps) {
  const { t } = useTranslation();
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!id,
    onClose: () => onConfirm(false),
  });
  const cancelRef = useRef<ElementRef<"button">>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelRef}
      isCentered
      //   motionPreset="slideInBottom"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>{t("message.userEventDelete.title")}</AlertDialogHeader>

        <AlertDialogCloseButton />

        <AlertDialogBody>{t("message.userEventDelete.confirm")}</AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={() => onConfirm(false)}>
            {t("action.close")}
          </Button>
          <Button colorScheme="red" onClick={() => onConfirm(true)} ml={3}>
            {t("action.delete")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
