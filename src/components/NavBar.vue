<script setup lang="ts">
import type { User } from '@/api/user/userType';
import { fetchUserApi, putUserApi, putUserAvatarApi } from '@/api/user/userApi';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label'

import { useUserStore } from '@/store'

import { Plus } from 'lucide-vue-next'
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const userStore = useUserStore();
const toast = useToast();

const isLoading = ref(false);
const tempUser = ref<User | null>(null);

async function onSubmit() {
  if (!tempUser.value || isLoading.value)
    return;
  if (tempUser.value.nickname === '') {
    toast.add({ severity: 'warn', summary: '提示', detail: '昵称不能为空', life: 3000 });
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
    toast.add({ severity: 'success', summary: '成功', detail: '个人资料已更新', life: 3000 });
  }
  catch (error) {
    console.error('Error during updating user:', error);
    toast.add({ severity: 'error', summary: '错误', detail: '个人资料更新失败，请重试', life: 3000 });
  }
  isLoading.value = false;
}

const fileInput = ref<HTMLInputElement | null>(null);

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

onMounted(async () => {
  try {
    const result = await fetchUserApi();
    result.user.gender = result.user.gender.toString();
    userStore.user = result.user;
    tempUser.value = userStore.user;
  }
  catch (error) {
    console.error('Error during fetching user:', error);
  }
})
</script>

<template>
  <nav class="w-full flex py-2 px-5 z-50 border-b bg-background">
    <div class="flex items-center justify-center gap-3">
      <!--      <Button variant="ghost" class="text-base px-2 transition-all"> -->
      <!--        Buffon投针 -->
      <!--      </Button> -->
      <!--      <div class="flex gap-2 overflow-x-auto"> -->
      <!--        <Badge v-for="item in 3" :key="item"> -->
      <!--          {{ item }} -->
      <!--        </Badge> -->
      <!--      </div> -->
    </div>
    <Dialog>
      <DialogTrigger as-child>
        <div class="flex items-center gap-2 ml-auto">
          <Label class="text-base"> {{ userStore.user?.nickname ?? 'unknown' }}</Label>
          <Button variant="ghost" size="icon" class="rounded-full">
            <img :src="userStore.user?.avatarUrl || '/default-avatar.png'" class="w-8 rounded-full" alt="">
          </Button>
        </div>
      </DialogTrigger>
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
                <Input v-model="tempUser.studentId" disabled />
              </div>

              <div class="grid gap-2">
                <Label>年级</Label>
                <Input v-model="tempUser.grade" disabled />
              </div>
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

        <DialogFooter>
          <DialogClose>
            <Button @click="onSubmit">
              保存设置
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </nav>
</template>

<style scoped></style>
