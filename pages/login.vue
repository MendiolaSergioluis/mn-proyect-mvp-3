<script setup lang="ts">
const course = await useCourse();
const { query } = useRoute();
const supabase = useSupabaseClient();
const user = useSupabaseUser();

/*watchEffect(async () => {
  if (user.value) {
    await navigateTo(query.redirectTo as string, {
      replace: true,
    });
  }
});*/

const login = async () => {
  // const redirectTo = `${window.location.origin}${query.redirectTo}`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    // options: { redirectTo }, // Al parecer hay un error en Supabase
  });
  if (error) {
    console.error(error);
  }
};
</script>

<template>
  <div class="prose w-full max-w-2xl h-9">
    <h1>Log in to {{ course.title }}</h1>
    <button
        class="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        @click="login"
    >
      Log in with Github
    </button>
  </div>
</template>

<style scoped></style>
