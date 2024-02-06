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

import { formatDate } from "../../utils/date";

type DialogCompetitionCreateConfirmProps = {
  date?: Date;
  onConfirm: (confirmed: boolean) => void;
};

export default function DialogCompetitionCreateConfirm({ date, onConfirm }: DialogCompetitionCreateConfirmProps) {
  const { t, i18n } = useTranslation();
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!date,
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
        <AlertDialogHeader>{t("message.competitionAdd.title")}</AlertDialogHeader>

        <AlertDialogCloseButton />

        {date && (
          <AlertDialogBody>
            {t("message.competitionAdd.confirm", { date: formatDate(date, i18n.language) })}
          </AlertDialogBody>
        )}

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={() => onConfirm(false)}>
            {t("action.close")}
          </Button>
          <Button colorScheme="red" onClick={() => onConfirm(true)} ml={3}>
            {t("action.add")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
