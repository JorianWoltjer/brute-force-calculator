<script>
  import { writable } from 'svelte/store';

  import Fa from 'svelte-fa'
  import { faArrowsLeftRight, faHashtag, faPlus } from '@fortawesome/free-solid-svg-icons'

  import { expandRange, generateExamples, selectOnFocus, settingsFromExamples, formatBigNumber, validateInteger, validateFloat } from "$lib/utils";
	import Time from "./Time.svelte";

  let charset = "0-9";

  const rate = writable(1000);
  const length = writable(6);
  const interval = writable(1000 / $rate);

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
  $: amount = BigInt(charsetLength)**BigInt($length||0);
  $: time = Number(amount) / $rate;

  $: examples = generateExamples(3, $length, charsetFull);
</script>

<h1>Brute Force Calculator</h1>

<label for="rate">Rate:</label>
<input type="number" id="rate" bind:value={$rate} step="any" use:validateFloat={rate} /> /s
<Fa icon={faArrowsLeftRight} />
<label for="interval">Interval:</label>
<input type="number" id="interval" bind:value={$interval} step="any" use:validateFloat={rate} /> ms
<hr>
<label for="length">Length:</label>
<input class="w-small" type="number" id="length" bind:value={$length} use:selectOnFocus use:validateInteger={length} />
<Fa icon={faPlus} />
<label for="charset">Charset:</label>
<input class="w-large" type="text" id="charset" bind:value={charset} list="charsets" />
<datalist id="charsets">
  <option value="0-9"></option>
  <option value="0-9A-Z"></option>
  <option value="a-z"></option>
  <option value="0-9A-Za-z"></option>
</datalist>
<Fa icon={faHashtag} />
<input class="w-small" type="number" id="charset-length" bind:value={charsetLength} use:selectOnFocus />
<br>
<label for="charset-expanded">Charset (expanded):</label>
<span id="charset-expanded"><span class="monospace">{charsetFull}</span></span>
<br>
<br>
<label for="examples">Examples:</label>
<br>
<textarea name="examples" id="examples" rows="3" class="w-full" use:selectOnFocus on:change={() => {
  const { length_, charset_ } = settingsFromExamples(event.target.value);
  length.set(length_);
  charset = charset_;
}}>
{examples.join("\n")}</textarea>
<hr>
<p># of possible strings: <u>{formatBigNumber(amount)}</u></p>
<p>Time to brute force: <Time {time} /></p>
