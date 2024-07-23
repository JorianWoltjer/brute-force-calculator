<script>
  import Fa from 'svelte-fa'

  export let icon;
  export let color = 'var(--muted)';
  export let direction = 'left';
</script>

<div class="separator {direction}">
  <span class="separator-text">
    {#if icon && direction === 'left'}
      <Fa icon={icon} color={color} />
    {/if}
    <slot />
    {#if icon && direction === 'right'}
      <Fa icon={icon} color={color} />
    {/if}
  </span>
</div>

<style>
.separator {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 20px 0;
}
.separator::before,
.separator::after {
  content: '';
  border-bottom: 2px solid var(--muted);
}
.separator.left::before, .separator.right::after {
  width: 40px;
}
.separator.left::after, .separator.right::before {
  flex: 1;
}
.separator-text {
  padding: 0 8px;
  font-size: 18px;
  font-weight: bold;
}
.separator.left :global(.svelte-fa) {
  margin: 0;
  margin-right: 0.25em;
}
.separator.right :global(.svelte-fa) {
  margin: 0;
  margin-left: 0.25em;
}
</style>
