<template>
  <div 
    class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
    @click="$emit('close')"
  >
    <div 
      class="bg-gradient-to-b from-gray-800 to-gray-900 p-6 rounded-2xl flex flex-col items-center gap-3 sm:gap-4 max-w-[90%] sm:max-w-md shadow-2xl animate-scaleIn" 
      @click.stop
    >
      <img 
        src="../assets/byebye.gif" 
        alt="Duck" 
        class="w-32 h-32 sm:w-52 sm:h-52 drop-shadow-2xl rounded-2xl hover:scale-105 transition-transform duration-300" 
      />
      <p class="text-white text-lg sm:text-xl text-center font-medium tracking-wide">
        Вы уверены что хотите удалить заметку?
      </p>
      <div class="flex gap-4 sm:gap-6 mt-2">
        <button 
          @click="$emit('confirm')" 
          class="relative px-6 sm:px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold shadow-lg 
          hover:shadow-red-500/50 active:shadow-red-500/30 transition-all duration-300 
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-red-600 before:to-pink-600 
          before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity 
          overflow-hidden group"
        >
          <span class="relative z-10 flex items-center gap-2">
            <i class="bi bi-trash3-fill text-xl group-hover:rotate-12 transition-transform"></i>
            Да
          </span>
        </button>
        <button 
          @click="$emit('close')" 
          class="relative px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg 
          hover:shadow-blue-500/50 active:shadow-blue-500/30 transition-all duration-300
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-600 to:blue-700 
          before:rounded-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity
          overflow-hidden group"
        >
          <span class="relative z-10 flex items-center gap-2">
            <i class="bi bi-x-lg text-xl group-hover:scale-110 transition-transform"></i>
            Нет
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import 'bootstrap-icons/font/bootstrap-icons.css';

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.2s ease-out;
}
</style> 