// eslint-disable-next-line
import { icons } from "antd/es/image/PreviewGroup";

export const userMenu =[
    {
        name:'Home',
        path:'/',
        icon:"fa-solid fa-house",

    },
    {
        name:'Appointment',
        path:"/appointment",
        icon:"fa-solid fa-list",
    },
    {
        name:'Apply Doctor',
        path:'/apply-doctor',
        icon:'fa-solid fa-user-doctor',
    },
    {
        name:'Profile',
        path:'/profile',
        icon:'fa-solid fa-user',
    },

];

//admin menu
//import { icons } from "antd/es/image/PreviewGroup";

export const adminMenu =[
    {
        name:'Home',
        path:'/',
        icon:"fa-solid fa-house",

    },
    {
        name:'Doctors',
        path:'/admin/doctors',
        icon:'fa-solid fa-user-doctor',
    },
    {
        name:'Users',
        path:'/admin/users',
        icon:'fa-solid fa-user',
    },
    {
        name:'Profile',
        path:'/profile',
        icon:'fa-solid fa-user',
    },

];


