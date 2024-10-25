import type {Course} from "~/types/course";

export const useFirstLesson = async () => {
  const course  = await useCourse()
  return course.value.chapters[0].lessons[0];
}
