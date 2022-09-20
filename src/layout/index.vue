<template>
  <div>
    <template v-if="setting.layout.value === 'side'">
      <t-layout>
        <t-aside>
          <layout-aside />
        </t-aside>
        <t-layout>
          <t-header>
            <layout-header />
          </t-header>
          <t-content>
            <layout-main />
          </t-content>
        </t-layout>
      </t-layout>
    </template>

    <template v-else>
      <t-layout>
        <t-header>
          <layout-header />
        </t-header>
        <t-layout :class="mainLayoutCls">
          <layout-aside />
          <layout-main />
        </t-layout>
      </t-layout>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useSettingStore, useTabsRouterStore } from '@/store';

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

<style lang="less" scoped>

</style>
