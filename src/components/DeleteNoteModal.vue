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
          class="px-6 sm:px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-medium shadow-lg hover:shadow-red-500/30 transition-all duration-300"
        >
          Да
        </button>
        <button 
          @click="$emit('close')" 
          class="px-6 sm:px-8 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-medium shadow-lg hover:shadow-gray-500/30 transition-all duration-300"
        >
          Нет
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
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