import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Text } from "@chakra-ui/react";
import { Competition } from "../types";
import { formatDate } from "../utils/date";
import { getColor, getColorCompetitionType } from "../utils/styles";

type CompetitionsTableProps = {
  /**
   * The competitions to show
   */
  competitions: Competition[];

  onDelete(id: string): void;
  onEdit(id: string): void;
};

export default function CompetitionsTable({ competitions }: CompetitionsTableProps) {
  const sortedCompetitions = [...competitions].sort((c1, c2) => {
    if (c1.date === c2.date) return 0;
    return c1.date < c2.date ? -1 : 1;
  });

  return (
    <TableContainer mt={6}>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Dates</Th>
            <Th>Type</Th>
            <Th>Category</Th>
          </Tr>
        </Thead>
        <Tbody>
          {sortedCompetitions.map((competition) => {
            return (
              <Tr key={competition.id}>
                <Td>{competition.name}</Td>
                <Td>{formatDates(competition)}</Td>
                <Td>
                  {competition.type.map((type, i) => {
                    return (
                      <Text key={type} as="span" color={getColorCompetitionType(type)}>
                        {type}
                        {i !== competition.type.length-1 && ", "}
                      </Text>
                    );
                  })}
                </Td>
                <Td>{competition.category.join(",")}</Td>
              </Tr>
            );
          })}
        </Tbody>
        {/* <Tfoot>
          <Tr>
            <Th>Name</Th>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Category</Th>
          </Tr>
        </Tfoot> */}
      </Table>
    </TableContainer>
  );
}

function formatDates(competition: Competition) {
  const start = formatDate(competition);
  if (competition.dateDuration <= 1) return start;

  const end = formatDate(competition, true);

  return `${start} - ${end}`;
}
