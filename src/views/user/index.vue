<template>
  <t-row :gutter="[24, 24]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          Hi，Image
          <span class="regular"> 下午好，今天是你加入鹅厂的第 100 天～</span>
        </div>
        <img src="@/assets/assets-tencent-logo.png" class="logo" />
      </div>

      <t-card class="user-info-list" title="个人信息">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="edit" size="18" />
          </t-button>
        </template>
        <t-row class="content" justify="space-between">
          <t-col v-for="(item, index) in USER_INFO_LIST" :key="index" class="contract" :span="item.span || 3">
            <div class="contract-title">
              {{ item.title }}
            </div>
            <div class="contract-detail">
              {{ item.content }}
            </div>
          </t-col>
        </t-row>
      </t-card>

      <t-card class="content-container">
        <t-tabs value="second">
          <t-tab-panel value="first" label="内容列表">
            <p>内容列表</p>
          </t-tab-panel>
          <t-tab-panel value="second" label="内容列表">
            <t-card :bordered="false" class="card-padding-no" title="主页访问数据" describe="（次）">
              <template #actions>
                <t-date-range-picker class="card-date-picker-container" :default-value="LAST_7_DAYS" theme="primary"
                  mode="date" @change="onLineChange" />
              </template>
              <div id="lineContainer" style="width: 100%; height: 330px" />
            </t-card>
          </t-tab-panel>
          <t-tab-panel value="third" label="内容列表">
            <p>内容列表</p>
          </t-tab-panel>
        </t-tabs>
      </t-card>
    </t-col>

    <t-col :flex="1">
      <t-card class="user-intro">
        <t-avatar size="90px">T</t-avatar>
        <div class="name">My Account</div>
        <div class="position">XXG 港澳业务拓展组员工 直客销售</div>
      </t-card>

      <t-card title="团队成员" class="user-team">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="edit" size="18" />
          </t-button>
        </template>
        <t-list :split="false">
          <t-list-item v-for="(item, index) in TEAM_MEMBERS" :key="index">
            <t-list-item-meta :image="item.avatar" :title="item.title" :description="item.description" />
          </t-list-item>
        </t-list>
      </t-card>

      <t-card title="服务产品" class="product-container">
        <template #actions>
          <t-button theme="default" shape="square" variant="text">
            <t-icon name="edit" size="18" />
          </t-button>
        </template>
        <t-row class="content" :getters="16">
          <t-col v-for="(item, index) in PRODUCT_LIST" :key="index" :span="3">
            <component :is="getIcon(item)"></component>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>
</template>
<script lang="ts">
export default {
  name: 'UserIndex',
};
</script>
<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, watch, computed } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useSettingStore } from '@/store';

import { LAST_7_DAYS } from '@/utils/date';
import { USER_INFO_LIST, TEAM_MEMBERS, PRODUCT_LIST } from './constants';
import { getFolderLineDataSet } from './index';
import ProductAIcon from '@/assets/assets-product-1.svg';
import ProductBIcon from '@/assets/assets-product-2.svg';
import ProductCIcon from '@/assets/assets-product-3.svg';
import ProductDIcon from '@/assets/assets-product-4.svg';
import { changeChartsTheme } from '@/utils/color';

echarts.use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

let lineContainer: HTMLElement;
let lineChart: echarts.ECharts;
const store = useSettingStore();
const chartColors = computed(() => store.chartColors);

const onLineChange = (value) => {
  lineChart.setOption(getFolderLineDataSet(value));
};

const initChart = () => {
  lineContainer = document.getElementById('lineContainer');
  lineChart = echarts.init(lineContainer);
  lineChart.setOption({
    grid: {
      x: 30, // 默认是80px
      y: 30, // 默认是60px
      x2: 10, // 默认80px
      y2: 30, // 默认60px
    },
    ...getFolderLineDataSet({ ...chartColors.value }),
  });
};

const updateContainer = () => {
  lineChart?.resize({
    width: lineContainer.clientWidth,
    height: lineContainer.clientHeight,
  });
};

onMounted(() => {
  nextTick(() => {
    initChart();
  });
  window.addEventListener('resize', updateContainer, false);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateContainer);
});

const getIcon = (type) => {
  switch (type) {
    case 'a':
      return ProductAIcon;
    case 'b':
      return ProductBIcon;
    case 'c':
      return ProductCIcon;
    case 'd':
      return ProductDIcon;
    default:
      return ProductAIcon;
  }
};

watch(
  () => store.brandTheme,
  () => {
    changeChartsTheme([lineChart]);
  },
);
</script>

<style lang="less" scoped>
@import '@/style/variables';

:deep(.t-card__title) {
  font-size: 20px;
  font-weight: 500;
}

.user-left-greeting {
  padding: 28px 32px;
  line-height: 28px;
  font-size: 20px;
  background: var(--td-bg-color-container);
  color: var(--td-text-color-primary);
  text-align: left;
  border-radius: @border-radius;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .regular {
    margin-right: 15px;
    font-size: 14px;
  }

  .logo {
    width: 180px;
  }
}

.user-info-list {
  margin-top: 16px;

  .content {
    width: 90%;
  }

  .contract {
    width: 340px;
    height: 88px;
    border-radius: @border-radius;
    margin: 8px 0;

    &-title {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 24px;
      margin: 20px 0 6px;
      font-size: 14px;
      color: var(--td-text-color-placeholder);
    }

    &-detail {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      line-height: 40px;
      font-size: 14px;
      color: var(--td-text-color-secondary);
    }
  }

  .contract:last-child {
    margin-bottom: 0;
  }
}

.user-intro {
  padding: 32px 24px;
  background: var(--td-brand-color);
  border-radius: @border-radius;
  color: var(--td-text-color-primary);

  .name {
    line-height: 37px;
    font-size: 20px;
    margin-top: 36px;
    color: #fff;
  }

  .position {
    line-height: 24px;
    font-size: 14px;
    margin-top: 8px;
    color: #fff;
  }

  .user-info {
    line-height: 24px;
    font-size: 14px;
    color: var(--td-text-color-primary);

    .hiredate,
    .del,
    .mail {
      display: flex;
    }

    .t-icon {
      height: 24px;
      margin-right: 8px;
    }

    .del {
      margin: 16px 0;
    }
  }
}

.product-container {
  margin-top: 16px;
  border-radius: @border-radius;

  .content {
    width: 100%;
    margin: 24px 0 12px;
  }

  .logo {
    width: 48px;
  }
}

.content-container {
  margin-top: 16px;
  background: var(--td-bg-color-container);
  border-radius: @border-radius;
}

.user-team {
  margin-top: 16px;

  .t-list-item {
    padding: 15px 0;

    .t-list-item__meta-avatar {
      height: 50px;
      width: 50px;
      margin: 0 24px 0 0;
    }

    .t-list-item__meta-description {
      display: inline-block;
      color: rgb(0 0 0 / 40%);
      font-size: 14px;
    }
  }
}
</style>
