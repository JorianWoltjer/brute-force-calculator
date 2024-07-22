<script>
  export let time;

  $: milliseconds = Math.floor(time * 1000);
  $: seconds = Math.floor(time);
  $: minutes = Math.floor(time / 60);
  $: hours = Math.floor(minutes / 60);
  $: days = Math.floor(hours / 24);
  $: weeks = Math.floor(days / 7);
  $: months = Math.floor(weeks / 4);
  $: years = Math.floor(months / 12);
  $: universe_lifetimes = Math.floor(years / 13.8e9);
  $: universe_heat_deaths = Math.floor(years / 1.7e106);

  $: s = (() => {
    let units = [
      { unit: "millisecond", difficulty: "very-easy", value: milliseconds },
      { unit: "second", difficulty: "very-easy", value: seconds },
      { unit: "minute", difficulty: "easy", value: minutes },
      { unit: "hour", difficulty: "medium", value: hours },
      { unit: "day", difficulty: "hard", value: days },
      { unit: "week", difficulty: "hard", value: weeks },
      { unit: "month", difficulty: "very-hard", value: months },
      { unit: "year", difficulty: "impossible", value: years },
      { unit: "universe lifetime", difficulty: "impossible", value: universe_lifetimes },
      { unit: "universe heat death", difficulty: "impossible", value: universe_heat_deaths },
    ];

    for (let i = 0; i < units.length; i++) {
      // Find first sensible unit
      if (typeof units[i+1] === 'undefined' || units[i+1].value < 1) {
        const unit = units[i];
        unit.unit += unit.value > 1 ? "s" : "";
        return unit;
      }
    }
  })();
</script>

<span class="result" style="color: var(--difficulty-{s.difficulty})">
  {s.value >= 1 ? `${s.value} ${s.unit}` : "instant"}
</span>

<style>
  .result {
    font-weight: bold;
    text-decoration: underline;
  }
</style>
