export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  // Si el usuario está logueado o intenta acceder al primer capítulo, permitir el acceso
  if (user.value || to.params.chapterSlug === '1-chapter-1') {
    return;
  }
  // Si el usuario no está logueado, redirigir a la página de login
  // Se envía la ruta a la que intentaba acceder como query para redirigirlo una vez logueado
  return navigateTo(`/login?redirectTo=${to.path}`);
})
