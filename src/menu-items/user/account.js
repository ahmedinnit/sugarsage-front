// assets
import { IdcardOutlined, MedicineBoxOutlined, FileTextOutlined } from '@ant-design/icons'; // Importing appropriate icons from Ant Design

// icons
const icons = {
  IdcardOutlined,
  MedicineBoxOutlined,
  FileTextOutlined
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const account = {
  id: 'account',
  title: 'Account',
  type: 'group',
  children: [
    {
      id: 'uprofile',
      title: 'User Profile',
      type: 'item',
      url: '/user/uprofile',
      icon: icons.IdcardOutlined // Icon for User Profile
    },
    {
      id: 'hprofile',
      title: 'Health Profile',
      type: 'item',
      url: '/user/hprofile',
      icon: icons.MedicineBoxOutlined // Icon for Health Profile
    }
    // {
    //   id: 'terms',
    //   title: 'Terms and Conditions',
    //   type: 'item',
    //   url: '/user/tac',
    //   icon: icons.FileTextOutlined // Icon for Terms and Conditions
    // }
  ]
};

export default account;
