import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("api/images/*", "routes/api/images.ts"),
] satisfies RouteConfig;
