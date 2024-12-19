<script setup lang="ts">
import type { Message } from '@/api/message/messageType';
import type { User } from '@/api/user/userType';
import { fetchMessagesApi, readMessagesApi } from '@/api/message/messageApi';
import { putUserApi, putUserAvatarApi, updatePasswordApi } from '@/api/user/userApi';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Separator } from '@/components/ui/separator';

import { useUserStore } from '@/store'

import { error, success, warning } from '@/utils/toast';
import { Bell, Plus } from 'lucide-vue-next'
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter()

const isLoading = ref(false);
const tempUser = ref<User | null>(null);

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

const isOpenPassword = ref(false);
const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

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
    tags.value = ['蒙特卡罗模拟', '辛钦大数定律', '几何概率、概率密度、条件概率', '独立事件'];
  }
  else if (path === 'three-doors') {
    title.value = '三门问题';
    tags.value = ['贝叶斯定理', '条件概率', '全概率公式', '独立事件'];
  }
  else if (path === 'birthday-problem') {
    title.value = '生日问题';
    tags.value = ['蒙特卡罗模拟', '排列组合', '互补事件的概率', '均匀分布', '大数定律'];
  }
  else if (path === 'birthday-attack') {
    title.value = '生日攻击问题';
    tags.value = ['蒙特卡罗模拟', '生日问题', '条件概率', '泰勒展开', '独立事件的联合概率'];
  }
  else if (path === 'positive-test') {
    title.value = '阳性检测';
    tags.value = ['条件概率', '互斥事件', '独立事件'];
  }
  else if (path === 'binomialDistribution') {
    title.value = '二项分布';
    tags.value = ['X~B(n,p)'];
  }
  else if (path === 'poissonDistribution') {
    title.value = '泊松分布';
    tags.value = ['X~P(λ)'];
  }
  else if (path === 'geometricDistribution') {
    title.value = '几何分布';
    tags.value = ['X~GE(p)'];
  }
  else if (path === 'evenDistribution') {
    title.value = '均匀分布';
    tags.value = ['X~U(a,b)'];
  }
  else if (path === 'exponentialDistribution') {
    title.value = '指数分布';
    tags.value = ['X~E(λ)'];
  }
  else if (path === 'normalDistribution') {
    title.value = '正态分布';
    tags.value = ['X~N(μ,σ²)'];
  }
  else if (path === 'binomialPoisson') {
    title.value = '二项分布与泊松分布';
    tags.value = ['泊松近似定理 : np=λ，n很大，p很小，λ固定时近似'];
  }
  else if (path === 'binomialNormal') {
    title.value = '二项分布与正态分布';
    tags.value = ['np和np(1-p)足够大，即n→∞时近似'];
  }
  else if (path === 'poissonExponential') {
    title.value = '泊松分布与指数分布';
    tags.value = ['泊松分布：事件的数量', '指数分布：事件之间的时间间隔', '公交车悖论'];
  }
  else if (path === 'poissonNormal') {
    title.value = '泊松分布与正态分布';
    tags.value = ['λ较大，泊松分布可近似为均值和方差均为λ的正态分布'];
  }
  else if (path === '2DuniformDistribution') {
    title.value = '二维均匀分布';
    tags.value = ['边缘分布', '条件分布', '(x,y) ∈ Area G = (x2-x1)·(y2-y1)', 'P((X,Y) ∈ A) = Area A / Area G'];
  }
  else if (path === '2DnormalDistribution') {
    title.value = '二维正态分布';
    tags.value = ['边缘分布', '条件分布', '(X,Y) ~ N(μ1,μ2;σ1²,σ2²;ρ)'];
  }
  else if (path === '') {
    title.value = '';
    tags.value = [''];
  }
  // else if (path === '') {
  // title.value ='';
  // tags.value =[''];
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

const messageList = ref<Message[]>([]);
const messageNumber = ref(0);

async function getMessage() {
  try {
    const result = await fetchMessagesApi();
    messageNumber.value = result.messages.length;
    console.log(result.messages);

    for (let i = 0; i < result.messages.length; i++) {
      if (!result.messages[i].read) {
        messageList.value.push(result.messages[i]);
        console.log(result.messages[i]);
      }
      else {
        messageList.value.push(result.messages[i]);
        messageNumber.value -= 1;
      }
    }
    console.log('消息', messageList.value);
  }
  catch (error) {
    console.error('Error during fetching messages:', error);
  }
}

onMounted(() => {
  getMessage();
})

async function readMessage() {
  try {
    await readMessagesApi();
    messageNumber.value = 0;
  }
  catch (error) {
    console.error('Error during read messages: ', error);
  }
}
</script>

<template>
  <nav class="w-full flex py-2 px-5 z-50 border-b bg-background gap-2">
    <div class="flex items-center  justify-center gap-3 overflow-x-hidden">
      <Label class="text-lg font-bold shrink-0">
        {{ title }}
      </Label>
      <div class="flex gap-2 overflow-x-auto px-2">
        <Badge v-for="item in tags" :key="item" class="text-sm shrink-0">
          {{ item }}
        </Badge>
      </div>
    </div>
    <div class="flex items-center gap-2 ml-auto">
      <div class="relative flex items-center justify-items-center ml-auto mr-2 hover:scale-110 top-[3px]">
        <Popover>
          <PopoverTrigger>
            <Button size="icon" class="size-8 relative text-muted-foreground" variant="ghost">
              <Bell :stroke-width="2.5" class="size-5" />
              <Badge
                v-if="messageNumber !== 0"
                class="absolute right-1.5 top-0 translate-x-1/2 rounded-full min-w-4 h-4 p-0 flex items-center justify-center"
                variant="destructive"
              >
                {{ messageNumber <= 99 ? messageNumber : '99+' }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <div class="flex">
              <Label class="font-bold text-base"> 我的消息 </Label>
              <button class="flex text-blue-600 ml-auto" @click="readMessage()">
                全部已读
              </button>
            </div>
            <Separator class="my-2" />
            <div class="flex ml-auto" />
            <div class="flex flex-col">
              <div v-for="item in messageList" :key="item.messageId" class="flex mb-3">
                <Avatar class="mr-2">
                  <div v-if="item.type === 'post'">
                    <AvatarImage :src="item.postData?.post.user.avatarUrl || ''" alt="@radix-vue" />
                    <AvatarFallback>{{ item.postData?.post.user.nickname }}</AvatarFallback>
                  </div>
                  <div v-if="item.type === 'pin'">
                    <AvatarImage :src="item.pinData?.user.avatarUrl || ''" alt="@radix-vue" />
                    <AvatarFallback>{{ item.pinData?.user.nickname }}</AvatarFallback>
                  </div>
                  <div v-if="item.type === 'reply'">
                    <AvatarImage :src="item.replyData?.reply.user.avatarUrl || ''" alt="@radix-vue" />
                    <AvatarFallback>{{ item.replyData?.reply.user.nickname }}</AvatarFallback>
                  </div>
                  <div v-if="item.type === 'like'">
                    <AvatarImage :src="item.likeData?.user.avatarUrl || ''" alt="@radix-vue" />
                    <AvatarFallback>{{ item.likeData?.user.nickname }}</AvatarFallback>
                  </div>
                  <div v-if="item.type === 'delete'">
                    <AvatarImage :src="item.likeData?.user.avatarUrl || ''" alt="@radix-vue" />
                    <AvatarFallback>管理员</AvatarFallback>
                  </div>
                </Avatar>
                <div class="flex flex-col">
                  <span v-if="item.type === 'post'">{{ item.postData?.post.user.nickname }}</span>
                  <span
                    v-if="item.type === 'pin'"
                    @click="router.push(`/dashboard/experiment/${item.pinData?.comment.expId}`)"
                  >{{
                    item.pinData?.user.nickname }}</span>
                  <span
                    v-if="item.type === 'reply'"
                    @click="router.push(`/dashboard/experiment/${item.replyData?.comment.expId}`)"
                  >{{
                    item.replyData?.reply.user.nickname }}</span>
                  <span
                    v-if="item.type === 'like'"
                    @click="router.push(`/dashboard/experiment/${item.likeData?.comment.expId}`)"
                  >{{
                    item.likeData?.user.nickname }}</span>
                  <span v-if="item.type === 'delete'">管理员</span>

                  <span v-if="item.type === 'post'" class="content text-sm text-gray-600">老师发布了新的班级公告</span>
                  <span
                    v-if="item.type === 'pin'" class="content text-sm text-gray-600"
                    @click="router.push(`/dashboard/experiment/${item.pinData?.comment.expId}`)"
                  >老师置顶了你的评论</span>
                  <span
                    v-if="item.type === 'reply'" class="content text-sm text-gray-600"
                    @click="router.push(`/dashboard/experiment/${item.replyData?.comment.expId}`)"
                  >回复了你的评论</span>
                  <span
                    v-if="item.type === 'like'" class="content text-sm text-gray-600"
                    @click="router.push(`/dashboard/experiment/${item.likeData?.comment.expId}`)"
                  >赞了你的评论</span>
                  <span v-if="item.type === 'delete'" class="content text-sm text-gray-600">管理员删除了你的评论</span>
                </div>
                <div v-if="item.read === false" class="ml-auto">
                  <span class="inline-block w-2 h-2 bg-red-600 rounded-full" />
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <!--      <Label class="text-base font-bold"> {{ userStore.user?.nickname ?? 'unknown' -->
      <!--      }}</Label> -->
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
  </nav>
</template>

<style scoped></style>
