import { post, get } from '../request';
import { User } from './userType';

export async function loginApi(studentId: string, password: string) {
    const result = await post<User>('/user/login', {
        studentId,
        password
    });
    return result.data;
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