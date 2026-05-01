import {createBrowserRouter} from "react-router-dom";

import {ProtectedRoute} from "@/features/auth/ui/ProtectedRoute";
import {LoginPage} from "@/pages/LoginPage/LoginPage";
import {HabitsPage} from "@/pages/HabitsPage/HabitsPage";
import {HabitDetailPage} from "@/pages/HabitDetailPage/HabitDetailPage";
import {StatsPage} from "@/pages/StatsPage/StatsPage";
import {ProfilePage} from "@/pages/ProfilePage/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HabitsPage />,
      },
      {
        path: "/habit/:id",
        element: <HabitDetailPage />,
      },
      {
        path: "/stats",
        element: <StatsPage />,
      },
      {
        path: "/profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
