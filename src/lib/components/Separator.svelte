<script>
  import Fa from 'svelte-fa'

  export let icon;
  export let color = 'var(--muted)';
</script>

<div class="separator">
  <span class="separator-text"><Fa style="color: {color}" icon={icon} /><slot /></span>
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
.separator:not(:empty)::before {
  /* flex: 1; */
  width: 40px;
  margin-right: 0.25em;
}
.separator:not(:empty)::after {
  flex: 10;
  margin-left: 0.25em;
}
.separator-text {
  padding: 0 6px;
  font-size: 18px;
  font-weight: bold;
}
.separator :global(.svelte-fa) {
  margin-left: 0;
}
</style>
