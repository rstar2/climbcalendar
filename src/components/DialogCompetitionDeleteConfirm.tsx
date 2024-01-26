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

type DialogCompetitionDeleteConfirmProps = {
  id?: string;
  onConfirm: (confirmed: boolean) => void;
};

export default function DialogCompetitionDeleteConfirm({ id, onConfirm }: DialogCompetitionDeleteConfirmProps) {
  const { isOpen, onClose } = useDisclosure({
    isOpen: !!id,
    onClose: () => onConfirm(false),
  });
  const cancelDeleteRef = useRef<ElementRef<"button">>(null);

  return (
    <AlertDialog
      isOpen={isOpen}
      onClose={onClose}
      leastDestructiveRef={cancelDeleteRef}
      isCentered
      //   motionPreset="slideInBottom"
    >
      <AlertDialogOverlay />
      <AlertDialogContent>
        <AlertDialogHeader>Delete Competition</AlertDialogHeader>

        <AlertDialogCloseButton />

        <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

        <AlertDialogFooter>
          <Button ref={cancelDeleteRef} onClick={() => onConfirm(false)}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={() => onConfirm(true)} ml={3}>
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
