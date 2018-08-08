<template>
  <a v-if="typeof link !== 'undefined' && link !== null" class="showcase" :href="link">
    <img v-if="image" class="showcase-image" :src="image">
    </img>
    <div class="showcase-title">{{ title }}</div>
    <div class="showcase-description">{{ subtitle }}</div>
  </a>
  <div v-else class="showcase">
    <img v-if="image" class="showcase-image" :src="image">
    </img>
    <div class="showcase-title">{{ title }}</div>
    <div class="showcase-description">{{ subtitle }}</div>
  </div>
</template>
<script>
export default {
  props: {
    image: { type: String },
    link: { type: String },
    title: { type: String },
    subtitle: { type: String }
  }
};
</script>


<style lang="scss">
.showcase {
  text-decoration: none !important;
  text-align: left;
  color: black;
  min-width: 14rem;
  max-width: 25%;
  max-height: 23rem;
  overflow: hidden;

  .showcase-image {
    margin: 0.5rem;
    object-fit: cover;
    height: 30vh;
    max-height: 30vh;
    overflow: hidden;
    width: 100%;
  }

  .showcase-description {
    font-size: 1rem;
    font-weight: 400;
    margin: 0.25rem 0.5rem 0.5rem 0;
    text-overflow: ellipsis;
  }

  .showcase-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0.5rem 0.5rem 0.25rem 0;
    border: none;
  }
}
</style>

