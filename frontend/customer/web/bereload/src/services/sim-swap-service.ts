export class SimSwapService {
    private static instance: SimSwapService;
    
    private _requests: Array<{
      date: string;
      status: string;
      oldNumber: string;
      newNumber: string;
      reason: string;
    }> = [
      {
        date: '25 Jan 2025',
        status: 'Completed',
        oldNumber: '+32493454910',
        newNumber: '+32494590891',
        reason: 'Network issue',
      }
    ];
  
    private constructor() {}
  
    public static getInstance(): SimSwapService {
      if (!SimSwapService.instance) {
        SimSwapService.instance = new SimSwapService();
      }
      return SimSwapService.instance;
    }
  
    get requests() {
      return this._requests;
    }
  
    addRequest(request: {
      date: string;
      status: string;
      oldNumber: string;
      newNumber: string;
      reason: string;
    }) {
      this._requests.unshift(request); 
    }
  }
  
  export function formatCurrentDate(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    
    return `${day} ${month} ${year}`;
  }
  
  export default SimSwapService.getInstance();