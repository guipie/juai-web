/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { RouteComponent } from "vue-router";
import type { LastLevelRouteKey, RouteLayout } from "@elegant-router/types";

import BaseLayout from "@/layouts/base-layout/index.vue";
import BlankLayout from "@/layouts/blank-layout/index.vue";

export const layouts: Record<RouteLayout, RouteComponent | (() => Promise<RouteComponent>)> = {
  base: BaseLayout,
  blank: BlankLayout,
};

export const views: Record<LastLevelRouteKey, RouteComponent | (() => Promise<RouteComponent>)> = {
  403: () => import("@/views/_builtin/403/index.vue"),
  404: () => import("@/views/_builtin/404/index.vue"),
  500: () => import("@/views/_builtin/500/index.vue"),
  login: () => import("@/views/_builtin/login/index.vue"),
  about: () => import("@/views/about/index.vue"),
  application: () => import("@/views/application/index.vue"),
  "chat-share": () => import("@/views/chat-share/[id].vue"),
  chat: () => import("@/views/chat/index.vue"),
  drawing_home: () => import("@/views/drawing/home/index.vue"),
  drawing_tool: () => import("@/views/drawing/tool/[name].vue"),
  home: () => import("@/views/home/index.vue"),
  invite_pay: () => import("@/views/invite/pay/index.vue"),
  invite_user: () => import("@/views/invite/user/index.vue"),
  voice: () => import("@/views/voice/index.vue"),
};
