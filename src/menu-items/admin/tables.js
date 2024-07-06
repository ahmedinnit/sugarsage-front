// assets
// import { UserOutlined } from '@ant-design/icons';
import { HiOutlineUsers } from 'react-icons/hi';
import { IoFastFoodOutline } from 'react-icons/io5';
import { RiFeedbackLine } from 'react-icons/ri';
import { TfiWrite } from 'react-icons/tfi';
import { BiDish } from 'react-icons/bi';
import { FaRegFileCode } from 'react-icons/fa';
// import Breadcrumbs from 'components/@extended/Breadcrumbs';

// icons
const icons = {
  HiOutlineUsers,
  IoFastFoodOutline,
  BiDish,
  RiFeedbackLine,
  FaRegFileCode,
  TfiWrite
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const tables = {
  id: 'tables',
  title: 'Tables',
  type: 'group',
  children: [
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/admin/users',
      icon: icons.HiOutlineUsers
      // breadcrumbs: false
      // target: true
    },
    {
      id: 'food',
      title: 'Foods',
      type: 'item',
      url: '/admin/food',
      icon: icons.IoFastFoodOutline
      // breadcrumbs: false
      // target: true
    },
    // {
    //   id: 'dish',
    //   title: 'Dish',
    //   type: 'item',
    //   url: '/admin/dish',
    //   icon: icons.BiDish
    //   // breadcrumbs: false
    //   // target: true
    // },
    {
      id: 'feedback',
      title: 'Feedback',
      type: 'item',
      url: '/admin/feedback',
      icon: icons.RiFeedbackLine
      // breadcrumbs: false
      // target: true
    },
    // {
    //   id: 'userlog',
    //   title: 'User Log',
    //   type: 'item',
    //   url: '/admin/userlog',
    //   icon: icons.FaRegFileCode
    //   // breadcrumbs: false
    //   // target: true
    // },
    {
      id: 'blog',
      title: 'Blog',
      type: 'item',
      url: '/admin/blog',
      icon: icons.TfiWrite
      // breadcrumbs: false
      // target: true
    }
  ]
};

export default tables;
