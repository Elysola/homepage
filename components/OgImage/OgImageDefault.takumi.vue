<script setup lang="ts">
defineProps<{
  title?: string
  description?: string
  // eslint-disable-next-line vue/prop-name-casing -- injected by nuxt-og-image
  _t?: unknown
}>()
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      padding: 80px;
      position: relative;
      overflow: hidden;
      background:
        radial-gradient(1000px 520px at 85% -10%, rgba(65, 123, 223, 0.22), transparent 60%),
        linear-gradient(135deg, #0b1220 0%, #14213d 100%);
      font-family: 'Inter', 'Noto Sans SC', sans-serif;
      color: #ffffff;
    "
  >
    <div
      style="
        position: absolute;
        top: -140px;
        left: -120px;
        width: 420px;
        height: 420px;
        border-radius: 9999px;
        background: radial-gradient(circle, rgba(112, 172, 254, 0.16), transparent 70%);
      "
    />

    <div style="display: flex; align-items: center; gap: 18px">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 72px;
          height: 72px;
          border-radius: 18px;
          background: rgba(65, 123, 223, 0.18);
          border: 1px solid rgba(112, 172, 254, 0.4);
        "
      >
        <img src="https://elysola.org/logo.svg" width="44" height="44" alt="Elysola" />
      </div>
      <div style="display: flex; align-items: baseline; gap: 2px; font-size: 40px; font-weight: 700; letter-spacing: -0.02em">
        <span style="color: #ffffff">Elysola</span>
        <span style="color: #70acfe">Studio</span>
      </div>
    </div>

    <div style="display: flex; flex: 1; flex-direction: column; justify-content: center">
      <h1 style="font-size: 58px; font-weight: 700; color: #ffffff; line-height: 1.2; margin: 0 0 20px">
        {{ title }}
      </h1>
      <p v-if="description" style="font-size: 28px; color: rgba(255, 255, 255, 0.72); line-height: 1.4; margin: 0">
        {{ description }}
      </p>
    </div>

    <div style="display: flex; justify-content: flex-end; margin-top: 40px; font-size: 20px; color: rgba(255, 255, 255, 0.4)">
      elysola.org
    </div>
  </div>
</template>
