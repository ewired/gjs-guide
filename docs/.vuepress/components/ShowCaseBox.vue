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
.showcase-box {
  padding: 2rem 0;

  .showcase-box-title-container {
    border-bottom: 1px solid #eaecef;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: baseline;
  }

  .showcase-box-title {
    font-size: 1.65rem;
    padding-bottom: 0.1rem;
    margin: 0.1rem 0 0.2rem;
    border: none !important;
  }

  .showcase-box-subtitle {
    padding: 0;
    margin: 0.1rem 0.5rem 0.2rem;
    border: none !important;
  }

  .showcase-box-inner {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    width: 100%;

    & > *:last-child {
      margin-right: 0 !important;
    }
    & > *:first-child {
      margin-left: 0 !important;
    }
  }
}
</style>

