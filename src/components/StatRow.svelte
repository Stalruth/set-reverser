<script>
export let name = 'Atk';
export let longName = 'Attack';
export let doesShowNature = false;
export let doesSetNature = false;
export let doesSetBase = false;
export let base = undefined;
export let value = undefined;
export let nature = '1';
</script>

<tr>
  <th scope="row">
    {name}
  </th>
  <td>
    <input type='number' bind:value={base} disabled={doesSetBase ? '' : 'disabled'} aria-label={"Base " + longName} />
  </td>
  <td>
    <input type='number' bind:value={value} aria-label={longName + " stat"} />
  </td>
  <td>
    {#if doesShowNature}
      <select bind:value={nature} disabled={doesSetNature ? '' : 'disabled'} aria-label={longName + " Nature modifier"}>
        <option value='1'>-</option>
        <option value='1.1'>1.1x</option>
        <option value='0.9'>0.9x</option>
      </select>
    {/if}
  </td>
</tr>
