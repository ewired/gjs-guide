<template>
    <div class="showcase-box">
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>

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
  padding: 2rem;

  .showcase-box-inner {
    display: flex;

    & > *:last-child {
      padding-right: 0 !important;
    }
    & > *:first-child {
      padding-left: 0 !important;
    }
  }
}
</style>

