export default async <T>(url: string) => {
  const nuxtApp = useNuxtApp();
  const {
    data,
    error
  } = await useFetch<T>(url, {
    transform(payload: T){
      return {
        ...payload,
        fetchAt: new Date() as Date
      }
    },
    getCachedData(key: string){
      const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key];
      // Si no hay data, devolvemos null para que useFetch sepa que no hay data en caché
      if(!data) return null;

      // Si hay data, comprobamos si ha expirado
      const expiration = new Date(data.fetchAt);
      expiration.setTime(expiration.getTime() + 120 * 1000) // 2 minutos
      const isExpired = expiration.getTime() < Date.now();

      // Si ha expirado, devolvemos null, sino devolvemos la data
      return isExpired ? null : data;
    }
  })
  // Si hay un error, lanzamos una excepción
  if (error.value) {
    throw createError({
      ...error.value,
      statusCode: 500,
      statusMessage: `Could not fetch data from ${url}`,
    });
  }
  return data;
};