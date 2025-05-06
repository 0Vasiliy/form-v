<template>
  <el-card shadow="hover" class="account-card">
    <el-row :gutter="20" align="middle">
      <el-col :span="6">
        <el-form-item
          label="Метки"
          :error="errors?.labels"
          label-width="80px"
          class="form-label"
        >
          <el-input
            v-model="account.labelsInput"
            :maxlength="50"
            placeholder="Метки через ;"
            @blur="onBlur"
            size="large"
          />
        </el-form-item>
      </el-col>
      <el-col :span="4">
        <el-form-item label="Тип записи" label-width="90px" class="form-label">
          <el-select v-model="account.type" @change="onTypeChange" size="large" style="width: 100%;">
            <el-option label="Локальная" value="Локальная" />
            <el-option label="LDAP" value="LDAP" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item
          label="Логин"
          :error="errors?.login"
          label-width="70px"
          class="form-label"
        >
          <el-input
            v-model="account.login"
            :maxlength="100"
            placeholder="Значение"
            @blur="onBlur"
            size="large"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6" v-if="account.type === 'Локальная'">
        <el-form-item
          label="Пароль"
          :error="errors?.password"
          label-width="70px"
          class="form-label"
        >
          <el-input
            v-model="account.password"
            :maxlength="100"
            show-password
            placeholder="Значение"
            @blur="onBlur"
            size="large"
          />
        </el-form-item>
      </el-col>
      <el-col :span="2" style="display: flex; align-items: center; justify-content: center;">
        <el-button type="danger" @click="$emit('remove')" circle>
          <el-icon><Close /></el-icon>
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Close } from '@element-plus/icons-vue';

const props = defineProps({
  account: Object,
  errors: Object
});
const emit = defineEmits(['update', 'remove']);

function onTypeChange() {
  if (props.account.type === 'LDAP') props.account.password = null;
  onBlur();
}

function onBlur() {
  const acc = props.account;
  const errors: { labels?: string; login?: string; password?: string } = {};
  if (acc.labelsInput.length > 50) errors.labels = 'Максимум 50 символов';
  if (!acc.login) errors.login = 'Обязательное поле';
  else if (acc.login.length > 100) errors.login = 'Максимум 100 символов';
  if (acc.type === 'Локальная') {
    if (!acc.password) errors.password = 'Обязательное поле';
    else if (acc.password.length > 100) errors.password = 'Максимум 100 символов';
  }
  emit('update', {
    ...acc,
    labels: acc.labelsInput
      .split(';')
      .map((l: string) => l.trim())
      .filter((l: string) => Boolean(l))
      .map((text: string) => ({ text })),
    errors
  });
}
</script>

<style scoped>
.account-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 24px 16px;
  background: #fafcff;
  margin-bottom: 0;
}
.form-label .el-form-item__label {
  font-weight: 600;
  color: #213547;
  font-size: 1.05em;
}
.el-input__wrapper {
  min-width: 180px;
}
@media (max-width: 900px) {
  .el-row {
    flex-direction: column;
    gap: 12px;
  }
  .el-col {
    width: 100% !important;
    max-width: 100% !important;
  }
}
</style> 