import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "desktop" | "electron";

export const useDeviceType = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();

    if (ua.includes("electron")) {
      setDeviceType("electron");
    } else if (/android|iphone|ipad|mobile/.test(ua)) {
      setDeviceType("mobile");
    } else {
      setDeviceType("desktop");
    }
  }, []);

  return deviceType;
};
