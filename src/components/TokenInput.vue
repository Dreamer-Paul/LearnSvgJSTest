<template>
  <section class="token-input">
    <label for="token">输入 Token:</label>
    <input
      id="token"
      v-model="token"
      type="text"
      placeholder="请输入 Token"
    />
    <p class="controls">
      <button @click="saveToken">保存 Token</button>
      <button @click="clearToken">清除 Token</button>
    </p>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { setToken, getToken, clearToken as clearStoredToken } from "../utils/auth";

const token = ref(getToken() || "");

const saveToken = () => {
  setToken(token.value);
};

const clearToken = () => {
  clearStoredToken();
  token.value = "";
};
</script>

<style scoped>
.token-input {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.token-input input {
  padding: 0.5em;
  font: inherit;
}
</style>
