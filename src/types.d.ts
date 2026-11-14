interface BatteryInfo {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
  deviceMemory?: number | undefined;
}