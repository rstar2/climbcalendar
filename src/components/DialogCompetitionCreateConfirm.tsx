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
import { formatDate } from "../utils/date";

type DialogCompetitionCreateConfirmProps = {
  date?: Date;
  onConfirm: (confirmed: boolean) => void;
};

export default function DialogCompetitionCreateConfirm({ date, onConfirm }: DialogCompetitionCreateConfirmProps) {
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
        <AlertDialogHeader>Create Competition</AlertDialogHeader>

        <AlertDialogCloseButton />

        {date && <AlertDialogBody>Create a new competition on date: {formatDate(date)}?</AlertDialogBody>}

        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={() => onConfirm(false)}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={() => onConfirm(true)} ml={3}>
            Create
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
