import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';

const existedEver = (d) => {
  if(!d.exists) return false;
  if('isNonstandard' in d && ![null, 'Past', 'Future', 'LGPE', 'Unobtainable'].includes(d.isNonstandard)) return false;
  return true;
}

const natdex = new Generations(Dex, existedEver).get(9);

const stats = {};
const names = []

for (const pokemon of natdex.species) {
  stats[pokemon.id] = pokemon.baseStats;
  names.push(pokemon.name);
}

function idify(string) {
  return string.toLowerCase().replace(/[^a-z0-9]/g, '');
}

export { idify, stats, names }

