import { ref } from "vue";

const message = ref("");

export function useErrorMessage() {
  return {
    message,
  }
}

