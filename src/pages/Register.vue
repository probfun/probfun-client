<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const id = ref()
const username = ref('')
const number = ref('')
const gender = ref('')
const introduction = ref('')
const password = ref('')
const email = ref('')
const registerError = ref('');

const handleRegister = async () => {
    try {
        const response = await axios.post('/usermanager/register', {
            id: id.value,
            password: password.value,
            username: username.value,
            gender: gender.value,
            number: number.value,
            introduction: introduction.value,
            email: email.value
        });
        if (response.status === 200) {
            // 处理注册成功
            console.log('注册成功', response.data);
            registerError.value = '';
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error('An error occurred:', error.message);
        } else {
            console.error('An unknown error occurred');
        }
    }
};
</script>

<template>
    <div class="min-h-screen flex ">
        <div class="inset-0 z-10 w-1/3 flex items-center justify-center">
            <img src="@\assets\33.png" alt="" class="h-full w-full object-cover shadow-2xl">
        </div>
        <div class="flex flex-col items-center justify-center w-2/3">
            <div class="py-10 px-48 bg-gray-100 shadow-lg">
                <div class="text-4xl text-center mb-10">
                    <h1>注册</h1>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <InputNumber class="w-full" id="number-input" v-model="id" :useGrouping="false" />
                        <label for="number-input">学号</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <InputText id="username" v-model="username" class="w-full" />
                        <label for="username">用户名</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <Password v-model="password" inputId="password" toggleMask />
                        <label for="password">密码</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <InputText id="gender" v-model="gender" class="w-full" />
                        <label for="gender">性别</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <InputText id="number" v-model="number" class="w-full" />
                        <label for="number">数字</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <InputText id="introduction" v-model="introduction" class="w-full" />
                        <label for="introduction">介绍</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-10">
                    <FloatLabel>
                        <InputText id="email" v-model="email" class="w-full" />
                        <label for="email">邮箱</label>
                    </FloatLabel>
                </div>
                <div class="flex flex-col gap-2 mb-5">
                    <Button @click="handleRegister" class="register" label="注册" severity="help" />
                </div>
            </div>
        </div>
    </div>
</template>
