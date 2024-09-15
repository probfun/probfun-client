import { post, get } from '../request';
import { User } from './userType';

export async function loginApi(studentId: string, password: string) {
    try {
        const result = await post<User>('/usermanager/login', {
            studentId,
            password
        });
        return result.data;
    }
    catch (error) {
        console.error('Login API error:', error);
        throw error;
    }

}

export async function registerApi(studentId: string, nickname: string, password: string, email: string) {
    try {
        const result = await post<User>('/usermanager/register', {
            studentId,
            nickname,
            password,
            email
        });
        return result.data;
    }
    catch (error) {
        console.error('Register API error:', error);
        throw error;
    }

}

export async function testApi() {
    const result = await get<{
        aaa: string,
        bbb: string
    }>('/user/test');
    return result.data;
}

// 演示
// async function login() {
//     const studentId = 'aaa';
//     const password = 'bbb';
//     try {
//         const user = await loginApi(studentId, password);
//         console.log(user);
//     } catch (error) {
//         console.error(error);
//     }
// }