<template>
  <div class="group flex items-center gap-4 p-3.5 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow transition-all duration-200">
    <!-- File Icon based on extension -->
    <div class="shrink-0 w-10 h-10 flex items-center justify-center rounded-lg" :class="{
      'bg-blue-50 group-hover:bg-blue-100': isDocument,
      'bg-green-50 group-hover:bg-green-100': isImage,
      'bg-purple-50 group-hover:bg-purple-100': !isImage && !isDocument
    }">
      <i v-if="isImage" 
         class="bi bi-image text-xl"
         :class="{
           'text-blue-600': isDocument,
           'text-green-600': isImage,
           'text-purple-600': !isImage && !isDocument
         }">
      </i>
      <i v-else-if="isDocument" 
         class="bi bi-file-text text-xl"
         :class="{
           'text-blue-600': isDocument,
           'text-green-600': isImage,
           'text-purple-600': !isImage && !isDocument
         }">
      </i>
      <i v-else 
         class="bi bi-file-earmark text-xl"
         :class="{
           'text-blue-600': isDocument,
           'text-green-600': isImage,
           'text-purple-600': !isImage && !isDocument
         }">
      </i>
    </div>

    <!-- File Information -->
    <div class="min-w-0 flex-1">
      <h3 class="text-sm font-medium text-gray-900 truncate">{{ filename }}</h3>
      <div class="mt-0.5 text-xs">
        <span class="font-medium uppercase tracking-wider" :class="{
          'text-blue-600': isDocument,
          'text-green-600': isImage,
          'text-purple-600': !isImage && !isDocument
        }">{{ ext }}</span>
      </div>
      <div class="mt-0.5 text-xs text-gray-500">
        {{ formattedSize }}
      </div>
    </div>

    <!-- Download Button -->
    <button class="shrink-0 p-2 text-gray-400 hover:text-blue-600 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 focus:outline-non" :class="{
      'hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100': isDocument,
      'hover:text-green-600 hover:bg-green-50 active:bg-green-100': isImage,
      'hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100': !isImage && !isDocument
    }">
      <i class="bi bi-download text-lg"></i>
    </button>
  </div>
</template>

<script>
export default {
  name: 'NoteAttachment',
  props: {
    filename: {
      type: String,
      required: true
    },
    ext: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  computed: {
    isImage() {
      const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
      return imageExtensions.includes(this.ext.toLowerCase());
    },
    isDocument() {
      const docExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'];
      return docExtensions.includes(this.ext.toLowerCase());
    },
    formattedSize() {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = this.size;
      let unitIndex = 0;

      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }

      return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
    }
  }
}
</script>

<style>

</style>