import React from "react";

function DashboardCard12({ recentActivities }) {
  // Map type thành màu và icon
  const typeConfig = {
    ORDER: {
      bg: "bg-violet-500",
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 36 36">
          <path d="M18 10c-4.4 0-8 3.1-8 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7zm4 10.8v2.3L18.9 22H18c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8z" />
        </svg>
      ),
    },
    REVIEW: {
      bg: "bg-green-500",
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 36 36">
          <path d="M15 13v-3l-5 4 5 4v-3h8a1 1 0 000-2h-8zM21 21h-8a1 1 0 000 2h8v3l5-4-5-4v3z" />
        </svg>
      ),
    },
    WISHLIST: {
      bg: "bg-red-500",
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 36 36">
          <path d="M25 24H11a1 1 0 01-1-1v-5h2v4h12v-4h2v5a1 1 0 01-1 1zM14 13h8v2h-8z" />
        </svg>
      ),
    },
    PAYMENT: {
      bg: "bg-sky-500",
      icon: (
        <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 36 36">
          <path d="M23 11v2.085c-2.841.401-4.41 2.462-5.8 4.315-1.449 1.932-2.7 3.6-5.2 3.6h-1v2h1c3.5 0 5.253-2.338 6.8-4.4 1.449-1.932 2.7-3.6 5.2-3.6h3l-4-4zM15.406 16.455c.066-.087.125-.162.194-.254.314-.419.656-.872 1.033-1.33C15.475 13.802 14.038 13 12 13h-1v2h1c1.471 0 2.505.586 3.406 1.455zM24 21c-1.471 0-2.505-.586-3.406-1.455-.066.087-.125.162-.194.254-.316.422-.656.873-1.028 1.328.959.878 2.108 1.573 3.628 1.788V25l4-4h-3z" />
        </svg>
      ),
    },
  };

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">
          Hoạt động gần đây
        </h2>
      </header>
      <div className="p-3">
        <ul className="my-1 h-[30rem] overflow-y-scroll">
          {recentActivities.map((activity, index) => {
            const cfg = typeConfig[activity.type] || typeConfig.ORDER;
            return (
              <li key={index} className="flex px-2">
                <div
                  className={`w-9 h-9 rounded-full shrink-0 ${cfg.bg} my-2 mr-3 flex items-center justify-center`}
                >
                  {cfg.icon}
                </div>
                <div className="grow flex items-center border-b border-gray-100 dark:border-gray-700/60 text-sm py-2">
                  <div className="grow flex justify-between">
                    <div className="self-center text-gray-800 dark:text-gray-100">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.description}
                    </div>
                    <div className="shrink-0 self-end ml-2">
                      <span className="font-medium text-violet-500 dark:hover:text-violet-400">
                        {activity.amount
                          ? `${(activity.amount).toLocaleString()}₫`
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default DashboardCard12;
