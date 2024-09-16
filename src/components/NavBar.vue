<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Plus } from 'lucide-vue-next'
import { useUserStore } from '@/store/index'

const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const isDrawerOpen = ref(false);

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const isActiveRoute = (itemRoute: string) => {
  return route.path === itemRoute;
};

const logout = async () => {
  userStore.logout();  // 清除 Pinia 中的用户状态
};

const isAuthenticated = computed(() => userStore.isAuthenticated);

const user = ref({
  nickname: computed(() => userStore.getUser.user.username || ''),
  studentId: computed(() => userStore.getUser.user.id || ''),
  gender: 'secret',
  school: '',
  avatarUrl: computed(() => userStore.getUser.user.image || '/default-avatar.png'),
});

function submitForm() {

}

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileUpload = () => {
  fileInput.value?.click();
};

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files: FileList | null = target.files;
  if (files && files.length > 0) {
    const file: File = files[0];
    user.value.avatarUrl = URL.createObjectURL(file);
  }
};

</script>

<template>
  <nav class="w-full flex py-2 px-5 z-50 border-b bg-background">
    <div class="flex items-center gap-3 navbar-start">
    </div>

    <div class="navbar-center w-full max-w-sm flex items-center gap-2">
      <Input class="input input-bordered input-sm grow input-primary transition-all" placeholder="请输入要搜索的实验" />
      <Button size="icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </Button>
    </div>

    <div class="flex items-center gap-3 navbar-end">
      <Dialog v-if="isAuthenticated">
        <DialogTrigger as-child>
          <div class="flex items-center gap-2">
            <Label class="text-base"> {{ userStore.getUser.user.username }}</Label>
            <Button variant="ghost" size="icon" class="rounded-full">
              <img :src="userStore.getUser?.avatarUrl || '/default-avatar.png'" class="w-8 rounded-full" alt="" />
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent class="overflow-y-auto p-10 max-w-none w-auto">
          <DialogHeader>
            <DialogTitle>个人资料</DialogTitle>
            <DialogDescription>
              在此更改您的个人资料。完成后单击“保存”。
            </DialogDescription>
          </DialogHeader>

          <div class="flex">
            <form @submit="submitForm" class="w-64 space-y-3">
              <div class="space-y-2">
                <label class="text-sm">学工号</label>
                <Input v-model="user.studentId" disabled />
              </div>

              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>昵称</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="请输入昵称" v-model="user.nickname" v-slot="componentField"
                      class="transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="gender">
                <FormItem>
                  <FormLabel>性别</FormLabel>
                  <FormControl>
                    <Select v-model="user.gender" v-slot="componentField">
                      <SelectTrigger>
                        <SelectValue placeholder="请选择性别" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="female">
                            女
                          </SelectItem>
                          <SelectItem value="male">
                            男
                          </SelectItem>
                          <SelectItem value="secret">
                            保密
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>学院</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="请输入学院" v-model="user.school" v-slot="componentField"
                      class="transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>专业</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="请输入专业" v-model="user.school" v-slot="componentField"
                      class="transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="请输入邮箱" v-model="user.school" v-slot="componentField"
                      class="transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="username">
                <FormItem>
                  <FormLabel>手机号</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="请输入手机号" v-model="user.school" v-slot="componentField"
                      class="transition-all" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
            </form>

            <div class="flex justify-center pl-10">
              <Avatar class="size-48 relative">
                <AvatarImage :src="user.avatarUrl" alt="avatar" />
                <Button variant="ghost"
                  class="absolute top-0 left-0 size-48 rounded-full opacity-0 transition-all hover:opacity-100 hover:bg-opacity-30 hover:bg-black"
                  @click="triggerFileUpload">
                  <div class="flex flex-col items-center text-background">
                    <Plus class="size-6" />
                    <div class="font-semibold"> 上传图片 </div>
                  </div>
                </Button>
              </Avatar>
            </div>

            <input type="file" ref="fileInput" class="hidden" @change="handleFileUpload" accept="image/*" />
          </div>

          <DialogFooter>
            <Button type="submit" form="dialogForm">
              保存设置
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div class="flex items-center gap-1 text-sm" v-else>
        <Button variant="ghost" class="px-2 text-primary" @click="router.push('/register')">注册</Button>
        或
        <Button variant="ghost" class="px-2 text-primary" @click="router.push('/login')">登录</Button>
      </div>
    </div>
  </nav>

</template>

<style scoped></style>