<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>()
const localePath = useLocalePath()

function goBack() {
  window.history.back()
}

const messages: Record<number, { title: string; desc: string }> = {
  404: {
    title: 'Page not found',
    desc: 'The page you are looking for does not exist or has been moved.',
  },
  500: {
    title: 'Server error',
    desc: 'Something went wrong on our end. Please try again later.',
  },
}

const err = computed(() => (messages[props.error.statusCode] ?? messages[500])!)
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-canvas px-4 font-sans text-secondary">
    <main class="max-w-md text-center">
      <AppLogo class="mx-auto h-12 w-12" />
      <p class="mt-8 font-mono text-sm font-medium text-danger">Error {{ error.statusCode }}</p>
      <h1 class="mt-2 text-3xl font-bold tracking-tight text-primary">{{ err.title }}</h1>
      <p class="mt-3 text-base text-secondary">{{ err.desc }}</p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <NuxtLink :to="localePath('/')" class="btn btn-primary">Back to home</NuxtLink>
        <button type="button" class="btn btn-secondary" @click="goBack">
          <span aria-hidden="true">←</span> Go back
        </button>
      </div>
    </main>
  </div>
</template>
