<template>
  <div>
    <template v-if="setting.layout.value === 'side'">
      <t-layout key="side" :class="mainLayoutCls">
        <t-aside><layout-aside /></t-aside>
        <t-layout>
          <t-header><layout-header /></t-header>
          <t-content><layout-main /></t-content>
        </t-layout>
      </t-layout>
    </template>

    <template v-else>
      <t-layout key="no-side">
        <t-header><layout-header /></t-header>
        <t-layout :class="mainLayoutCls">
          <layout-aside />
          <layout-main />
        </t-layout>
      </t-layout>
    </template>
    <setting-com />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useSettingStore, useTabsRouterStore } from '@/store';

import SettingCom from './setting.vue';
import LayoutHeader from '@/layout/header/index.vue';
import LayoutAside from '@/layout/aside/index.vue';
import LayoutMain from '@/layout/main/index.vue';

import { prefix } from '@/config/global';

import '@/style/layout.less';

const route = useRoute();
const settingStore = useSettingStore();
const tabsRouterStore = useTabsRouterStore();
const setting = storeToRefs(settingStore);

const mainLayoutCls = computed(() => [
  {
    't-layout--with-sider': settingStore.showSidebar,
  },
]);

const appendNewRoute = () => {
  const {
    path,
    query,
    meta: { title },
    name,
  } = route;
  tabsRouterStore.appendTabRouterList({ path, query, title: title as string, name, isAlive: true });
};

onMounted(() => {
  appendNewRoute();
});

watch(
  () => route.path,
  () => {
    appendNewRoute();
    document.querySelector(`.${prefix}-layout`).scrollTo({ top: 0, behavior: 'smooth' });
  },
);
</script>

<style lang="less">
.t-layout__header {
  height: 60px;
}
.t-head-menu__inner {
  height: 60px;
}
.t-default-menu__inner .t-menu__logo:not(:empty) {
  height: 60px;
}
.t-head-menu .t-menu__operations:not(:empty) {
  height: 60px;
  line-height: 60px;
}
.tdesign-starter-side-nav-mix-fixed {
  top: 60px;
}
.t-tabs__nav-item.t-size-m {
  height: 35px;
  line-height: 35px;
  font-size: 12px;
}
.t-tabs__btn.t-size-m {
  height: 35px;
  line-height: 35px;
}
.t-tabs__nav--card.t-tabs__nav-item {
  border-left: 1px solid #e7e7e7 !important;
}
.t-default-menu__inner .t-menu__logo:not(:empty) {
  border-bottom: 1px solid #fff;
}
</style>
