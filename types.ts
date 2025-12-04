export interface Period {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  agenda?: string;
}

export interface Schedule {
  id: string;
  name: string;
  periods: Period[];
}
