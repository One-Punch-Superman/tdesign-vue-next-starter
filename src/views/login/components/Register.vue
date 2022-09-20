<template>
  <t-form ref="form" :class="['item-container', `register-${type}`]" :data="formData" :rules="FORM_RULES"
    label-width="0" @submit="onSubmit">
    <template v-if="type == 'phone'">
      <t-form-item name="phone">
        <t-input v-model="formData.phone" :maxlength="11" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <t-icon name="user" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <template v-if="type == 'email'">
      <t-form-item name="email">
        <t-input v-model="formData.email" type="text" size="large" placeholder="请输入您的邮箱">
          <template #prefix-icon>
            <t-icon name="mail" />
          </template>
        </t-input>
      </t-form-item>
    </template>

    <t-form-item name="password">
      <t-input v-model="formData.password" size="large" :type="showPsw ? 'text' : 'password'" clearable
        placeholder="请输入登录密码">
        <template #prefix-icon>
          <t-icon name="lock-on" />
        </template>
        <template #suffix-icon>
          <t-icon :name="showPsw ? 'browse' : 'browse-off'" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    <template v-if="type == 'phone'">
      <t-form-item class="verification-code" name="verifyCode">
        <t-input v-model="formData.verifyCode" size="large" placeholder="请输入验证码" />
        <t-button variant="outline" :disabled="countDown > 0" @click="handleCounter">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

    <t-form-item class="check-container" name="checked">
      <t-checkbox v-model="formData.checked">我已阅读并同意 </t-checkbox> <span>TDesign服务协议</span> 和
      <span>TDesign 隐私声明</span>
    </t-form-item>

    <t-form-item>
      <t-button block size="large" type="submit"> 注册 </t-button>
    </t-form-item>

    <div class="switch-container">
      <span class="tip" @click="switchType(type == 'phone' ? 'email' : 'phone')">{{
      type == 'phone' ? '使用邮箱注册' : '使用手机号注册'
      }}</span>
    </div>
  </t-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { useCounter } from '@/hooks';

const INITIAL_DATA = {
  phone: '',
  email: '',
  password: '',
  verifyCode: '',
  checked: false,
};

const FORM_RULES = {
  phone: [{ required: true, message: '手机号必填', type: 'error' }],
  email: [
    { required: true, message: '邮箱必填', type: 'error' },
    { email: true, message: '请输入正确的邮箱', type: 'warning' },
  ],
  password: [{ required: true, message: '密码必填', type: 'error' }],
  verifyCode: [{ required: true, message: '验证码必填', type: 'error' }],
};

const type = ref('phone');

const form = ref();
const formData = ref({ ...INITIAL_DATA });

const showPsw = ref(false);

const [countDown, handleCounter] = useCounter();

const emit = defineEmits(['registerSuccess']);

const onSubmit = ({ validateResult }) => {
  if (validateResult === true) {
    if (!formData.value.checked) {
      MessagePlugin.error('请同意TDesign服务协议和TDesign 隐私声明');
      return;
    }
    MessagePlugin.success('注册成功');
    emit('registerSuccess');
  }
};

const switchType = (val) => {
  form.value.reset();
  type.value = val;
};
</script>

<style lang="less" scoped>
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
