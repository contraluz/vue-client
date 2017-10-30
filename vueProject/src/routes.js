import User from './components/user/User.vue';
import Home from './components/Home.vue';
import Cate from './components/user/Cate.vue';
import Comment from './components/user/Comment.vue';
import News from './components/user/News.vue';


export const routes = [
	{ path:'/',component:Home },
	{ path:'/user',component:User }	,
	{ path:'/cate',component:Cate }	,
	{ path:'/comment',component:Comment },
	{ path:'/news',component:News }	
];