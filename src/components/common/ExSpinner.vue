<template>
    <span class="tool-icon icon-spinner">
    </span>
</template>

<script>
  export default {
    name: 'ex-spinner',
    data () {
      return {
      }
    }
  }
</script>

<style>
  .icon-spinner:before {
    display: inline-block;
    -webkit-animation: rotating 2s linear infinite ;
    animation: rotating 2s linear infinite ;
  }
</style>

