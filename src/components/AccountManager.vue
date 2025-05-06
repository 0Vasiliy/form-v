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
      <AccountFormRow
        v-for="(account, idx) in accounts"
        :key="account.id"
        :account="account"
        :errors="accountErrors[idx]"
        @update="onUpdate(idx, $event)"
        @remove="removeAccount(idx)"
      />
    </el-space>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import { storeToRefs } from 'pinia';
import { Plus } from '@element-plus/icons-vue';
import AccountFormRow from './AccountFormRow.vue';

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

function onUpdate(idx: number, payload: any) {
  accountErrors.value[idx] = payload.errors;
  if (Object.keys(payload.errors).length === 0) {
    store.updateAccount(idx, payload);
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