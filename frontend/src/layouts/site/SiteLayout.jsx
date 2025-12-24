import Header from "@/components/site/header/Header";
import Footer from "@/components/site/footer/Footer";
import { Outlet } from "react-router-dom";

const SiteLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[calc(100vh-64px)] bg-white">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default SiteLayout;
