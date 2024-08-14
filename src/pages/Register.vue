<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">用户注册</h2>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div class="flex flex-col">
            <label for="id" class="text-sm font-medium text-gray-700">用户ID</label>
            <input v-model="registerForm.id" id="id" type="text" required 
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="flex flex-col">
            <label for="password" class="text-sm font-medium text-gray-700">密码</label>
            <input v-model="registerForm.password" id="password" type="password" required
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="flex flex-col">
            <label for="username" class="text-sm font-medium text-gray-700">用户名</label>
            <input v-model="registerForm.username" id="username" type="text" required
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="flex flex-col">
            <label for="gender" class="text-sm font-medium text-gray-700">性别</label>
            <input v-model="registerForm.gender" id="gender" type="text" required
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="flex flex-col">
            <label for="number" class="text-sm font-medium text-gray-700">随意</label>
            <input v-model="registerForm.number" id="number" type="text" required
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="flex flex-col">
            <label for="introduction" class="text-sm font-medium text-gray-700">介绍</label>
            <input v-model="registerForm.introduction" id="introduction" type="text" required
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          <div class="flex flex-col">
            <label for="email" class="text-sm font-medium text-gray-700">邮箱</label>
            <input v-model="registerForm.email" id="email" type="email" required
                   class="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
  
          <button type="submit" class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
            注册
          </button>
  
          <p v-if="message" class="mt-4 text-center text-red-500">{{ message }}</p>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        registerForm: {
          id: '',
          password: '',
          username: '',
          gender: '',
          number: '',
          introduction: '',
          email: ''
        },
        message: ''
      };
    },
    methods: {
      async handleRegister() {
        try {
          const response = await axios.post('/usermanager/register', this.registerForm);
          if (response.status === 200) {
            this.message = '注册成功!';
            // 可以在这里处理注册成功后的操作
          }
        } catch (error) {
          if (error.response && error.response.status === 400) {
            this.message = '注册失败';
          } else {
            this.message = '注册请求失败';
          }
        }
      }
    }
  };
  </script>