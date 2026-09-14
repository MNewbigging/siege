export interface Champion {
  name: ChampionName;
  todoText: string;
  //flipped: boolean; // todo this shouldn't be here, also not all champions get flipped - some get discarded
}

export enum ChampionName {
  SisterAlthea = "Sister Althea",
  WizardDenthal = "Wizard Denthal",
  LadyOzwin = "Lady Ozwin",
  SirQuentin = "Sir Quentin",
  LadyGurira = "Lady Gurira",
  SisterElina = "Sister Elina",
  SirChunnan = "Sir Chun'nan",
  SirNathem = "Sir Nathem",
  AdeptImmogin = "Adept Immogin",
  SirPhanther = "Sir Phanther",
  SirFilko = "Sir Filko",
  BrotherBenzin = "Brother Benzin",
  SmithLaicon = "Smith Laicon",
  DoktorKilter = "Doktor Kilter",
  SirHeller = "Sir Heller",
  SisterMystique = "Sister Mystique",
  MasterFemik = "Master Femik",
  MrsRye = "Mrs Rye",
}

export const championCards: Champion[] = [
  {
    name: ChampionName.SisterAlthea,
    todoText: "Flip: +- to one Holy dice",
  },
  {
    name: ChampionName.WizardDenthal,
    todoText: "Flip: +2 magic against a siege engine",
  },
  {
    name: ChampionName.LadyOzwin,
    todoText: "Discard: Reroll 2 spent strength dice to reuse them",
  },
  {
    name: ChampionName.SirQuentin,
    todoText: "Flip: +2 strength against a siege engine",
  },
  {
    name: ChampionName.LadyGurira,
    todoText: "Flip: +2 strength against a magic troop",
  },
  {
    name: ChampionName.SisterElina,
    todoText: "Flip: +1 against a strength troop",
  },
  {
    name: ChampionName.SirChunnan,
    todoText: "Flip: +1 against a strength troop",
  },
  {
    name: ChampionName.SirNathem,
    todoText: "Discard: Reroll 2 spent holy dice to reuse them",
  },
  {
    name: ChampionName.AdeptImmogin,
    todoText: "Flip: +2 magic against a strength troop",
  },
  {
    name: ChampionName.SirPhanther,
    todoText: "Flip: +2 sterngth against a strength troop",
  },
  {
    name: ChampionName.SirFilko,
    todoText: "Flip += to one strength dice",
  },
  {
    name: ChampionName.BrotherBenzin,
    todoText: "Flip: +1 magic against a magic troop",
  },
  {
    name: ChampionName.SmithLaicon,
    todoText: "Flip: Move flame to a different turret",
  },
  {
    name: ChampionName.DoktorKilter,
    todoText: "Flip: Remove all tokens from one card",
  },
  {
    name: ChampionName.SirHeller,
    todoText: "Flip: +1 strength against a magic troop",
  },
  {
    name: ChampionName.SisterMystique,
    todoText:
      "Discard: Move one strength/magic troop or siege engine to an open space",
  },
  {
    name: ChampionName.MasterFemik,
    todoText: "Flip: +2 magic against a magic troop",
  },
  {
    name: ChampionName.MrsRye,
    todoText: "Discard: Increase five dice by 1 each",
  },
];
