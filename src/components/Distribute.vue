<script setup>
import { onMounted } from '@vue/runtime-core';
import { useRouter } from 'vue-router';

const router = useRouter();
const link = Date.now();
onMounted(() => {
  router.push(`/${link}`);
});
</script>
