export default {
  props: {
    minus: Boolean
  },
  template: `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke-width="1.5" 
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
      <path v-if="!minus" stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15" />
    </svg>
  `
}

