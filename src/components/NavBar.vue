<script setup lang="ts">
import type { User } from '@/api/user/userType';
import { putUserApi, putUserAvatarApi } from '@/api/user/userApi';
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
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

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
const isOpen = ref(false);

watch(isOpen, () => {
  if (!tempUser.value) {
    tempUser.value = userStore.user;
  }
});

const title = ref<string>('');
const tags = ref<string[]>([]);

const route = useRoute();

function updateExperiment() {
  const path = route.path.split('/').pop();
  if (path === 'buffon') {
    title.value = 'Buffon投针';
    tags.value = ['蒙特卡罗模拟', '辛钦大数定律', '几何概率、概率密度、条件概率','独立事件'];
  }
  else if (path === 'three-doors') {
    title.value ='三门问题';
    tags.value =['贝叶斯定理','条件概率','全概率公式','独立事件'];
  }
  else if (path === 'birthday-problem') {
    title.value ='生日问题';
    tags.value =['蒙特卡罗模拟','排列组合','互补事件的概率','均匀分布','大数定律'];
  }
   else if (path === 'birthday-attack') {
  title.value ='生日攻击问题';
  tags.value =['蒙特卡罗模拟','生日问题','条件概率','泰勒展开','独立事件的联合概率'];
  }
   else if (path === 'positive-test') {
  title.value ='阳性检测';
  tags.value =['条件概率','互斥事件','独立事件'];
  }
   else if (path === 'binomialDistribution') {
  title.value ='二项分布';
  tags.value =['X~B(n,p)'];
  }
   else if (path === 'poissonDistribution') {
  title.value ='泊松分布';
  tags.value =['X~P(λ)'];
  }
   else if (path === 'geometricDistribution') {
  title.value ='几何分布';
  tags.value =['X~GE(p)'];
  }
   else if (path === 'evenDistribution') {
  title.value ='均匀分布';
  tags.value =['X~U(a,b)'];
  }
   else if (path === 'exponentialDistribution') {
  title.value ='指数分布';
  tags.value =['X~E(λ)'];
  }
   else if (path === 'normalDistribution') {
  title.value ='正态分布';
  tags.value =['X~N(μ,σ²)'];
  }
   else if (path === 'binomialPoisson') {
  title.value ='二项分布与泊松分布';
  tags.value =['np=λ，n很大，p很小，λ固定时近似'];
  }
   else if (path === 'binomialNormal') {
  title.value ='二项分布与正态分布';
  tags.value =['np和np(1-p)足够大，即n→∞时近似'];
  }
   else if (path === 'poissonExponential') {
  title.value ='泊松分布与指数分布';
  tags.value =['泊松分布：事件的数量','指数分布：事件之间的时间间隔','公交车悖论'];
  }
   else if (path === 'poissonNormal') {
  title.value ='泊松分布与正态分布';
  tags.value =['λ较大，泊松分布可近似为均值和方差均为λ的正态分布'];
  }
   else if (path === '') {
  title.value ='';
  tags.value =[''];
  }
   else if (path === '') {
  title.value ='';
  tags.value =[''];
  }
   else if (path === '') {
  title.value ='';
  tags.value =[''];
  }
  // else if (path === '') {
  //title.value ='';
  //tags.value =[''];
  // }
  else {
    title.value = '邮趣概率';
    tags.value = [];
  }
}

watch(() => route.path, () => {
  updateExperiment();
});

onMounted(() => {
  updateExperiment();
});
</script>

<template>
  <nav class="w-full flex py-2 px-5 z-50 border-b bg-background">
    <div class="flex items-center justify-center gap-3">
      <Label class="text-lg font-bold">
        {{ title }}
      </Label>
      <div class="flex gap-2 overflow-x-auto">
        <Badge v-for="item in tags" :key="item" class="text-sm">
          {{ item }}
        </Badge>
      </div>
    </div>
    <div class="flex items-center gap-2 ml-auto">
      <Label class="text-base"> {{ userStore.user?.nickname ?? 'unknown' }}</Label>
      <Button variant="ghost" size="icon" class="rounded-full" @click="isOpen = true">
        <img :src="userStore.user?.avatarUrl" class="w-8 rounded-full" alt="">
      </Button>
    </div>
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
