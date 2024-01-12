export enum CompetitionType {
  Boulder = "Boulder",
  Lead = "Lead",
  Speed = "Speed",
  Ninja = "Ninja",
}

export type Category = `U${8 | 10 | 12}` | "Youth_A" | "Youth_B";

export type Competition = {
  id: string;
  name: string;
  type: CompetitionType | CompetitionType[];
  date: Date;
  categories: Category[];
  dateDuration?: number;
  balkan?: boolean;
  international?: boolean;
};

// const example: Competition = {
//   id: "123456789",
//   name: "Bonsist",
//   type: CompetitionType.Boulder,
//   date: new Date(),
//   categories: ["U12", "Youth_A"],
// };

export type Func = () => void;
