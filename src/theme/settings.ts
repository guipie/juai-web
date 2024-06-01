/** Default theme settings */
export const themeSettings: App.Theme.ThemeSetting = {
  themeScheme: "dark",
  themeColor: "#4b9e5f",
  otherColor: { info: "#2080f0", success: "#52c41a", warning: "#faad14", error: "#f5222d" },
  isInfoFollowPrimary: true,
  layout: { mode: "vertical-mix", scrollMode: "content" },
  page: {
    animate: true,
    animateMode: "fade"
  },
  header: {
    height: 50,
    breadcrumb: { visible: true, showIcon: true }
  },
  tab: {
    visible: true,
    cache: true, height: 35, mode: "chrome"
  },
  fixedHeaderAndTab: true,
  sider: {
    inverted: false,
    width: 220,
    collapsedWidth: 64,
    mixWidth: 85,
    mixCollapsedWidth: 60,
    mixChildMenuWidth: 180
  },
  footer: { visible: true, fixed: false, height: 30, right: true }
};
/**
 * Override theme settings
 *
 * If publish new version, use `overrideThemeSettings` to override certain theme settings
 */
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {};
