// assets
import { HiOutlineUsers } from 'react-icons/hi';
import { GiMeal } from 'react-icons/gi';
import { MdHealthAndSafety } from 'react-icons/md';
import { BiRun } from 'react-icons/bi';
import { AiOutlineMessage } from 'react-icons/ai';
import { MdOutlineArticle } from 'react-icons/md'; // New icon for Blogs

// icons
const icons = {
  HiOutlineUsers,
  GiMeal,
  MdHealthAndSafety,
  BiRun,
  AiOutlineMessage,
  MdOutlineArticle
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const services = {
  id: 'services',
  title: 'Services',
  type: 'group',
  children: [
    {
      id: 'getmealplan',
      title: 'Meal Planning',
      type: 'item',
      url: '/user/mealplan',
      icon: icons.GiMeal
      // breadcrumbs: false
      // target: true
    },
    // {
    //   id: 'healthtracker',
    //   title: 'Health Tracker',
    //   type: 'item',
    //   url: '/user/healthtrack',
    //   icon: icons.MdHealthAndSafety
    //   // breadcrumbs: false
    //   // target: true
    // },
    // {
    //   id: 'activitytracker',
    //   title: 'Activity Tracker',
    //   type: 'item',
    //   url: '/user/activitytrack',
    //   icon: icons.BiRun
    //   // breadcrumbs: false
    //   // target: true
    // },
    {
      id: 'feedback',
      title: 'Feedback',
      type: 'item',
      url: '/user/feedback',
      icon: icons.AiOutlineMessage
      // breadcrumbs: false
      // target: true
    },
    {
      id: 'blogs',
      title: 'Blogs',
      type: 'item',
      url: '/user/blogs',
      icon: icons.MdOutlineArticle
      // breadcrumbs: false
      // target: true
    }
  ]
};

export default services;
