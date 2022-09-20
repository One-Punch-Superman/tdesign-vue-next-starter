import Layout from '@/layout/index.vue';
import LogoutIcon from '@/assets/assets-slide-logout.svg';

export default [
  {
    path: '/user',
    name: 'user',
    component: Layout,
    redirect: '/user/index',
    meta: { title: '个人页', icon: 'user-circle' },
    children: [
      {
        path: 'index',
        name: 'UserIndex',
        component: () => import('@/views/user/index.vue'),
        meta: { title: '个人中心' },
      },
    ],
  },
  {
    path: '/loginRedirect',
    name: 'loginRedirect',
    redirect: '/login',
    meta: { title: '登录页', icon: LogoutIcon },
    children: [
      {
        path: 'index',
        redirect: '/login',
        meta: { title: '登录中心' },
      },
    ],
  },
];
