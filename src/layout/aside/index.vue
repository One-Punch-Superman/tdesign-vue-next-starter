<template>
  <div v-if="settingStore.showSidebar" :class="sideNavCls">
    <t-menu :class="menuCls" :theme="settingStore.mode" :value="active" :collapsed="collapsed">
      <template #logo>
        <span v-if="settingStore.showSidebarLogo" :class="`${prefix}-side-nav-logo-wrapper`" @click="goHome">
          <component :is="getLogo()" :class="`${prefix}-side-nav-logo-${collapsed ? 't' : 'tdesign'}-logo`" />
        </span>
      </template>
      <menu-content :nav-data="sideMenu" />
    </t-menu>
    <div :class="`${prefix}-side-nav-placeholder${collapsed ? '-hidden' : ''}`"></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { usePermissionStore, useSettingStore } from '@/store';
import { prefix } from '@/config/global';
import { getActive } from '@/router';

import AssetLogo from '@/assets/assets-t-logo.svg?component';
import AssetLogoFull from '@/assets/assets-logo-full.svg?component';
import MenuContent from './MenuContent.vue';

const router = useRouter();
const route = useRoute();
const MIN_POINT = 992 - 1;

const permissionStore = usePermissionStore();
const settingStore = useSettingStore();
const { routers: menuRouters } = storeToRefs(permissionStore);

const sideMenu = computed(() => {
  const { layout, splitMenu } = settingStore;
  let newMenuRouters = menuRouters.value;
  if (layout === 'mix' && splitMenu) {
    newMenuRouters.forEach((menu) => {
      if (route.path.indexOf(menu.path) === 0) {
        newMenuRouters = menu.children.map((subMenu) => ({ ...subMenu, path: `${menu.path}/${subMenu.path}` }));
      }
    });
  }
  return newMenuRouters;
});

const collapsed = computed(() => useSettingStore().isSidebarCompact);

const active = computed(() => getActive());

const sideNavCls = computed(() => {
  return [
    `${prefix}-sidebar-layout`,
    {
      [`${prefix}-sidebar-compact`]: settingStore.isSidebarCompact,
    },
  ];
});

const menuCls = computed(() => {
  return [
    `${prefix}-side-nav`,
    {
      [`${prefix}-side-nav-no-logo`]: !settingStore.showSidebarLogo,
      [`${prefix}-side-nav-mix-fixed`]: settingStore.layout === 'mix',
    },
  ];
});

const autoCollapsed = () => {
  const isCompact = window.innerWidth <= MIN_POINT;
  settingStore.updateConfig({
    isSidebarCompact: isCompact,
  });
};

onMounted(() => {
  autoCollapsed();
  window.onresize = () => {
    autoCollapsed();
  };
});

const goHome = () => {
  router.push('/dashboard/base');
};

const getLogo = () => {
  if (collapsed.value) return AssetLogo;
  return AssetLogoFull;
};
</script>

<style lang="less" scoped>

</style>
