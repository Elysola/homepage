<template>
  <img
    :src="size <= 32 ? '/brand/elysola-icon-small.svg' : '/brand/elysola-icon.svg'"
    :width="size"
    :height="size"
    :style="{ width: `${size}px`, height: `${size}px` }"
    alt="Elysola"
    class="inline-block shrink-0"
  />
</template>

<script setup lang="ts">
// 显示尺寸不超过 32px 时使用光学校正的小尺寸图标（品牌资产规范）。
withDefaults(defineProps<{ size?: number }>(), { size: 32 })
</script>