import { 
  DashboardOutlined, 
  ShoppingOutlined, 
  MessageOutlined, 
  SettingOutlined,
  SafetyOutlined,
  UserOutlined,
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  CalendarOutlined,
  BellOutlined,
  AppstoreOutlined,
  SkinOutlined,
  EuroOutlined,
  ShoppingCartOutlined,
  UnorderedListOutlined ,
  GitlabOutlined
} from '@ant-design/icons';

export const menuConfig = {
  pages: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: DashboardOutlined,
      path: '/admin'
    },
    // {
    //   id: 'ecommerce',
    //   label: 'E-Commerce',
    //   icon: ShoppingOutlined,
    //   children: [
    //     { label: 'Customers', path: '/ecommerce/customers' },
    //     { label: 'Orders', path: '/ecommerce/orders' },
    //     { label: 'Invoices', path: '/ecommerce/invoices' },
    //     { label: 'Shop', path: '/ecommerce/shop' },
    //     { label: 'Shop 2', path: '/ecommerce/shop-2' },
    //     { label: 'Single Product', path: '/ecommerce/product' },
    //     { label: 'Cart', path: '/ecommerce/cart' },
    //     { label: 'Cart 2', path: '/ecommerce/cart-2' },
    //     { label: 'Cart 3', path: '/ecommerce/cart-3' },
    //     { label: 'Pay', path: '/ecommerce/pay' }
    //   ]
    // },  
    {
      id: 'category',
      label: 'Categories',
      path: '/admin/categories',
      icon: UnorderedListOutlined 
    },
    {
      id: 'brand',
      label: 'Brands',
      path: '/admin/brands',
      icon: GitlabOutlined 
    },
    {
      id: 'user',
      label: 'Users',
      path: '/admin/users',
      icon: TeamOutlined
    },
    {
      id: 'product',
      label: 'Products',
      path: '/admin/products',
      icon: SkinOutlined
    },
    {
      id: 'shipping-fee',
      label: 'Shipping Fees',
      path: '/admin/shipping-fees',
      icon: EuroOutlined
    },
    {
      id: 'order',
      label: 'Orders',
      path: '/admin/orders',
      icon: ShoppingCartOutlined 
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: SettingOutlined,
      children: [
        { label: 'My Account', path: '/settings/account' },
        { label: 'My Notifications', path: '/settings/notifications' },
        { label: 'Connected Apps', path: '/settings/apps' },
        { label: 'Plans', path: '/settings/plans' },
        { label: 'Billing & Invoices', path: '/settings/billing' }
      ]
    }
  ],
  more: [
    {
      id: 'authentication',
      label: 'Authentication',
      icon: SafetyOutlined,
      children: [
        { label: 'Sign in', path: '/auth/signin' },
        { label: 'Sign up', path: '/auth/signup' },
        { label: 'Reset Password', path: '/auth/reset' }
      ]
    },
    {
      id: 'components',
      label: 'Components',
      icon: AppstoreOutlined,
      children: [
        { label: 'Button', path: '/components/button' },
        { label: 'Input Form', path: '/components/form' },
        { label: 'Dropdown', path: '/components/dropdown' },
        { label: 'Modal', path: '/components/modal' }
      ]
    }
  ]
};