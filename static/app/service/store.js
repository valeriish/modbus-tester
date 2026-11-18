import { reactive, watch, toRaw } from "vue";

const STORAGE_KEY = "modbus-tester";
const savedState = localStorage.getItem(STORAGE_KEY);

const initialState = savedState ? JSON.parse(savedState) : {
  registers: [],
  address: "",
  port: 502,
  timeout: 1000,
};

const onStoreChange = [
  (newState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }
];

function isObjectEqual(a, b) {
  if (a === b) return true;
  if (!a || !b) return false;

  let count = 0;
  for (const k in a) {
    if (a[k] !== b[k] || !(k in b)) return false;
    count++;
  }
  for (const k in b) {
    if (--count < 0) return false;
  }
  return count === 0;
}

export const store = reactive(initialState);
export const addCallbackOnStoreChange = (fn) => {
  if (typeof fn === "function") {
    onStoreChange.push(fn);
  }
}

export const setStore = (newValues) => {
  if (!newValues || newValues === store) {
    return false;
  }

  const rawStore = toRaw(store);
  let hasChanges = false;

  for (const key in newValues) {
    if (!(key in rawStore)) continue;

    const nextVal = newValues[key];
    const prevVal = rawStore[key];

    if (nextVal === null || typeof nextVal !== "object") {
      if (prevVal !== nextVal) {
        hasChanges = true;
        break;
      }
    } else if (Array.isArray(nextVal)) {
      if (
        !Array.isArray(prevVal) ||
        prevVal.length !== nextVal.length ||
        nextVal.some((v, i) => !isObjectEqual(toRaw(prevVal[i]), toRaw(v)))
      ) {
        hasChanges = true;
        break;
      }
    } else if (!isObjectEqual(toRaw(prevVal), toRaw(nextVal))) {
      hasChanges = true;
      break;
    }
  }

  if (!hasChanges) {
    return false;
  }

  Object.assign(store, { ...newValues });

  return true;
};

watch(store, (newState) => {
  for (const onChange of onStoreChange) {
    onChange(newState);
  }
}, { deep: true });

