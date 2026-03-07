export interface PriceAlert {
  id: string;
  symbol: string;
  condition: 'above' | 'below';
  threshold: number;
  active: boolean;
  createdAt: number;
}

export interface TriggeredAlert extends PriceAlert {
  currentPrice: number;
  triggeredAt: number;
}

export class AlertService {
  private alerts: Map<string, PriceAlert[]> = new Map();
  private triggeredAlerts: TriggeredAlert[] = [];

  createAlert(username: string, symbol: string, condition: 'above' | 'below', threshold: number): PriceAlert {
    const alert: PriceAlert = {
      id: `alert_${Date.now()}_${Math.random()}`,
      symbol,
      condition,
      threshold,
      active: true,
      createdAt: Date.now()
    };

    const userAlerts = this.alerts.get(username) || [];
    userAlerts.push(alert);
    this.alerts.set(username, userAlerts);

    return alert;
  }

  getUserAlerts(username: string): PriceAlert[] {
    return this.alerts.get(username) || [];
  }

  deleteAlert(username: string, alertId: string): boolean {
    const userAlerts = this.alerts.get(username) || [];
    const filtered = userAlerts.filter(a => a.id !== alertId);
    
    if (filtered.length === userAlerts.length) {
      return false;
    }

    this.alerts.set(username, filtered);
    return true;
  }

  checkAlerts(username: string, symbol: string, currentPrice: number): TriggeredAlert[] {
    const userAlerts = this.alerts.get(username) || [];
    const triggered: TriggeredAlert[] = [];

    userAlerts.forEach(alert => {
      if (!alert.active || alert.symbol !== symbol) return;

      const shouldTrigger = 
        (alert.condition === 'above' && currentPrice >= alert.threshold) ||
        (alert.condition === 'below' && currentPrice <= alert.threshold);

      if (shouldTrigger) {
        alert.active = false;
        const triggeredAlert: TriggeredAlert = {
          ...alert,
          currentPrice,
          triggeredAt: Date.now()
        };
        triggered.push(triggeredAlert);
        this.triggeredAlerts.push(triggeredAlert);
      }
    });

    return triggered;
  }

  getTriggeredAlerts(username: string): TriggeredAlert[] {
    return this.triggeredAlerts.filter(alert => {
      const userAlerts = this.alerts.get(username) || [];
      return userAlerts.some(a => a.id === alert.id);
    });
  }

  clearTriggeredAlerts(username: string): void {
    const userAlerts = this.alerts.get(username) || [];
    const userAlertIds = new Set(userAlerts.map(a => a.id));
    this.triggeredAlerts = this.triggeredAlerts.filter(a => !userAlertIds.has(a.id));
  }
}
