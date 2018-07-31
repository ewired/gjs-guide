<template>
  <a v-if="typeof link !== 'undefined' && link !== null" class="showcase" :href="link">
    <img :src="image">
    </img>
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>
  </a>
  <div v-else class="showcase">
    <img :src="image">
    </img>
    <h2>{{ title }}</h2>
    <p>{{ subtitle }}</p>
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
  margin: 2rem;
  text-decoration: none !important;
  color: black;

  img {
    margin: 0.5rem;
  }
  p {
    font-weight: 400;
    margin: 0.25rem 0.5rem 0.5rem;
  }
  h2 {
    font-weight: 600;
    margin: 0.5rem 0.5rem 0.25rem;
  }
}
</style>

