<template>
  <div :class="store.darkMode ? 'dark-mode' : ''">
    <!-- Auth Pages Layout (Login, Reset Password) -->
    <template v-if="isAuthRoute">
      <router-view />
    </template>

    <!-- Sneat Main Dashboard Layout -->
    <template v-else>
      <div class="layout-wrapper layout-content-navbar">
        <div class="layout-container">
          <!-- Sidebar -->
          <SneatSidebar />

          <!-- Main Page Container -->
          <div class="layout-page">
            <!-- Navbar -->
            <SneatNavbar />

            <!-- Content Area -->
            <div class="content-wrapper">
              <div class="container-xxl flex-grow-1">
                <router-view />
              </div>
            </div>

            <!-- Footer -->
            <SneatFooter />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useGuruStore } from './stores/guruStore';
import SneatSidebar from './components/layout/SneatSidebar.vue';
import SneatNavbar from './components/layout/SneatNavbar.vue';
import SneatFooter from './components/layout/SneatFooter.vue';

const route = useRoute();
const store = useGuruStore();

const isAuthRoute = computed(() => {
  return route.path === '/login' || route.path === '/reset-password';
});

onMounted(() => {
  store.initTheme();
});
</script>

<style>
/* Global Sneat layout adjustments */
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
