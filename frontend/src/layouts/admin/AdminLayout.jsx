
import { Spin } from 'antd';
import { Outlet } from "react-router-dom";

import { Suspense, useState } from "react";
import Sidebar from "@/components/admin/sideBar/Sidebar";
import Header from "@/components/admin/Header";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="grow">
          <Suspense fallback={<Spin size='large'/>}>
            <Outlet />
          </Suspense>
        </div>
        {/* <AppFooter /> */}
      </div>
    </div>
  );
};

export default AdminLayout;
