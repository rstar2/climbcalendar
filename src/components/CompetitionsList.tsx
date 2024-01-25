import {
  List,
  ListItem,
  ListIcon,
  HStack,
  Text,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";

import { Competition } from "../types";
import { formatDate } from "../utils/date";
import { getColor } from "../utils/styles";
import { useAuthAdmin } from "../cache/auth";

type CompetitionsListProps = {
  /**
   * The competitions to show
   */
  competitions: Competition[];

  onDelete(id: string): void;
  onEdit(id: string): void;
};

export default function CompetitionsList({
  competitions,
  onEdit,
  onDelete,
}: CompetitionsListProps) {
  const isAuthAdmin = useAuthAdmin();

  const sortedCompetitions = [...competitions].sort((c1, c2) => {
    if (c1.date === c2.date) return 0;
    return c1.date < c2.date ? -1 : 1;
  });

  return (
    <List mt={6} spacing={3}>
      {sortedCompetitions.map((competition) => {
        return (
          <ListItem>
            <HStack>
              <ListIcon as={CheckIcon} color={getColor(competition)} />
              <Text>
                {competition.name} - {formatDate(competition)}
              </Text>

              {isAuthAdmin && (
                <>
                  <Spacer />
                  <IconButton
                    className="showOnHoverParent"
                    aria-label="edit"
                    icon={<EditIcon />}
                    onClick={() => onEdit(competition.id)}
                  />
                  <IconButton
                    className="showOnHoverParent"
                    aria-label="delete"
                    icon={<DeleteIcon />}
                    color="red"
                    onClick={() => onDelete(competition.id)}
                  />
                </>
              )}
            </HStack>
          </ListItem>
        );
      })}
    </List>
  );
}
