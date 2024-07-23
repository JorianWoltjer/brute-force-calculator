<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';

  import Fa from 'svelte-fa'
  import { faArrowsLeftRight, faHashtag, faXmark, faGauge, faCalculator, faBars } from '@fortawesome/free-solid-svg-icons'
  import { math } from 'mathlifier';

  import { expandRange, generateExamples, selectOnFocus, settingsFromExamples, formatBigNumber, validateInteger, validateFloat } from "$lib/utils";
  import { Time, Label, Separator } from "$lib/components";

  const initial = {
    rate: 1000,
    length: 6,
    charset: "0-9",
    targets: 1,
    collision: false,
  }

  const rate = writable(initial.rate);
  const interval = writable(1000 / $rate);
  const length = writable(initial.length);
  let charset = initial.charset;
  const targets = writable(initial.targets);
  let collision = initial.collision;

  const setRate = (value) => {
    rate.set(value);
  }
  const setInterval = (value) => {
    interval.set(value);
  }
  $: setRate(1000 / $interval);
  $: setInterval(1000 / $rate);

  $: charsetFull = expandRange(charset);
  $: charsetLength = charsetFull.length;
  $: amount = (() => {
    // range^length
    let amount = BigInt(charsetLength||0)**BigInt($length||0);

    if (collision) {  // Birthday Problem
      return Math.floor(Math.sqrt(Math.PI / 2 * Number(amount)));
    } else {
      return amount / BigInt(($targets||0)+1);
    }
  })();
  $: time = Number(amount) / $rate;
  $: examples = generateExamples(3, $length, charsetFull);

  // Save state in URL
  let loaded = false;
  $: if (loaded) {
    const params = { rate: $rate, length: $length, charset, targets: $targets, collision };
    // Only save what changed
    for (const key in params) if (params[key] === initial[key]) delete params[key];
    // Only save if there are changes
    if (Object.keys(params).length !== 0 || location.hash) {
      location.replace('#' + new URLSearchParams(params))
    }
  };
  // Load state from URL
  onMount(() => {
    const params = new URLSearchParams(location.hash.slice(1));
    if (params.has('rate')) rate.set(Number(params.get('rate')));
    if (params.has('length')) length.set(Number(params.get('length')));
    if (params.has('charset')) charset = params.get('charset');
    if (params.has('targets')) targets.set(Number(params.get('targets')));
    if (params.has('collision')) collision = params.get('collision') === "true";
    loaded = true;
  });
</script>

<h1><a href="https://github.com/JorianWoltjer/brute-force-calculator" target="_blank">Brute Force Calculator</a></h1>
<p class="subtitle">Calculate the time it would take to brute force a string given a certain search space and speed.</p>

<Separator icon={faGauge} color="#e74c3c">Speed</Separator>
<Label for="rate" tooltip="Number of requests per second">Rate</Label>
<input type="number" id="rate" bind:value={$rate} step="any" use:validateFloat={rate} /> /s
<Fa icon={faArrowsLeftRight} />
<Label for="interval" tooltip="Time between requests">Interval</Label>
<input type="number" id="interval" bind:value={$interval} step="any" use:validateFloat={rate} /> ms
<small class="hint"><b>Tip: </b>Over a network, asyncronous requests and distributed IPs can drastically increase the rate even when limited.
  In local attacks, use fast algorithms and multiprocessing.</small>

<Separator icon={faBars} color="#f1c40f">Search Space</Separator>
<div class="inputs-row">
<label for="length">Length:</label>
<input class="w-small" type="number" id="length" bind:value={$length} use:selectOnFocus use:validateInteger={length} />
<Fa icon={faXmark} />
<Label for="charset" tooltip="List of characters per index. Can use ranges like '0-9' or loose letters like 'abc'">Charset</Label>
<div class="w-large">
  <input style="width: min(calc(400px - 2*8px), 100%);" type="text" id="charset" bind:value={charset} list="charsets" />
  <br />
  <datalist id="charsets">
    <option value="0-9"></option>
    <option value="0-9A-Z"></option>
    <option value="a-z"></option>
    <option value="0-9A-Za-z"></option>
  </datalist>
  <span style="overflow-wrap: anywhere" class="monospace muted">{charsetFull}</span>
</div>
<Fa icon={faHashtag} />
<input class="w-small" type="number" id="charset-length" bind:value={charsetLength} use:selectOnFocus />
</div>
<Label for="examples" tooltip="View examples of settings or paste examples to extract settings!">Examples</Label>
<br>
<!-- svelte-ignore a11y-autofocus -->
<textarea name="examples" id="examples" rows="3" class="w-full" style="resize: vertical" data-gramm="false" spellcheck="false" autofocus 
  use:selectOnFocus on:change={(e) => {
  const { length: length_, charset: charset_ } = settingsFromExamples(e.target.value);
  length.set(length_);
  charset = charset_;
}}>
{examples.join("\n")}</textarea>
<br /><br />
<span>
  <Label for="targets" tooltip="Number of strings to find in the search space">Targets</Label>
  <input type="number" id="targets" bind:value={$targets} use:selectOnFocus use:validateInteger={targets} disabled={collision} />
</span>
<input type="checkbox" name="mode" id="collision" bind:checked={collision}>
<Label for="collision" tooltip="Find when two of the same strings will be generated (aka. Birthday Problem)" nocolon><span style="user-select: none">Collision</span></Label>

<Separator icon={faCalculator} color="#3498db" direction="right">Results</Separator>
<table class="results">
  <tr><td># of strings:</td>
    <td style="text-align: center;"><span class="muted">{@html math((() => {
      const amount = `${charsetLength}^{${$length}}`;
      if (collision) {  // Birthday Problem
        return `\\sqrt{\\frac{\\pi}{2} \\times ${amount}}`;
      } else {
        return `${amount}/${$targets+1}`;
      }
    })())} =</span></td>
    <td style="text-align: right;"><u class="click-select">{formatBigNumber(amount)}</u></td>
  </tr>
  <tr><td><b>Expected time</b>:</td>
    <td style="text-align: center;"><span class="muted">{@html math(`\\frac{${formatBigNumber(amount, true)}}{${$rate}}`)} =</span></td>
    <td style="text-align: right;"><span class="click-select"><Time {time} /></span></td>
  </tr>
</table>
<br />
<br />
<br />
<button on:click={() => {
    rate.set(initial.rate);
    length.set(initial.length);
    charset = initial.charset;
    targets.set(initial.targets);
    collision = initial.collision;
  }}>Reset</button>
