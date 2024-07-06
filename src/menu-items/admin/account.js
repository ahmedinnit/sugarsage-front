// assets
// import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';

import { AccountCircleOutlined } from '@mui/icons-material';

// icons
const icons = {
  // ChromeOutlined,
  // QuestionOutlined
  AccountCircleOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const account = {
  id: 'account',
  title: 'Account',
  type: 'group',
  children: [
    {
      id: 'profile',
      title: 'Profile',
      type: 'item',
      url: '/admin/profile',
      icon: icons.AccountCircleOutlined
    }
    // {
    //   id: 'logout',
    //   title: 'Log Out',
    //   type: 'item',
    //   // url: 'https://codedthemes.gitbook.io/mantis/',
    //   icon: icons.QuestionOutlined
    //   // external: true,
    //   // target: false
    // }
  ]
};

export default account;
