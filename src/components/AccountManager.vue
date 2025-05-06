<template>
  <div>
    <h2 style="margin-bottom: 20px;">Учетные записи</h2>
    <el-button type="primary" @click="addAccount" circle style="margin-bottom: 24px;">
      <el-icon><Plus /></el-icon>
    </el-button>
    <el-alert
      title="Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;"
      type="info"
      show-icon
      class="mb-4 mt-2"
      style="margin-bottom: 24px;"
    />
    <el-space direction="vertical" :size="24" style="width: 100%;">
      <el-card
        v-for="(account, idx) in accounts"
        :key="account.id"
        shadow="hover"
        class="account-card"
      >
        <el-row :gutter="20" align="middle">
          <el-col :span="6">
            <el-form-item
              label="Метки"
              :error="accountErrors[idx]?.labels"
              label-width="80px"
              class="form-label"
            >
              <el-input
                v-model="account.labelsInput"
                :maxlength="50"
                placeholder="Метки через ;"
                @blur="onBlur(idx)"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="Тип записи" label-width="90px" class="form-label">
              <el-select v-model="account.type" @change="onTypeChange(idx)" size="large" style="width: 100%;">
                <el-option label="Локальная" value="Локальная" />
                <el-option label="LDAP" value="LDAP" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="Логин"
              :error="accountErrors[idx]?.login"
              label-width="70px"
              class="form-label"
            >
              <el-input
                v-model="account.login"
                :maxlength="100"
                placeholder="Значение"
                @blur="onBlur(idx)"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" v-if="account.type === 'Локальная'">
            <el-form-item
              label="Пароль"
              :error="accountErrors[idx]?.password"
              label-width="70px"
              class="form-label"
            >
              <el-input
                v-model="account.password"
                :maxlength="100"
                show-password
                placeholder="Значение"
                @blur="onBlur(idx)"
                size="large"
              />
            </el-form-item>
          </el-col>
          <el-col :span="2" style="display: flex; align-items: center; justify-content: center;">
            <el-button type="danger" @click="removeAccount(idx)" circle>
              <el-icon><Close /></el-icon>
            </el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import { storeToRefs } from 'pinia';
import { Plus, Close } from '@element-plus/icons-vue';

interface AccountForm {
  id: string;
  labelsInput: string;
  type: 'Локальная' | 'LDAP';
  login: string;
  password: string | null;
}

const store = useAccountsStore();
const { accounts } = storeToRefs(store);

const accountErrors = ref<Record<number, { labels?: string; login?: string; password?: string }>>({});

function addAccount() {
  store.addAccount({
    id: crypto.randomUUID(),
    labelsInput: '',
    type: 'Локальная',
    login: '',
    password: '',
  });
}

function removeAccount(idx: number) {
  store.removeAccount(idx);
}

function onTypeChange(idx: number) {
  const acc = accounts.value[idx];
  if (acc.type === 'LDAP') acc.password = null;
  onBlur(idx);
}

function onBlur(idx: number) {
  const acc = accounts.value[idx];
  const errors: { labels?: string; login?: string; password?: string } = {};
  if (acc.labelsInput.length > 50) errors.labels = 'Максимум 50 символов';
  if (!acc.login) errors.login = 'Обязательное поле';
  else if (acc.login.length > 100) errors.login = 'Максимум 100 символов';
  if (acc.type === 'Локальная') {
    if (!acc.password) errors.password = 'Обязательное поле';
    else if (acc.password.length > 100) errors.password = 'Максимум 100 символов';
  }
  accountErrors.value[idx] = errors;
  if (Object.keys(errors).length === 0) {
    store.updateAccount(idx, {
      ...acc,
      labels: acc.labelsInput
        .split(';')
        .map(l => l.trim())
        .filter(Boolean)
        .map(text => ({ text })),
    });
  }
}

onMounted(() => {
  store.loadFromStorage();
});

watch(accounts, () => {
  store.saveToStorage();
}, { deep: true });
</script>

<style scoped>
.account-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 24px 16px;
  background: #fafcff;
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