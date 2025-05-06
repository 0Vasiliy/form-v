import { defineStore } from 'pinia';

// Интерфейс одной учетной записи
export interface Account {
  id: string; 
  labelsInput: string; 
  labels?: { text: string }[]; 
  type: 'Локальная' | 'LDAP'; 
  login: string; 
  password: string | null; 
}

// Pinia store для управления учетными записями
export const useAccountsStore = defineStore('accounts', {
  // Состояние: список учетных записей
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    // Добавить новую учетную запись
    addAccount(account: Account) {
      this.accounts.push(account);
      this.saveToStorage();
    },
    // Удалить запись по индексу
    removeAccount(idx: number) {
      this.accounts.splice(idx, 1);
      this.saveToStorage();
    },
    // Обновить запись по индексу
    updateAccount(idx: number, account: Account) {
      this.accounts[idx] = { ...account };
      this.saveToStorage();
    },
    // Загрузить данные из localStorage
    loadFromStorage() {
      const data = localStorage.getItem('accounts');
      if (data) {
        this.accounts = JSON.parse(data);
      }
    },
    // Сохранить данные в localStorage
    saveToStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    },
  },
}); 