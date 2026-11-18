import { reactive, ref, toRaw } from "vue";
import { store, setStore } from "../service/store.js";
import { read } from "../service/api.js";
import { poll } from "../service/poll.js";
import { useErrorMessage } from "./useErrorMessage.js";

const initialData = {
  num: "",
  label: "",
}

const registers = reactive(Array(4).fill("").map(() => (initialData)));

const isPolling = ref(false);

export function useRegisters() {
  const inProgress = ref(false);
  const data = ref(new Map());
  const { message } = useErrorMessage();
  const reset = () => {
    if (store.registers && store.registers.length) {
      store.registers.forEach((a, idx) => {
        registers[idx] = a;
      });
    }
  }

  const startPoll = () => {
    setStore({ registers: toRaw(registers) });
    poll.start();
    isPolling.value = true;
  }

  const stopPoll = () => {
    poll.stop();
    isPolling.value = false;
  }

  const fetchData = () => {
    if (registers?.length) {
      const filteredRegisters = [ ...registers.filter((i) => i && i.num && i.num !== "0")];
      if (filteredRegisters.length) {
        inProgress.value = true;
        read(filteredRegisters.map((i) => i.num))
          .then((response) => {
            if (!response) {
              throw new Error("No response received");
            }

            return response.json().then((r) => {
              if (!response.ok || response.status !== 200) {
                throw new Error(r.error || `HTTP error ${response.status}`);
              }

              if (r && "data" in r) {
                data.value = new Map(r.data);
              }
            });
          })
          .catch((e) => {
            stopPoll();
            message.value = e.message;
          })
          .finally(() => {
            inProgress.value = false;
          });
      } else {
        message.value = "Please configure at least one register.";
      }
    }
  }

  const send = () => {
    setStore({ registers: [...toRaw(registers)] });
    fetchData();
  }

  const addNew = () => {
    registers.push(initialData);
  }

  const removeItem = (index) => {
    if (index > 0 && index < registers.length) {
      registers.splice(index, 1);
    }
  }

  poll.setCallback(fetchData.bind(this));

  return {
    registers,
    inProgress,
    data,
    isPolling,
    reset,
    fetchData,
    startPoll,
    stopPoll,
    send,
    addNew,
    removeItem,
  }
}

