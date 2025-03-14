<script setup lang="ts">
import { ref } from "vue";

// 定义组件事件
const emit = defineEmits<{
  (event: "icon-selected", icon: string): void;
}>();

const isVisible = ref(false);
const searchQuery = ref("");
const searchResults = ref<string[]>([]);
const selectedIcon = ref<string | null>(null);

const open = () => {
  isVisible.value = true;
};

const close = () => {
  isVisible.value = false;
  searchQuery.value = "";
  searchResults.value = [];
};

const searchIcons = async () => {
  if (!searchQuery.value.trim()) return;

  // 模拟后端请求
  searchResults.value = await new Promise((resolve) =>
    setTimeout(() => resolve(["capsule-line", "umbrella-line", "taxi-line"]), 500)
  );
};

const selectIcon = (icon: string) => {
  selectedIcon.value = icon;
  close();
  // 触发事件通知父组件
  emit("icon-selected", icon);
};

// 显式暴露方法
defineExpose({
  open,
  close,
});
</script>

<template>
  <div v-if="isVisible" class="icon-search-overlay">
    <div class="icon-search-box">
      <header>
        <h3>搜索图标</h3>
        <button @click="close">关闭</button>
      </header>
      <input
        type="text"
        v-model="searchQuery"
        placeholder="输入图标名称"
        @keyup.enter="searchIcons"
      />
      <ul>
        <li v-for="icon in searchResults" :key="icon" @click="selectIcon(icon)">
          {{ icon }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.icon-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-search-box {
  background: white;
  padding: 1em;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1em;
}

input {
  width: 100%;
  padding: 0.5em;
  margin-bottom: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  padding: 0.5em;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-bottom: 0.5em;
  transition: background 0.3s;
}

li:hover {
  background: #f0f0f0;
}
</style>
