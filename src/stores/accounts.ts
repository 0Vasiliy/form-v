import { defineStore } from 'pinia';

export interface Account {
  id: string; 
  labelsInput: string; 
  labels?: { text: string }[]; 
  type: 'Локальная' | 'LDAP'; 
  login: string; 
  password: string | null; 
}

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [] as Account[],
  }),
  actions: {
    addAccount(account: Account) {
      this.accounts.push(account);
      this.saveToStorage();
    },
    removeAccount(idx: number) {
      this.accounts.splice(idx, 1);
      this.saveToStorage();
    },
    updateAccount(idx: number, account: Account) {
      this.accounts[idx] = { ...account };
      this.saveToStorage();
    },
    loadFromStorage() {
      const data = localStorage.getItem('accounts');
      if (data) {
        this.accounts = JSON.parse(data);
      }
    },
    saveToStorage() {
      localStorage.setItem('accounts', JSON.stringify(this.accounts));
    },
  },
}); 