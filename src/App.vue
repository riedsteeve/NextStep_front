<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { Analytics } from '@vercel/analytics/vue'
</script>

<template>
  <router-view></router-view>
  <Analytics />
</template>
