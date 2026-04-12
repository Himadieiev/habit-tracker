import {createBrowserRouter} from "react-router-dom";

import {HabitsPage} from "@/pages/HabitsPage/HabitsPage";
import {LoginPage} from "@/pages/LoginPage/LoginPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <HabitsPage />,
  },
]);
