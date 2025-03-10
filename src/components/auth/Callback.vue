<script setup lang="ts">
import { casValidateApi } from '@/api/user/userApi.ts';
import { useUserStore } from '@/store';
import { setLocalToken } from '@/utils/auth.ts';
import { error } from '@/utils/toast.ts';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();

function validateTicket() {
  const ticket = new URLSearchParams(window.location.search).get('ticket');
  if (!ticket) {
    throw new Error('认证失败，请重试');
  }
  return ticket;
}

onMounted(async () => {
  try {
    const ticket = validateTicket();
    const response = await casValidateApi(ticket);
    userStore.user = response.user;
    setLocalToken(response.token);
  }
  catch (e: any) {
    error('认证失败，请重试');
    console.error('Error:', e);
    await router.push('/login');
  }
});
</script>
