<script setup lang="ts">
import type { Feedback } from '@/api/feedback/feedbackType';
import { Icon } from '@iconify/vue';
import { Plus } from 'lucide-vue-next';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchFeedbackApi, postFeedbackApi } from '@/api/feedback/feedbackApi.ts';
import { putUserApi, putUserAvatarApi, updatePasswordApi } from '@/api/user/userApi.ts';
import About from '@/components/about/About.vue';
import CnUniversityCombobox from '@/components/auth/CnUniversityCombobox.vue';
import ClassDialog from '@/components/class/ClassDialog.vue';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { useConfigStore, useUserStore } from '@/store';
import { isVisitor, logout } from '@/utils/auth.ts';
import { error, success, warning } from '@/utils/toast.ts';

const userStore = useUserStore();

const isLoading = ref(false);
const updateForm = reactive({
  account: '',
  nickname: '',
  oldPassword: '',
  password: '',
  confirmPassword: '',
  school: '',
  avatarUrl: '',
});

const router = useRouter();

const fileInput = ref<HTMLInputElement | null>(null);

async function onSubmit() {
  if (updateForm.nickname === '') {
    warning('昵称不能为空');
    return false;
  }
  if (updateForm.school === '') {
    warning('学校不能为空');
    return false;
  }
  try {
    isLoading.value = true;
    const result = await putUserApi(
      updateForm.nickname,
      0,
      '1@1.com',
      '1',
      '1',
      updateForm.school,
    );
    userStore.user = result.user;
    success('个人资料已更新');
    return true;
  }
  catch (e) {
    console.error('Error during updating user:', e);
    error('个人资料更新失败，请重试');
  }
  isLoading.value = false;
  return false;
}

async function updatePassword() {
  if (updateForm.oldPassword === '') {
    warning('旧密码不能为空');
    return false;
  }
  if (updateForm.password === '') {
    warning('新密码不能为空');
    return false;
  }
  if (updateForm.password !== updateForm.confirmPassword) {
    warning('两次输入的密码不一致');
    return false;
  }
  if (updateForm.oldPassword === updateForm.confirmPassword) {
    warning('新密码不能与旧密码相同');
    return false;
  }
  try {
    await updatePasswordApi(
      updateForm.oldPassword,
      updateForm.password,
    );
    success('密码已更新');
    return true;
  }
  catch (e: any) {
    console.error('Error during updating password:', e);
    if (e.response.status === 400) {
      warning('旧密码错误');
    }
    else {
      error('密码更新失败，请重试');
    }
  }
  return false;
}

function triggerFileUpload() {
  fileInput.value?.click();
}

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files: FileList | null = target.files;
  if (files && files.length > 0) {
    const file: File = files[0];
    try {
      const result = await putUserAvatarApi(file);
      userStore.user = result.user;
      updateForm.avatarUrl = result.user.avatarUrl;
    }
    catch {
      console.error('Error during uploading avatar');
    }
  }
}

function openFeishuDoc() {
  window.open('https://ecnyphosrl4i.feishu.cn/wiki/VpHuwRJ53iDKIUkhfFVcqX9fnVe?from=from_copylink', '_blank');
}

const classOpen = ref(false);
const infoOpen = ref(false);
const aboutOpen = ref(false);
const logoutOpen = ref(false);
const feedbackOpen = ref(false);

const seeFeedback = ref(false);
const feedback = ref('improvement');
const content = ref('');
const feedbackList = ref<Feedback[] | null>(null);
async function refreshFeedback() {
  if (isVisitor()) {
    return;
  }
  try {
    const result = await fetchFeedbackApi();
    feedbackList.value = result.feedback;
    // feedbackList.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  catch (error) {
    console.error('Error during fetching feedbacks:', error);
  }
}

async function sendFeedback() {
  if (isVisitor()) {
    warning('请先登录');
    return;
  }
  if (content.value === '') {
    warning('意见反馈不能为空');
    return;
  }
  try {
    await postFeedbackApi(feedback.value, content.value);
    await refreshFeedback();
    success('反馈成功，感谢您的支持！');
    content.value = '';
  }
  catch (e: any) {
    console.error(e);
  }
}

async function handleSave() {
  if ((updateForm.oldPassword !== '' || updateForm.password !== '' || updateForm.confirmPassword !== '') && userStore.user?.source !== 0) {
    const ok = await updatePassword();
    if (!ok)
      return;
  }

  const ok2 = await onSubmit();
  if (!ok2)
    return;

  infoOpen.value = false;
}

onMounted(() => {
  refreshFeedback();
});
</script>

<template>
  <div v-if="userStore.user">
    <DropdownMenu>
      <DropdownMenuTrigger class="flex items-center justify-center">
        <Avatar class="border-2 size-10">
          <AvatarImage :src="userStore.user.avatarUrl" />
          <AvatarFallback>userStore.user.username</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="w-64">
        <div class="flex gap-2 p-2 items-center">
          <Avatar class="size-12 border-2">
            <AvatarImage :src="userStore.user.avatarUrl" />
            <AvatarFallback>userStore.user.username</AvatarFallback>
          </Avatar>
          <div class="flex flex-col">
            <div class="font-semibold">
              {{ userStore.user.realName }}
            </div>
            <div class="text-muted-foreground">
              {{ userStore.user.username }}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="p-2 cursor-pointer" @click="() => {
            if (!userStore.user) return;
            updateForm.avatarUrl = userStore.user.avatarUrl;
            updateForm.account = userStore.user.username;
            updateForm.nickname = userStore.user.realName;
            updateForm.school = userStore.user.school;
            updateForm.oldPassword = '';
            updateForm.password = '';
            updateForm.confirmPassword = '';
            infoOpen = true;
          }"
        >
          <Icon icon="lucide:user" class="size-4" />
          个人信息
        </DropdownMenuItem>
        <DropdownMenuItem class="p-2 cursor-pointer" @click="classOpen = true">
          <Icon icon="lucide:users" class="size-4" />
          班级管理
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem class="p-2 cursor-pointer" @click="feedbackOpen = true">
          <Icon icon="lucide:circle-help" class="size-4" />
          问题反馈
        </DropdownMenuItem>
        <DropdownMenuItem
          class="p-2 cursor-pointer" @click="openFeishuDoc"
        >
          <Icon icon="lucide:book-open" class="size-4" />
          用户手册
        </DropdownMenuItem>
        <DropdownMenuItem
          class="p-2 cursor-pointer" @click="aboutOpen = true"
        >
          <Icon icon="lucide:aperture" class="size-4" />
          关于我们
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          class="p-2 cursor-pointer"
          :disabled="useConfigStore().currentSubjectId === null"
          @click="() => {
            useConfigStore().currentSubjectId = null;
            router.push('/')
          }"
        >
          <Icon icon="lucide:undo-2" class="size-4" />
          返回主页
        </DropdownMenuItem>
        <DropdownMenuItem class="p-2 cursor-pointer" @click="logoutOpen = true">
          <Icon icon="lucide:log-out" class="size-4" />
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog v-model:open="infoOpen">
      <DialogContent class="overflow-y-auto p-8 max-w-2xl">
        <DialogHeader>
          <DialogTitle>个人资料</DialogTitle>
          <DialogDescription>
            在此更改您的个人资料与密码。完成后单击“保存设置”。
          </DialogDescription>
        </DialogHeader>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div class="space-y-5">
            <div class="relative">
              <Input
                id="username"
                :model-value="updateForm.account"
                disabled
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="username"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
            -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                账号
              </Label>
            </div>

            <div class="relative">
              <Input
                id="nickname"
                v-model="updateForm.nickname"
                type="text"
                placeholder="昵称"
                class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
              />
              <Label
                for="nickname"
                class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
            -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
              >
                昵称
              </Label>
            </div>

            <CnUniversityCombobox v-model="updateForm.school" src="/china_universities.json" placeholder="就读学校" />

            <div v-if="userStore.user?.source !== 0" class="pt-2">
              <div class="text-sm font-medium mb-2">
                安全设置
              </div>

              <div class="relative mb-4">
                <Input
                  id="oldPassword"
                  v-model="updateForm.oldPassword"
                  type="password"
                  autocomplete="off"
                  placeholder="旧密码"
                  class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
                />
                <Label
                  for="oldPassword"
                  class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
              -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
                >
                  旧密码
                </Label>
              </div>

              <div class="relative mb-4">
                <Input
                  id="newPassword"
                  v-model="updateForm.password"
                  type="password"
                  autocomplete="new-password"
                  placeholder="新密码"
                  class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
                />
                <Label
                  for="newPassword"
                  class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
              -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
                >
                  新密码
                </Label>
              </div>

              <div class="relative">
                <Input
                  id="confirmPassword"
                  v-model="updateForm.confirmPassword"
                  type="password"
                  autocomplete="new-password"
                  placeholder="确认密码"
                  class="peer h-12 w-full pt-2 !placeholder-transparent rounded-xl"
                />
                <Label
                  for="confirmPassword"
                  class="pointer-events-none absolute left-3 top-0 text-muted-foreground transition-all
              peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm
              -translate-y-1/2 text-sm bg-background px-1 peer-focus:text-primary peer-focus:top-0"
                >
                  确认密码
                </Label>
              </div>
            </div>
          </div>

          <div class="grid gap-3 md:self-start">
            <Label>头像</Label>
            <div class="flex justify-center items-start">
              <Avatar class="size-64 relative">
                <AvatarImage :src="updateForm.avatarUrl" alt="avatar" />
                <Button
                  variant="ghost"
                  class="absolute top-0 left-0 size-64 rounded-full opacity-0 transition-all hover:opacity-100 hover:bg-black/70"
                  @click="triggerFileUpload"
                >
                  <div class="flex flex-col items-center text-background">
                    <Plus class="size-6" />
                    <div class="font-semibold">
                      上传图片
                    </div>
                  </div>
                </Button>
              </Avatar>
            </div>
            <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileUpload">
          </div>
        </div>

        <DialogFooter class="md:gap-5">
          <Button @click="handleSave">
            保存设置
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <AlertDialog v-model:open="logoutOpen">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>确定要退出登录吗？</AlertDialogTitle>
          <AlertDialogDescription>
            退出后需要重新登录才能继续使用。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            @click="() => {
              logoutOpen = false;
              logout();
              router.push('/login');
            }"
          >
            确认
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <Dialog v-model:open="feedbackOpen" class="overflow-y-auto">
      <DialogContent class="overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            问题反馈
            <button
              v-if="userStore.user?.role > 1 && seeFeedback === false" class="mr-5 underline"
              @click="seeFeedback = true"
            >
              (查看所有意见反馈)
            </button>
            <button
              v-if="userStore.user?.role > 1 && seeFeedback === true" class="mr-5 underline"
              @click="seeFeedback = false"
            >
              (返回)
            </button>
          </DialogTitle>
          <DialogDescription v-if="seeFeedback === false">
            如果您在学习概率论时遇到了任何问题，或者有任何希望改进本软件的建议，请随时告诉我们。
            课堂上您提出的学习问题会由老师统一答复，而关于软件的反馈，我们的开发团队会及时调整和优化，确保更好地满足您的需求！期待您的宝贵意见！
          </DialogDescription>
        </DialogHeader>
        <FloatLabel v-if="seeFeedback === false">
          <Textarea v-model="content" class="resize-none" :rows="15" placeholder="请在这里输入您的问题反馈！" />
        </FloatLabel>
        <div v-if="seeFeedback === true">
          <div v-for="feed in feedbackList" :key="feed.feedbackID">
            <div class="border py-3">
              {{ feed.content }}
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button v-if="seeFeedback === false" @click="sendFeedback">
              提交
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog v-model:open="aboutOpen">
      <DialogContent class="max-w-screen-lg mx-auto">
        <DialogHeader>
          <DialogTitle>
            关于我们
          </DialogTitle>
        </DialogHeader>
        <About />
      </DialogContent>
    </Dialog>

    <ClassDialog v-model:open="classOpen" />
  </div>
</template>

<style scoped>

</style>
