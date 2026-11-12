export type PokemonTypeName =
  | "bug"
  | "dark"
  | "dragon"
  | "electric"
  | "fairy"
  | "fighting"
  | "fire"
  | "flying"
  | "ghost"
  | "grass"
  | "ground"
  | "ice"
  | "normal"
  | "poison"
  | "psychic"
  | "rock"
  | "steel"
  | "water";

export type TypeMatchup = {
  image: string;
  strength: PokemonTypeName[];
  weakness: PokemonTypeName[];
  resistance: PokemonTypeName[];
  vulnerable: PokemonTypeName[];
};

const bug = "/assets/types/bug.png";
const dark = "/assets/types/dark.svg";
const dragon = "/assets/types/dragon.png";
const electric = "/assets/types/electric.svg";
const fairy = "/assets/types/fairy.svg";
const fighting = "/assets/types/fighting.svg";
const fire = "/assets/types/fire.png";
const flying = "/assets/types/flying.png";
const ghost = "/assets/types/ghost.png";
const grass = "/assets/types/grass.png";
const ground = "/assets/types/ground.svg";
const ice = "/assets/types/ice.svg";
const normal = "/assets/types/normal.svg";
const poison = "/assets/types/poison.svg";
const psychic = "/assets/types/psychic.svg";
const rock = "/assets/types/rock.svg";
const steel = "/assets/types/steel.svg";
const water = "/assets/types/water.svg";


const Bug: PokemonTypeName = "bug";
const Dark: PokemonTypeName = "dark";
const Dragon: PokemonTypeName = "dragon";
const Electric: PokemonTypeName = "electric";
const Fairy: PokemonTypeName = "fairy";
const Fighting: PokemonTypeName = "fighting";
const Fire: PokemonTypeName = "fire";
const Flying: PokemonTypeName = "flying";
const Ghost: PokemonTypeName = "ghost";
const Grass: PokemonTypeName = "grass";
const Ground: PokemonTypeName = "ground";
const Ice: PokemonTypeName = "ice";
const Normal: PokemonTypeName = "normal";
const Poison: PokemonTypeName = "poison";
const Psychic: PokemonTypeName = "psychic";
const Rock: PokemonTypeName = "rock";
const Steel: PokemonTypeName = "steel";
const Water: PokemonTypeName = "water";

export const pokemonTypes: Record<PokemonTypeName, TypeMatchup> = {
  bug: {
    image: bug,
    strength: [Grass, Psychic, Dark],
    weakness: [Fighting, Flying, Poison, Ghost, Steel, Fire, Fairy],
    resistance: [Fighting, Ground, Grass],
    vulnerable: [Flying, Rock, Fire],
  },
  dark: {
    image: dark,
    strength: [Ghost, Psychic],
    weakness: [Fighting, Dark, Fairy],
    resistance: [Ghost, Psychic, Dark],
    vulnerable: [Fighting, Bug, Fairy],
  },
  dragon: {
    image: dragon,
    strength: [Dragon],
    weakness: [Steel, Fairy],
    resistance: [Fire, Water, Grass, Electric],
    vulnerable: [Ice, Dragon, Fairy],
  },
  electric: {
    image: electric,
    strength: [Flying, Water],
    weakness: [Ground, Grass, Electric, Dragon],
    resistance: [Flying, Steel, Electric],
    vulnerable: [Ground],
  },
  fairy: {
    image: fairy,
    strength: [Fighting, Dragon, Dark],
    weakness: [Poison, Steel, Fire],
    resistance: [Fighting, Bug, Dragon, Dark],
    vulnerable: [Poison, Steel],
  },
  fighting: {
    image: fighting,
    strength: [Normal, Rock, Steel, Ice, Dark],
    weakness: [Flying, Poison, Psychic, Bug, Ghost, Fairy],
    resistance: [Rock, Bug, Dark],
    vulnerable: [Flying, Psychic, Fairy],
  },
  fire: {
    image: fire,
    strength: [Bug, Steel, Grass, Ice],
    weakness: [Rock, Fire, Water, Dragon],
    resistance: [Bug, Steel, Fire, Grass, Ice],
    vulnerable: [Ground, Rock, Water],
  },
  flying: {
    image: flying,
    strength: [Fighting, Bug, Grass],
    weakness: [Rock, Steel, Electric],
    resistance: [Fighting, Ground, Bug, Grass],
    vulnerable: [Rock, Electric, Ice],
  },
  ghost: {
    image: ghost,
    strength: [Ghost, Psychic],
    weakness: [Normal, Dark],
    resistance: [Normal, Fighting, Poison, Bug],
    vulnerable: [Ghost, Dark],
  },
  grass: {
    image: grass,
    strength: [Ground, Rock, Water],
    weakness: [Flying, Poison, Bug, Steel, Fire, Grass, Dragon],
    resistance: [Ground, Water, Grass, Electric],
    vulnerable: [Flying, Poison, Bug, Fire, Ice],
  },
  ground: {
    image: ground,
    strength: [Poison, Rock, Steel, Fire, Electric],
    weakness: [Flying, Bug, Grass],
    resistance: [Poison, Rock, Electric],
    vulnerable: [Water, Grass, Ice],
  },
  ice: {
    image: ice,
    strength: [Flying, Ground, Grass, Dragon],
    weakness: [Steel, Fire, Water, Ice],
    resistance: [Ice],
    vulnerable: [Fighting, Rock, Steel, Fire],
  },
  normal: {
    image: normal,
    strength: [],
    weakness: [Rock, Ghost, Steel],
    resistance: [Ghost],
    vulnerable: [Fighting],
  },
  poison: {
    image: poison,
    strength: [Grass, Fairy],
    weakness: [Poison, Ground, Rock, Ghost, Steel],
    resistance: [Fighting, Poison, Grass, Fairy],
    vulnerable: [Ground, Psychic],
  },
  psychic: {
    image: psychic,
    strength: [Fighting, Poison],
    weakness: [Steel, Psychic, Dark],
    resistance: [Fighting, Psychic],
    vulnerable: [Bug, Ghost, Dark],
  },
  rock: {
    image: rock,
    strength: [Flying, Bug, Fire, Ice],
    weakness: [Fighting, Ground, Steel],
    resistance: [Normal, Flying, Poison, Fire],
    vulnerable: [Fighting, Ground, Steel, Water, Grass],
  },
  steel: {
    image: steel,
    strength: [Rock, Ice, Fairy],
    weakness: [Steel, Fire, Water, Electric],
    resistance: [
      Normal,
      Flying,
      Poison,
      Rock,
      Bug,
      Steel,
      Grass,
      Psychic,
      Ice,
      Dragon,
      Fairy,
    ],
    vulnerable: [Fighting, Ground, Fire],
  },
  water: {
    image: water,
    strength: [Ground, Rock, Fire],
    weakness: [Water, Grass, Dragon],
    resistance: [Steel, Fire, Water, Ice],
    vulnerable: [Grass, Electric],
  },
};