interface BatteryInfo {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
}

interface NetworkInformation {
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

interface Navigator {
  getBattery?: () => Promise<BatteryManager>;
  deviceMemory?: number;
  connection?: NetworkInformation;
}

interface MediaTrackSettings {
  voiceIsolation?: boolean;
  latency?: number;
  focusMode?: string;
  facingMode?: string;
  exposureMode?: string;
  whiteBalanceMode?: string;
  zoom?: number;
  torch?: boolean;
}
