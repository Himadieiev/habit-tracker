import {createBrowserRouter} from "react-router-dom";

import {LoginPage} from "@/pages/LoginPage/LoginPage";
import {HabitsPage} from "@/pages/HabitsPage/HabitsPage";
import {ProtectedRoute} from "@/features/auth/ui/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <HabitsPage />
      </ProtectedRoute>
    ),
  },
]);
