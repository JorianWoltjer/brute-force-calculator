<script>
  import { writable } from 'svelte/store';

  import Fa from 'svelte-fa'
  import { faArrowsLeftRight, faHashtag, faXmark, faGauge, faCalculator, faBars } from '@fortawesome/free-solid-svg-icons'
  import { math } from 'mathlifier';

  import { expandRange, generateExamples, selectOnFocus, settingsFromExamples, formatBigNumber, validateInteger, validateFloat } from "$lib/utils";
	import { Time, Label, Separator } from "$lib/components";

  let charset = "0-9";

  const rate = writable(1000);
  const length = writable(6);
  const interval = writable(1000 / $rate);
  const mode = writable("target");

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

    if ($mode === "collision") {  // Birthday Problem
      return Math.floor(Math.sqrt(Math.PI / 2 * Number(amount)));
    } else {
      return amount;
    }
  })();
  $: time = Number(amount) / $rate;

  $: examples = generateExamples(3, $length, charsetFull);
</script>

<h1>Brute Force Calculator</h1>
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
<textarea name="examples" id="examples" rows="3" class="w-full" style="resize: vertical" data-gramm="false" autofocus 
  use:selectOnFocus on:change={(e) => {
  const { length: length_, charset: charset_ } = settingsFromExamples(e.target.value);
  length.set(length_);
  charset = charset_;
}}>
{examples.join("\n")}</textarea>
<br /><br />
<label for="mode">Mode:</label>
<br />
<input type="radio" name="mode" id="target" checked on:change={() => mode.set("target")}>
<Label for="target" tooltip="When a specific string will be generated" nocolon><i>Target</i></Label>
<br />
<input type="radio" name="mode" id="collision" on:change={() => mode.set("collision")}>
<Label for="collision" tooltip="When two of the same strings are generated (aka. Birthday Problem)" nocolon><i>Collision</i></Label>

<Separator icon={faCalculator} color="#3498db">Results</Separator>
<p># of strings:
  <span class="muted">{@html math((() => {
    const amount = `${charsetLength}^{${$length}}`;
    if ($mode === "collision") {  // Birthday Problem
      return `\\sqrt{\\frac{\\pi}{2} \\times ${amount}}`;
    } else {
      return amount;
    }
  })())} =</span>
  <u class="click-select">{formatBigNumber(amount)}</u>
</p>
<p><b>Expected time</b>:
  <span class="muted">{@html math(`\\frac{${formatBigNumber(amount, true)}}{${$rate}}`)} =</span>
  <span class="click-select"><Time {time} /></span>
</p>
