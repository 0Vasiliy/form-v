<template>
  <!-- Карточка одной учетной записи -->
  <el-card shadow="hover" class="account-card">
    <!-- Основная flex-строка для полей -->
    <div class="account-flex-row">
      <!-- Метки -->
      <el-form-item
        label="Метки"
        :error="errors?.labels"
        label-width="80px"
        class="form-label flex-label"
      >
        <el-input
          v-model="account.labelsInput"
          :maxlength="50"
          placeholder="Метки через ;"
          @blur="onBlur"
          size="large"
        />
      </el-form-item>
      <!-- Тип записи (select) -->
      <el-form-item label="Тип записи" label-width="90px" class="form-label flex-select">
        <el-select
          v-model="account.type"
          @change="onTypeChange"
          size="large"
          placeholder="Выберите тип"
          class="account-type-select"
        >
          <el-option label="Локальная" value="Локальная" />
          <el-option label="LDAP" value="LDAP" />
        </el-select>
      </el-form-item>
      <!-- Логин -->
      <el-form-item
        label="Логин"
        :error="errors?.login"
        label-width="70px"
        class="form-label flex-login"
      >
        <el-input
          v-model="account.login"
          :maxlength="100"
          placeholder="Значение"
          @blur="onBlur"
          size="large"
        />
      </el-form-item>
      <!-- Пароль (только для Локальная) -->
      <el-form-item
        v-if="account.type === 'Локальная'"
        label="Пароль"
        :error="errors?.password"
        label-width="70px"
        class="form-label flex-password"
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
      <!-- Кнопка удаления -->
      <el-button type="danger" @click="$emit('remove')" circle class="delete-btn">
        <el-icon><Close /></el-icon>
      </el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { Close } from '@element-plus/icons-vue';

// Ожидаемые props: объект учетной записи и объект ошибок
const props = defineProps({
  account: Object,
  errors: Object
});
// Эвенты: обновление (update) и удаление (remove)
const emit = defineEmits(['update', 'remove']);

// Обработчик смены типа записи
function onTypeChange() {
  // Если выбран LDAP, пароль скрывается
  if (props.account.type === 'LDAP') props.account.password = null;
  onBlur();
}

// Валидация и отправка обновления наверх
function onBlur() {
  const acc = props.account;
  // Валидация полей
  const errors: { labels?: string; login?: string; password?: string } = {};
  if (acc.labelsInput.length > 50) errors.labels = 'Максимум 50 символов';
  if (!acc.login) errors.login = 'Обязательное поле';
  else if (acc.login.length > 100) errors.login = 'Максимум 100 символов';
  if (acc.type === 'Локальная') {
    if (!acc.password) errors.password = 'Обязательное поле';
    else if (acc.password.length > 100) errors.password = 'Максимум 100 символов';
  }
  // Преобразование меток в массив объектов и эмит результата
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
/* Стили карточки */
.account-card {
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  padding: 24px 16px;
  background: #fafcff;
  margin-bottom: 0;
}
/* Flex-строка для полей */
.account-flex-row {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
}
/* Метка */
.flex-label {
  flex: 1.2 1 180px;
  min-width: 120px;
  margin-bottom: 0;
}
/* Select */
.flex-select {
  flex: 1 1 160px;
  min-width: 140px;
  margin-bottom: 0;
}
.account-type-select {
  min-width: 120px;
  width: 100%;
  font-size: 1.1em;
}
/* Логин */
.flex-login {
  flex: 2 2 220px;
  min-width: 160px;
  margin-bottom: 0;
}
/* Пароль */
.flex-password {
  flex: 1.2 1 160px;
  min-width: 120px;
  margin-bottom: 0;
}
/* Кнопка удаления */
.delete-btn {
  align-self: center;
  margin-left: 8px;
}
@media (max-width: 900px) {
  /* Мобильная адаптация: поля в столбик */
  .account-flex-row {
    flex-direction: column;
    gap: 12px;
  }
  .flex-label, .flex-select, .flex-login, .flex-password {
    min-width: 0;
    width: 100%;
    flex: none;
  }
  .delete-btn {
    margin-left: 0;
    width: 48px;
    align-self: flex-end;
  }
}
</style> 