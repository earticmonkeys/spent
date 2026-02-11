declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAOptions {
    dest: string;
    disable?: boolean;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: any;
  }

  function withPWA(options: PWAOptions): (config: NextConfig) => NextConfig;

  export default withPWA;
}
