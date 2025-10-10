<script setup lang="ts">
import type { Feedback } from '@/api/feedback/feedbackType';
import type { User } from '@/api/user/userType';
import { Icon } from '@iconify/vue';
import { Plus } from 'lucide-vue-next';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { fetchFeedbackApi, postFeedbackApi } from '@/api/feedback/feedbackApi.ts';
import { putUserApi, putUserAvatarApi, updatePasswordApi } from '@/api/user/userApi.ts';
import About from '@/components/about/About.vue';
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
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { useConfigStore, useUserStore } from '@/store';
import { isVisitor, logout } from '@/utils/auth.ts';
import { error, success, warning } from '@/utils/toast.ts';

const isOpen = ref(false);
const userStore = useUserStore();

const isLoading = ref(false);
const tempUser = ref<User | null>(null);

const isOpenPassword = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const router = useRouter();

const fileInput = ref<HTMLInputElement | null>(null);

async function onSubmit() {
  if (!tempUser.value || isLoading.value)
    return;
  if (tempUser.value.nickname === '') {
    warning('昵称不能为空');
  }
  try {
    isLoading.value = true;
    const result = await putUserApi(
      tempUser.value.nickname,
      Number.parseInt(tempUser.value.gender),
      tempUser.value.email,
      tempUser.value.phone,
      tempUser.value.major,
      tempUser.value.school,
    );
    result.user.gender = result.user.gender.toString();
    userStore.user = result.user;
    tempUser.value = userStore.user;
    success('个人资料已更新');
  }
  catch (e) {
    console.error('Error during updating user:', e);
    error('个人资料更新失败，请重试');
  }
  isLoading.value = false;
}

async function updatePassword() {
  if (!tempUser.value)
    return;
  if (oldPassword.value === '' || newPassword.value === '' || newPassword.value === '') {
    warning('密码不能为空');
  }
  if (newPassword.value !== confirmPassword.value) {
    warning('两次输入的密码不一致');
    return;
  }
  if (newPassword.value === oldPassword.value) {
    warning('新密码不能与旧密码相同');
    return;
  }
  try {
    await updatePasswordApi(
      oldPassword.value,
      newPassword.value,
    );
    success('密码已更新');
    isOpenPassword.value = false;
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
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
      tempUser.value!.avatarUrl = result.user.avatarUrl;
    }
    catch {
      console.error('Error during uploading avatar');
    }
  }
}

function openFeishuDoc() {
  window.open('https://ecnyphosrl4i.feishu.cn/wiki/VpHuwRJ53iDKIUkhfFVcqX9fnVe?from=from_copylink', '_blank');
}

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
    feedbackList.value.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
        <div class="flex gap-2 p-2 cursor-pointer items-center">
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
        <DropdownMenuItem class="p-2 cursor-pointer">
          <Icon icon="lucide:user" class="size-4" />
          个人信息
        </DropdownMenuItem>
        <DropdownMenuItem class="p-2 cursor-pointer">
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
    <Dialog v-model:open="isOpen">
      <DialogContent v-if="tempUser" class="overflow-y-auto p-10 max-w-xl">
        <DialogHeader>
          <DialogTitle>个人资料</DialogTitle>
          <DialogDescription>
            在此更改您的个人资料。完成后单击“保存”。
          </DialogDescription>
        </DialogHeader>

        <div class="flex flex-col md:flex-row gap-10">
          <div class="space-y-3 max-w-xs">
            <div class="grid grid-cols-2 gap-4">
              <div class="grid gap-2">
                <Label>学工号</Label>
                <Input v-model="tempUser.username" disabled />
              </div>

              <div class="grid gap-2">
                <Label>年级</Label>
                <Input v-model="tempUser.grade" disabled />
              </div>
            </div>

            <div class="grid max-w-xs gap-2">
              <Label>教学班</Label>
              <Input v-model="tempUser.classId" disabled />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField" v-model="tempUser.nickname" type="text" placeholder=""
                      class="transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="gender">
                <FormItem>
                  <FormLabel>性别</FormLabel>
                  <FormControl>
                    <Select v-bind="componentField" v-model="tempUser.gender">
                      <SelectTrigger>
                        <SelectValue placeholder="" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="0">
                            保密
                          </SelectItem>
                          <SelectItem value="1">
                            男
                          </SelectItem>
                          <SelectItem value="2">
                            女
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>学院</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField" v-model="tempUser.school" type="text" placeholder=""
                      class="transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>专业</FormLabel>
                  <FormControl>
                    <Input
                      v-bind="componentField" v-model="tempUser.major" type="text" placeholder=""
                      class="transition-all"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>邮箱</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField" v-model="tempUser.email" type="email" placeholder=""
                    class="transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="username">
              <FormItem>
                <FormLabel>手机号</FormLabel>
                <FormControl>
                  <Input
                    v-bind="componentField" v-model="tempUser.phone" type="text" placeholder=""
                    class="transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
          </div>

          <div class="grid gap-2 md:self-start">
            <Label> 头像 </Label>
            <div class="flex justify-center items-start">
              <Avatar class="size-32 relative">
                <AvatarImage :src="tempUser.avatarUrl" alt="avatar" />
                <Button
                  variant="ghost"
                  class="absolute top-0 left-0 size-32 rounded-full opacity-0 transition-all hover:opacity-100 hover:bg-opacity-30 hover:bg-black"
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
          </div>
          <input ref="fileInput" type="file" class="hidden" accept="image/*" @change="handleFileUpload">
        </div>
        <DialogFooter class="md:gap-5">
          <Dialog v-model:open="isOpenPassword">
            <DialogTrigger>
              <Button> 修改密码 </Button>
            </DialogTrigger>
            <DialogContent class=" w-auto">
              <DialogHeader>
                <DialogTitle> 修改密码 </DialogTitle>
                <DialogDescription>
                  在此更改您的密码。完成后单击“保存”。
                </DialogDescription>
              </DialogHeader>

              <div class="max-w-sm w-full grid gap-2">
                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>旧密码</FormLabel>
                    <FormControl>
                      <Input
                        v-bind="componentField" v-model="oldPassword" type="password" placeholder=""
                        class="transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>新密码</FormLabel>
                    <FormControl>
                      <Input
                        v-bind="componentField" v-model="newPassword" type="password" placeholder=""
                        class="transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>

                <FormField v-slot="{ componentField }" name="username">
                  <FormItem>
                    <FormLabel>确认密码</FormLabel>
                    <FormControl>
                      <Input
                        v-bind="componentField" v-model="confirmPassword" type="password" placeholder=""
                        class="transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
              </div>

              <DialogFooter>
                <Button @click="updatePassword">
                  设置密码
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <DialogClose>
            <Button @click="onSubmit">
              保存设置
            </Button>
          </DialogClose>
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
  </div>
</template>

<style scoped>

</style>
