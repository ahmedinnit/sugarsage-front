// assets
// import { PieChartOutlined } from '@ant-design/icons'; // Importing the new icon from Ant Design
import { AppstoreOutlined, FundOutlined } from '@ant-design/icons';

// icons
const icons = {
  AppstoreOutlined,
  FundOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/user/dashboard',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
