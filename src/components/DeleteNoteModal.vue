<template>
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    @click="$emit('close')"
  >
    <div class="bg-gray-800 p-6 rounded-xl flex flex-col items-center gap-4" @click.stop>
      <img src="../assets/delete-note.png" alt="Duck" class="w-52 h-52 drop-shadow-2xl" />
      <p class="text-white text-xl">Вы уверены что хотите удалить заметку?</p>
      <div class="flex gap-4">
        <button 
          @click="$emit('confirm')" 
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Да
        </button>
        <button 
          @click="$emit('close')" 
          class="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Нет
        </button>
      </div>
    </div>
  </div>
</template> 