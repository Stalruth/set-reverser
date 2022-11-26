<script>
import StatRow from './components/StatRow.svelte';
import { idify, stats, names } from './lib/stats.js';
import getPossibleSet from './lib/calc.js';

function setBaseStats(value) {
  const id = idify(value)
  if(Object.prototype.hasOwnProperty.call(stats, id)) {
    return stats[id];
  }

  return base ?? {};
}

function setNatureMod(value) {
  if(value === 'userdef') {
    return natureMod ?? {atk: '1', def: '1', spa: '1', spd: '1', spe: '1'};
  }

  let result = {
    hp: '1',
    atk: '1',
    def: '1',
    spa: '1',
    spd: '1',
    spe: '1',
  };

  let [boosted, lowered] = value.split('/');
  if(boosted === lowered) {
    return result;
  }
  result[boosted] = '1.1';
  result[lowered] = '0.9';
  return result;
}

function onSubmit(ev) {
  ev.preventDefault();
  const results = {};
  ['hp', 'atk', 'def', 'spa', 'spd', 'spe'].forEach((i) => {
    results[i] = getPossibleSet(
      i === 'hp',
      Number(value[i]),
      Number(base[i]),
      Number(level),
      i === 'hp' ? 1 : Number(natureMod[i])
    );
    results[i] = results[i] !== undefined ? results[i] : false;
  });

  const statNames = ['HP','Atk','Def','SpA','SpD','Spe'];
  const fails = statNames.filter(el => !results[el.toLowerCase()]);
  if(fails.length !== 0) {
    output = fails.map(el => `Could not calculate ${el}.`).join(`<br>`);
    return;
  }

  const outLines = [];
  const evLine = statNames
      .filter(el => results[el.toLowerCase()].ev !== 0)
      .map(el => `${results[el.toLowerCase()].ev} ${el}`)
      .join(' / ');
  const ivLine = statNames
      .filter(el => results[el.toLowerCase()].iv !== 31)
      .map(el => `${results[el.toLowerCase()].iv} ${el}`)
      .join(' / ');

  if(evLine !== '') {
    outLines.push(`EVs: ${evLine}`);
  }
  if(ivLine !== '') {
    outLines.push(`IVs: ${ivLine}`);
  }

  console.log(outLines);
  output = outLines.length > 0 ? outLines.join(`<br>`) : '6IV Uninvested';
}

let pokemon = '';
let level = 50;
let nature = 'userdef';
let output = '';

let value = {
  hp: undefined,
  atk: undefined,
  def: undefined,
  spa: undefined,
  spd: undefined,
  spe: undefined,
};

$: natureMod = setNatureMod(nature);
$: base = setBaseStats(pokemon);

</script>

<main>
  <form id="app" on:submit={onSubmit}>
    <h1>Pokémon Set Reverser</h1>
    <div class="group">
      <div>
        <label>
          Pokémon
          <input type="search" list="pokemon" bind:value={pokemon} />
        </label>
      </div>
      <div>
        <label>
          Level
          <input type="number" bind:value={level} />
        </label>
      </div>
      <div>
        <label>
          Nature
          <select bind:value={nature}>
            <option value="userdef" selected>Manual</option>
            <option value="atk/spa">Adamant</option>
            <option value="spa/spa">Bashful</option>
            <option value="def/atk">Bold</option>
            <option value="atk/spe">Brave</option>
            <option value="spd/atk">Calm</option>
            <option value="spd/spa">Careful</option>
            <option value="def/def">Docile</option>
            <option value="spd/def">Gentle</option>
            <option value="atk/atk">Hardy</option>
            <option value="spe/def">Hasty</option>
            <option value="def/spa">Impish</option>
            <option value="spe/spa">Jolly</option>
            <option value="def/spd">Lax</option>
            <option value="atk/def">Lonely</option>
            <option value="spa/def">Mild</option>
            <option value="spa/atk">Modest</option>
            <option value="spe/spd">Naive</option>
            <option value="atk/spd">Naughty</option>
            <option value="spa/spe">Quiet</option>
            <option value="spd/spd">Quirky</option>
            <option value="spa/spd">Rash</option>
            <option value="def/spe">Relaxed</option>
            <option value="spd/spe">Sassy</option>
            <option value="spe/spe">Serious</option>
            <option value="spe/atk">Timid</option>
          </select>
        </label>
      </div>
    </div>
    <table>
      <tbody>
        <tr>
          <td></td>
          <th scope="col">Base:</th>
          <th scope="col">Stat:</th>
        </tr>
        <StatRow
          name="HP"
          longName="Hit Points"
          doesShowNature={false}
          doesSetNature={false}
          doesSetBase={pokemon === ''}
          bind:base={base.hp}
          bind:value={value.hp}
        />
        <StatRow
          name="Atk"
          longName="Attack"
          doesShowNature={true}
          doesSetNature={nature === 'userdef'}
          doesSetBase={pokemon === ''}
          bind:base={base.atk}
          bind:value={value.atk}
          bind:nature={natureMod.atk}
        />
        <StatRow
          name="Def"
          longName="Defence"
          doesShowNature={true}
          doesSetNature={nature === 'userdef'}
          doesSetBase={pokemon === ''}
          bind:base={base.def}
          bind:value={value.def}
          bind:nature={natureMod.def}
        />
        <StatRow
          name="SpA"
          longName="Special Attack"
          doesShowNature={true}
          doesSetNature={nature === 'userdef'}
          doesSetBase={pokemon === ''}
          bind:base={base.spa}
          bind:value={value.spa}
          bind:nature={natureMod.spa}
        />
        <StatRow
          name="SpD"
          longName="Special Defence"
          doesShowNature={true}
          doesSetNature={nature === 'userdef'}
          doesSetBase={pokemon === ''}
          bind:base={base.spd}
          bind:value={value.spd}
          bind:nature={natureMod.spd}
        />
        <StatRow
          name="Spe"
          longName="Speed"
          doesShowNature={true}
          doesSetNature={nature === 'userdef'}
          doesSetBase={pokemon === ''}
          bind:base={base.spe}
          bind:value={value.spe}
          bind:nature={natureMod.spe}
        />
      </tbody>
    </table>
    <button type="submit">Calculate</button>
    {#if output}
    <h2>Results</h2>
    <p>{@html output}</p>
    {/if}
  </form>
</main>
<datalist id="pokemon">
  {#each names as pokemon}
  <option>{pokemon}</option>
  {/each}
</datalist>

