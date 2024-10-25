<script setup lang="ts">
// Runs before the component is created (Server-side)
definePageMeta({
  middleware: [
    async function ({params}) {
      const course = await useCourse();

      // Validate that the chapter exists
      const chapter = course.value.chapters.find(
          (chapter) => chapter.slug === params.chapterSlug
      );
      if (!chapter) {
        return abortNavigation(
            createError({
              statusCode: 404,
              message: 'Chapter not found'
            })
        )
      }
      // Validate that the lesson exists
      const lesson = chapter.lessons.find(
          (lesson) => lesson.slug === params.lessonSlug
      );
      if (!lesson) {
        return abortNavigation(
            createError({
              statusCode: 404,
              message: 'Lesson not found'
            })
        )
      }
    },
    'auth'
  ],
})

// Runs after the component is created (Client-side)
// It has to define course and route again because now is running on the client-side
const course = await useCourse()
const route = useRoute()
const { chapterSlug, lessonSlug } = route.params as { chapterSlug: string, lessonSlug: string }
const lesson = await useLesson(chapterSlug, lessonSlug)

const chapter = computed(() => {
  return course.value.chapters.find((chapter) => chapter.slug === route.params.chapterSlug);
})

/*const lesson = computed(() => {
  return chapter.value?.lessons.find((lesson) => lesson.slug === route.params.lessonSlug);
})*/

const title = computed(() => {
  return `${lesson.value?.title} - ${course.value.title}`;
})

const progress = useLocalStorage('progress', [] as any)

const isLessonComplete = computed(() => {
  if (!progress.value[chapter.value!.number - 1]) {
    return false;
  }
  if (!progress.value[chapter.value!.number - 1][lesson.value!.number - 1]) {
    return false;
  }
  return progress.value[chapter.value!.number - 1][lesson.value!.number - 1]
})

const toggleComplete = () => {
  if (!progress.value[chapter.value!.number - 1]) {
    progress.value[chapter.value!.number - 1] = []
  }
  progress.value[chapter.value!.number - 1][lesson.value!.number - 1] = !isLessonComplete.value;
}
useHead({
  title: title,
})
</script>

<template>
  <div>
    <p class="mt-0 uppercase font-bold text-slate-400 mb-1">
      Lesson {{ chapter?.number }} - {{ lesson?.number }}
    </p>
    <h2 class="my-0">{{ lesson?.title }}</h2>
    <div class="flex space-x-4 mt-2 mb-8">
      <a
          v-if="lesson?.sourceUrl"
          class="font-normal text-md text-gray-500"
          :href="lesson?.sourceUrl"
      >
        Download Source Code
      </a>
      <a
          v-if="lesson?.downloadUrl"
          class="font-normal text-md text-gray-500"
          :href="lesson?.downloadUrl"
      >
        Download Video
      </a>
    </div>
    <VideoPlayer
        class="w-full"
        v-if="lesson?.videoId"
        :videoId="lesson.videoId"
    />
    <p>{{ lesson?.text }}</p>
    <LessonCompleteButton
        :model-value="isLessonComplete"
        @update:model-value="toggleComplete"
    />
  </div>
</template>

<style scoped>

</style>