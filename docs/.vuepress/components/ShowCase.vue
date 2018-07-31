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
  margin: 2rem 0;
  text-decoration: none !important;
  text-align: center;
  color: black;
  min-width: 14rem;
  max-width: 25%;

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
    border: none;
  }
}
</style>

