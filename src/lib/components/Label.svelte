<script>
  import Fa from 'svelte-fa'
  import { faQuestion } from '@fortawesome/free-solid-svg-icons'

  let for_;
  export { for_ as for };
  export let tooltip;
</script>

<label for={for_} data-tooltip={tooltip}>
  <slot /><sup class="icon"><Fa icon={faQuestion} /></sup>:
</label>

<style>
  .icon :global(.svelte-fa) {
    margin: 0;
    font-size: smaller;
  }
</style>
