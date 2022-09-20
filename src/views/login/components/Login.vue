<template>
  <t-form ref="form" :class="['item-container', `login-${type}`]" :data="formData" :rules="FORM_RULES" label-width="0"
    @submit="onSubmit">
    <template v-if="type == 'password'">
      <t-form-item name="account">
        <t-input v-model="formData.account" size="large" placeholder="请输入账号：admin">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input v-model="formData.password" size="large" :type="showPsw ? 'text' : 'password'" clearable
          placeholder="请输入登录密码：admin">
          <template #prefix-icon>
            <t-icon name="lock-on" />
          </template>
          <template #suffix-icon>
            <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
          </template>
        </t-input>
      </t-form-item>

      <div class="check-container remember-pwd">
        <t-checkbox>记住账号</t-checkbox>
        <span class="tip">忘记账号？</span>
      </div>
    </template>

    <!-- 扫码登陆 -->
    <template v-else-if="type == 'qrcode'">
      <div class="tip-container">
        <span class="tip">请使用微信扫一扫登录</span>
        <span class="refresh">刷新
          <t-icon name="refresh" />
        </span>
      </div>
      <qrcode-vue value="" :size="192" level="H" />
    </template>

    <!-- 手机号登陆 -->
    <template v-else>
      <t-form-item name="phone">
        <t-input v-model="formData.phone" size="large" placeholder="请输入手机号码">
          <template #prefix-icon>
            <t-icon name="mobile" />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="countDown > 0" @click="sendCode">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button block size="large" type="submit"> 登录 </t-button>
    </t-form-item>

    <div class="switch-container">
      <span v-if="type !== 'password'" class="tip" @click="switchType('password')">使用账号密码登录</span>
      <span v-if="type !== 'qrcode'" class="tip" @click="switchType('qrcode')">使用微信扫码登录</span>
      <span v-if="type !== 'phone'" class="tip" @click="switchType('phone')">使用手机号登录</span>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import QrcodeVue from 'qrcode.vue';
import { FormInstanceFunctions, MessagePlugin } from 'tdesign-vue-next';
import { useCounter } from '@/hooks';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const INITIAL_DATA = {
  phone: '',
  account: 'admin',
  password: 'admin',
  verifyCode: '',
  checked: false,
};

const FORM_RULES = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  account: [{ required: true, message: '账号必填', type: 'error' }],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
};

const type = ref('password');

const form = ref<FormInstanceFunctions>();
const formData = ref({ ...INITIAL_DATA });
const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const switchType = (val: string) => {
  type.value = val;
};

const router = useRouter();

/**
 * 发送验证码
 */
const sendCode = () => {
  form.value.validate({ fields: ['phone'] }).then((e) => {
    if (e === true) {
      handleCounter();
    }
  });
};

const onSubmit = async ({ validateResult }) => {
  if (validateResult === true) {
    try {
      await userStore.login(formData.value);

      MessagePlugin.success('登陆成功');
      router.push({
        path: '/dashboard/base',
      });
    } catch (e) {
      console.log(e);
      MessagePlugin.error(e.message);
    }
  }
};
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.light {
  &.login-wrapper {
    background-color: white;
    background-image: url('@/assets/assets-login-bg-white.png');
  }
}

.dark {
  &.login-wrapper {
    background-color: var(--td-bg-color-page);
    background-image: url('@/assets/assets-login-bg-black.png');
  }
}

.login-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-size: cover;
  background-position: 100%;
  position: relative;
}

.login-container {
  position: absolute;
  top: 22%;
  left: 5%;
  min-height: 500px;
  line-height: 22px;
}

.title-container {
  .title {
    font-size: 36px;
    line-height: 44px;
    color: var(--td-text-color-primary);
    margin-top: 4px;

    &.margin-no {
      margin-top: 0;
    }
  }

  .sub-title {
    margin-top: 16px;

    .tip {
      display: inline-block;
      margin-right: 8px;
      font-size: 14px;

      &:first-child {
        color: var(--td-text-color-secondary);
      }

      &:last-child {
        color: var(--td-text-color-primary);
        cursor: pointer;
      }
    }
  }
}

.item-container {
  width: 400px;
  margin-top: 48px;

  &.login-qrcode {
    .tip-container {
      width: 192px;
      margin-bottom: 16px;
      font-size: 14px;
      display: flex;
      justify-content: space-between;

      .tip {
        color: var(--td-text-color-primary);
      }

      .refresh {
        display: flex;
        align-items: center;
        color: var(--td-brand-color);

        .t-icon {
          font-size: 14px;
          margin-left: 4px;
        }

        &:hover {
          cursor: pointer;
        }
      }
    }

    .bottom-container {
      margin-top: 32px;
    }
  }

  &.login-phone {
    .bottom-container {
      margin-top: 66px;
    }
  }

  .check-container {
    display: flex;
    align-items: center;

    &.remember-pwd {
      margin-bottom: 16px;
      justify-content: space-between;
    }

    :deep(.t-checkbox__label) {
      color: var(--td-text-color-secondary);
    }

    span {
      color: var(--td-brand-color);

      &:hover {
        cursor: pointer;
      }
    }
  }

  .verification-code {
    display: flex;
    align-items: center;

    :deep(.t-form__controls) {
      width: 100%;

      button {
        flex-shrink: 0;
        width: 102px;
        height: 40px;
        margin-left: 11px;
      }
    }
  }

  .btn-container {
    margin-top: 48px;
  }
}

.switch-container {
  margin-top: 24px;

  .tip {
    font-size: 14px;
    color: var(--td-brand-color-8);
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    margin-right: 14px;

    &:last-child {
      &::after {
        display: none;
      }
    }

    &::after {
      content: '';
      display: block;
      width: 1px;
      height: 12px;
      background: var(--td-gray-color-3);
      margin-left: 14px;
    }
  }
}

.check-container {
  font-size: 14px;
  color: var(--td-text-color-secondary);

  .tip {
    float: right;
    font-size: 14px;
    color: var(--td-brand-color-8);
  }
}

.copyright {
  font-size: 14px;
  position: absolute;
  left: 5%;
  bottom: 64px;
  color: var(--td-text-color-secondary);
}

@media screen and (max-height: 700px) {
  .copyright {
    display: none;
  }
}
</style>
