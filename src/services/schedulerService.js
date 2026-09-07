const scheduleStore = require('./scheduleStore');

class SchedulerService {
  constructor(whatsappService) {
    this.whatsappService = whatsappService;
    this.intervalRef = null;
  }

  start() {
    if (this.intervalRef) return;

    this.intervalRef = setInterval(async () => {
      try {
        const dueItems = await scheduleStore.getPendingSchedules();
        if (!dueItems.length) return;

        for (const item of dueItems) {
          try {
            await this.whatsappService.sendMessage(
              item.targetType,
              item.targetValue,
              item.message,
              { buttons: item.buttons }
            );
            await scheduleStore.markSent(item.id);
            console.log(
              `[SCHEDULER] Sent #${item.id} to ${item.targetType}:${item.targetValue}`
            );
          } catch (error) {
            if (error.message === 'WhatsApp client is not ready') {
              console.log(`[SCHEDULER] Waiting WA ready, retry #${item.id}...`);
              continue;
            }

            await scheduleStore.markFailed(item.id, error.message);
            console.error(`[SCHEDULER] Failed #${item.id}:`, error.message);
          }
        }
      } catch (error) {
        console.error('[SCHEDULER] Tick failed:', error.message);
      }
    }, 5000);

    console.log('[SCHEDULER] Running every 5 seconds');
  }
}

module.exports = SchedulerService;
