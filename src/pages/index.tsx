import { lazy } from "react";

const AdminDashboardPage = lazy(() => import("./[admin]dashboard"))
const AdminLoginPage = lazy(() => import("./[admin]login"))
const AdminLeaderboardPage = lazy(() => import("./[admin] leaderboard"))

const ImageUploadPage = lazy(() => import("./upload"))
const LoginPage = lazy(() => import("./login"))
const RegisterPage = lazy(() => import("./register"))


export { AdminDashboardPage, AdminLoginPage, AdminLeaderboardPage, ImageUploadPage, LoginPage, RegisterPage }