<template>
  <div class="page">
    <slot name="top" />
    <Content class="index-page-padding" :custom="true" />
    <div class="index-page-edit">
      <div class="edit-link" v-if="editLink">
        <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
        <OutboundLink/>
      </div>
      <div class="last-updated" v-if="lastUpdated">
        <span class="prefix">{{ lastUpdatedText }}: </span>
        <span class="time">{{ lastUpdated }}</span>
      </div>
    </div>
    <slot name="bottom" />
  </div>
</template>

<script>
import { resolvePage, normalize, outboundRE, endingSlashRE } from './util';
import Page from './Page';

export default {
  extends: Page
};
</script>

<style lang="scss">
@import './styles/config.scss';
@import './styles/wrapper.scss';

.index-page-edit {
  padding: 1rem 5rem !important;
  overflow: auto;
  .edit-link {
    display: inline-block;
    a {
      color: lighten($textColor, 25%);
      margin-right: 0.25rem;
    }
  }
  .last-updated {
    float: right;
    font-size: 0.9em;
    .prefix {
      font-weight: 500;
      color: lighten($textColor, 25%);
    }
    .time {
      font-weight: 400;
      color: #aaa;
    }
  }
}

.index-page-padding {
  padding: 1rem 5rem !important;
}
</style>
