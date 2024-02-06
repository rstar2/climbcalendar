import { TableContainer, Table, Thead, Tr, Th, Tbody, Td, Text, Tfoot } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import { Competition } from "../types";
import { formatDate } from "../utils/date";
import { getColorCompetitionType } from "../utils/styles";

type ViewTableProps = {
  /**
   * The competitions to show
   */
  competitions: Competition[];

  onDelete(id: string): void;
  onEdit(id: string): void;
};

export default function ViewTable({ competitions }: ViewTableProps) {
  const { t, i18n } = useTranslation();

  const sortedCompetitions = [...competitions].sort((c1, c2) => {
    if (c1.date === c2.date) return 0;
    return c1.date < c2.date ? -1 : 1;
  });

  return (
    !!sortedCompetitions.length && (
      <TableContainer mt={6}>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("date")}</Th>
              <Th>{t("type")}</Th>
              <Th>{t("category")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sortedCompetitions.map((competition) => {
              return (
                <Tr key={competition.id}>
                  <Td>{competition.name}</Td>
                  <Td>{formatDates(competition, i18n.language)}</Td>
                  <Td>
                    {competition.type.map((type, i) => {
                      return (
                        <Text key={type} as="span" color={getColorCompetitionType(type)}>
                          {t(`competition.type.${type}`)}
                          {i !== competition.type.length - 1 && ", "}
                        </Text>
                      );
                    })}
                  </Td>
                  <Td>{competition.category.map((cat) => t(`competition.category.${cat}`)).join(", ")}</Td>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>{t("name")}</Th>
              <Th>{t("date")}</Th>
              <Th>{t("type")}</Th>
              <Th>{t("category")}</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    )
  );
}

function formatDates(competition: Competition, locale: string) {
  const start = formatDate(competition, locale);
  if (competition.dateDuration <= 1) return start;

  const end = formatDate(competition, locale, true);

  return `${start} - ${end}`;
}
