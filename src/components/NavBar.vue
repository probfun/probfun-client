<script setup lang="ts">
import type { Message } from '@/api/message/messageType';
import type { User } from '@/api/user/userType';
import { Bell, Plus, Star } from 'lucide-vue-next';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchFavoriteExperimentsApi, toggleFavoriteApi } from '@/api/experiment/experimentApi.ts';
import { fetchMessagesApi, readMessagesApi } from '@/api/message/messageApi';
import { putUserApi, putUserAvatarApi, updatePasswordApi } from '@/api/user/userApi';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Label } from '@/components/ui/label';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { useConfigStore, useUserStore } from '@/store';
import { isVisitor } from '@/utils/auth.ts';
import { error, success, warning } from '@/utils/toast';

const userStore = useUserStore();
const router = useRouter();

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
const isFavorite = ref(false);

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

const subjectNameMap: Record<string, string> = {
  calculusA: '高等数学上',
  calculusB: '高等数学下',
  linearAlgebra: '线性代数',
  numberTheory: '数论',
  bayes: '统计决策与贝叶斯分析',
  probability: '邮趣概率',
};

const title = ref<string>('');
const tags = ref<string[]>([]);

const route = useRoute();

function updateExperiment() {
  // 科目优先级：/subject/:subject/* -> 显示科目名；否则按原逻辑
  if (route.path.startsWith('/subject/')) {
    const seg = route.path.split('/')[2];
    title.value = subjectNameMap[seg] || '学科主页';
    tags.value = [];
    return;
  }
  // 原有 updateExperiment 逻辑
  const path = route.path.split('/').pop();
  if (path === 'buffon') {
    title.value = '蒲丰投针';
    tags.value = ['几何概率', '微积分与积分计算', '大数定律', '蒙特卡罗模拟'];
  }
  else if (path === 'three-doors') {
    title.value = '三门问题';
    tags.value = ['条件概率', '乘法公式', '全概率公式', '贝叶斯公式', '蒙特卡罗模拟', '最优策略'];
  }
  else if (path === 'birthday-problem') {
    title.value = '生日问题';
    tags.value = ['排列组合', '大数定律', '蒙特卡罗模拟'];
  }
  else if (path === 'birthday-attack') {
    title.value = '生日攻击问题';
    tags.value = ['蒙特卡罗模拟', '生日问题', '条件概率', '泰勒展开', '独立事件的联合概率'];
  }
  else if (path === 'positive-test') {
    title.value = '阳性检测';
    tags.value = ['条件概率', '乘法公式', '全概率公式', '贝叶斯公式', '蒙特卡罗模拟'];
  }
  else if (path === 'binomial-distribution') {
    title.value = '二项分布';
    tags.value = ['X~B(n,p)'];
  }
  else if (path === 'poisson-distribution') {
    title.value = '泊松分布';
    tags.value = ['X~P(λ)'];
  }
  else if (path === 'geometric-distribution') {
    title.value = '几何分布';
    tags.value = ['X~GE(p)'];
  }
  else if (path === 'uniform-distribution') {
    title.value = '均匀分布';
    tags.value = ['X~U(a,b)'];
  }
  else if (path === 'exponential-distribution') {
    title.value = '指数分布';
    tags.value = ['X~E(λ)'];
  }
  else if (path === 'normal-distribution') {
    title.value = '正态分布';
    tags.value = ['X~N(μ,σ²)'];
  }
  else if (path === 'binomial-poisson') {
    title.value = '二项分布与泊松分布';
    tags.value = ['泊松近似定理 : np=λ，n很大，p很小，λ固定时近似'];
  }
  else if (path === 'binomial-normal') {
    title.value = '二项分布与正态分布';
    tags.value = ['np和np(1-p)足够大，即n→∞时近似'];
  }
  else if (path === 'poisson-exponential') {
    title.value = '泊松分布与指数分布';
    tags.value = ['泊松分布：事件的数量', '指数分布：事件之间的时间间隔', '公交车悖论'];
  }
  else if (path === 'poisson-normal') {
    title.value = '泊松分布与正态分布';
    tags.value = ['λ较大，泊松分布可近似为均值和方差均为λ的正态分布'];
  }
  else if (path === '2d-uniform-distribution') {
    title.value = '二维均匀分布';
    tags.value = ['联合分布', '边缘分布', '条件分布', '随机变量的独立性', '区域积分'];
  }
  else if (path === '2d-normal-distribution') {
    title.value = '二维正态分布';
    tags.value = ['联合分布', '边缘分布', '条件分布', '随机变量的独立性', '区域积分'];
  }
  else if (path === 'group-detection') {
    title.value = '分组检测';
    tags.value = ['事件的独立性', 'n重伯努利概型', '二项分布', '期望', '方差', '函数优化'];
  }
  else if (path === 'portfolio') {
    title.value = '投资组合优化';
    tags.value = ['期望', '方差', '协方差', '蒙特卡罗抽样'];
  }
  else if (path === 'NetworkTrafficCharacteristics') {
    title.value = '网络流量分析与异常检测系统';
    tags.value = ['相关系数矩阵', '蒙特卡罗模拟'];
  }
  else if (path === 'expectation-test') {
    title.value = '期望检验';
    tags.value = ['分组检测'];
  }
  else if (path === 'CoinFliping') {
    title.value = '抛硬币实验';
    tags.value = ['大数定律', '蒙特卡罗模拟'];
  }
  else if (path === 'EstimationOfPai') {
    title.value = '蒙特卡罗方法估算π值';
    tags.value = ['大数定律', '蒙特卡罗模拟'];
  }
  else if (path === 'central-limit-theorem') {
    title.value = '高尔顿钉板实验';
    tags.value = ['中心极限定理', '蒙特卡罗模拟'];
  }
  else if (path === 'bertrand') {
    title.value = '贝特朗悖论';
    tags.value = ['几何概率', '测度论', '概率的公理化定义'];
  }
  else if (path === 'distribution-clt') {
    title.value = '各种分布的中心极限定理';
    tags.value = ['分布的可加性'];
  }
  else if (path === 'brownian-motion') {
    title.value = '布朗运动模拟';
    tags.value = ['随机变量的独立性', '正态分布', '随机过程', '平稳过程', '独立增量过程'];
  }
  else if (path === 'geometric-brownian-motion') {
    title.value = '几何布朗运动模拟';
    tags.value = ['正态分布', '随机过程', '随机分布'];
  }
  else if (path === 'poisson-process') {
    title.value = '泊松过程模拟';
    tags.value = ['泊松分布', '随机过程', '平稳过程', '独立增量过程'];
  }
  else if (path === 't-distribution') {
    title.value = 't分布';
    tags.value = ['正态分布', '卡方分布', '抽样分布'];
  }
  else if (path === 'chi-square-distribution') {
    title.value = '卡方分布';
    tags.value = ['正态分布', '随机变量和的分布', '抽样分布'];
  }
  else if (path === 't-distribution-quantile') {
    title.value = 't分布上分位点';
    tags.value = ['t分布'];
  }
  else if (path === 'chi-square-distribution-quantile') {
    title.value = '卡方分布上分位点';
    tags.value = ['卡方分布'];
  }
  else {
    title.value = useConfigStore().currentSubject.name;
    tags.value = [];
  }
  if (!isVisitor()) {
    const userStore = useUserStore();
    isFavorite.value = userStore.favoriteExperiments.map(item => item.expId).includes(path ?? '');
  }
}

onMounted(() => {
  updateExperiment();
  if (!isVisitor()) {
    getMessage();
  }
});

watch(() => route.path, () => {
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

async function readMessage() {
  try {
    await readMessagesApi();
    messageNumber.value = 0;
  }
  catch (error) {
    console.error('Error during read messages: ', error);
  }
}

async function refreshFavorite() {
  try {
    const response = await fetchFavoriteExperimentsApi();
    userStore.favoriteExperiments = response.experiments;
    const path = route.path.split('/').pop();
    isFavorite.value = userStore.favoriteExperiments.map(item => item.expId).includes(path ?? '');
  }
  catch (error) {
    console.error('Error during fetching favorite experiments:', error);
  }
}

async function toggleFavorite() {
  try {
    const path = route.path.split('/').pop();
    if (!path) {
      return;
    }
    await toggleFavoriteApi(path);
    await refreshFavorite();
    success(isFavorite.value ? '已收藏' : '已取消收藏');
  }
  catch (error) {
    console.error('Error during toggle favorite:', error);
  }
}

function openFeishuDoc() {
  window.open('https://ecnyphosrl4i.feishu.cn/wiki/VpHuwRJ53iDKIUkhfFVcqX9fnVe?from=from_copylink', '_blank');
}

function isInExperimentPage() {
  return route.path.startsWith('/dashboard/experiment/');
}
</script>

<template>
  <nav class="w-full flex py-2 px-5 z-50 border rounded-xl shadow-md bg-background gap-2">
    <div class="flex items-center justify-center gap-2 overflow-x-hidden">
      <Label class="text-lg font-bold shrink-0">
        {{ title }}
      </Label>
      <div class="flex gap-2 overflow-x-auto">
        <Badge v-for="item in tags" :key="item" class="text-sm shrink-0">
          {{ item }}
        </Badge>
      </div>
      <Button
        v-if="isInExperimentPage() && !isVisitor()" size="icon" variant="ghost" class="p-1 size-auto"
        @click="toggleFavorite"
      >
        <Star
          class="size-5 transition-all" :style="{
            fill: isFavorite ? '#FFA500' : 'none',
            stroke: isFavorite ? '#FFA500' : '#999',
          }"
        />
      </Button>
    </div>
    <div class="flex items-center gap-4 ml-auto">
      <Button @click="openFeishuDoc">
        用户手册
      </Button>
      <div v-if="!isVisitor()" class="relative flex items-center justify-center ml-auto">
        <Popover>
          <PopoverTrigger>
            <Button size="icon" class="size-8 relative text-muted-foreground" variant="ghost">
              <Bell :stroke-width="2" class="size-6" />
              <Badge
                v-if="messageNumber !== 0"
                class="absolute right-1.5 top-0 translate-x-1/2 rounded-full min-w-4 h-4 p-0 flex items-center justify-center"
                variant="destructive"
              >
                {{ messageNumber <= 99 ? messageNumber : '99+' }}
              </Badge>
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-96 p-0">
            <div class="flex items-center px-4 py-3">
              <Label class="font-bold text-base"> 我的消息 </Label>
              <button
                class="ml-auto text-xs text-blue-600 hover:underline disabled:opacity-50"
                :disabled="!messageList.length || messageNumber === 0"
                @click="readMessage()"
              >
                全部已读
              </button>
            </div>
            <Separator />
            <div
              class="max-h-96 overflow-y-auto custom-scrollbar px-2 py-2 flex flex-col gap-1"
              :class="{ 'items-center justify-center': !messageList.length }"
            >
              <div
                v-if="!messageList.length"
                class="text-sm text-muted-foreground py-10 select-none"
              >
                暂无消息
              </div>

              <div
                v-for="item in messageList"
                :key="item.messageId"
                class="group flex gap-3 rounded-md px-3 py-2 relative hover:bg-muted cursor-pointer transition"
                :class="{ 'opacity-70': item.read }"
                @click="
                  item.type === 'pin'
                    ? router.push(`/dashboard/experiment/${item.pinData?.comment.expId}`)
                    : item.type === 'reply'
                      ? router.push(`/dashboard/experiment/${item.replyData?.comment.expId}`)
                      : item.type === 'like'
                        ? router.push(`/dashboard/experiment/${item.likeData?.comment.expId}`)
                        : null
                "
              >
                <Avatar class="shrink-0 mt-0.5">
                  <template v-if="item.type === 'post'">
                    <AvatarImage :src="item.postData?.post.user.avatarUrl || ''" />
                    <AvatarFallback>{{ item.postData?.post.user.nickname }}</AvatarFallback>
                  </template>
                  <template v-else-if="item.type === 'pin'">
                    <AvatarImage :src="item.pinData?.user.avatarUrl || ''" />
                    <AvatarFallback>{{ item.pinData?.user.nickname }}</AvatarFallback>
                  </template>
                  <template v-else-if="item.type === 'reply'">
                    <AvatarImage :src="item.replyData?.reply.user.avatarUrl || ''" />
                    <AvatarFallback>{{ item.replyData?.reply.user.nickname }}</AvatarFallback>
                  </template>
                  <template v-else-if="item.type === 'like'">
                    <AvatarImage :src="item.likeData?.user.avatarUrl || ''" />
                    <AvatarFallback>{{ item.likeData?.user.nickname }}</AvatarFallback>
                  </template>
                  <template v-else-if="item.type === 'delete'">
                    <AvatarImage :src="item.likeData?.user?.avatarUrl || ''" />
                    <AvatarFallback>管理员</AvatarFallback>
                  </template>
                </Avatar>

                <div class="flex flex-col min-w-0">
                  <span class="text-sm font-medium truncate">
                    <template v-if="item.type === 'post'">{{ item.postData?.post.user.nickname }}</template>
                    <template v-else-if="item.type === 'pin'">{{ item.pinData?.user.nickname }}</template>
                    <template v-else-if="item.type === 'reply'">{{ item.replyData?.reply.user.nickname }}</template>
                    <template v-else-if="item.type === 'like'">{{ item.likeData?.user.nickname }}</template>
                    <template v-else-if="item.type === 'delete'">管理员</template>
                  </span>
                  <span
                    class="text-xs text-muted-foreground leading-snug mt-0.5 line-clamp-2"
                  >
                    <template v-if="item.type === 'post'">老师发布了新的班级公告</template>
                    <template v-else-if="item.type === 'pin'">老师置顶了你的评论</template>
                    <template v-else-if="item.type === 'reply'">回复了你的评论</template>
                    <template v-else-if="item.type === 'like'">赞了你的评论</template>
                    <template v-else-if="item.type === 'delete'">管理员删除了你的评论</template>
                  </span>
                </div>

                <span
                  v-if="!item.read"
                  class="absolute right-2 top-2 inline-block w-2 h-2 rounded-full bg-red-500"
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <!--      <Label class="text-base font-bold"> {{ userStore.user?.nickname ?? 'unknown' -->
      <!--      }}</Label> -->
      <Button v-if="!isVisitor()" variant="ghost" size="icon" class="rounded-full" @click="isOpen = true">
        <img :src="userStore.user?.avatarUrl" class="w-8 rounded-full" alt="">
      </Button>
      <Button v-else @click="router.push('/login')">
        登录
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
  </nav>
</template>

<style scoped></style>
