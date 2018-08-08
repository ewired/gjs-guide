<template>
  <div class="showcase-box">
    <div class="showcase-box-title-container">
      <h2 class="showcase-box-title">{{ title }}</h2>
      <p class="showcase-box-subtitle">{{ subtitle }}</p>
    </div>

    <div class="showcase-box-inner">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String },
    subtitle: { type: String }
  }
};
</script>

<style lang="scss">
$height: 30vh;

.showcase-box {
  padding: 2rem 0;
  overflow: hidden;

  .showcase-box-title-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
  }

  .showcase-box-title {
    font-size: 3rem;
    padding-bottom: 0.1rem;
    margin: 0.1rem 0 0.2rem;
    border: none !important;
  }

  .showcase-box-subtitle {
    padding: 0;
    margin: 0.1rem 0.5rem 0.2rem;
    border: none !important;
    font-style: italic;
  }

  .showcase-box-inner {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;
    margin: 0 -3rem;

    & > * {
      margin: 1rem 3rem;
    }
  }
}
</style>

