const { syncVtoolsEvents } = require('./vtoolsService');

// Default sync interval: 6 hours
const SYNC_INTERVAL_MS = 6 * 60 * 60 * 1000;

function startScheduledJobs() {
  console.log('[Scheduler] Initializing automated vTools events sync worker...');
  
  // Initial sync attempt on server boot
  setTimeout(async () => {
    try {
      await syncVtoolsEvents();
    } catch (err) {
      console.error('[Scheduler] Initial vTools sync failed:', err.message);
    }
  }, 10000); // 10s after server start

  // Periodic interval loop
  setInterval(async () => {
    try {
      console.log('[Scheduler] Executing scheduled vTools sync...');
      await syncVtoolsEvents();
    } catch (err) {
      console.error('[Scheduler] Scheduled vTools sync error:', err.message);
    }
  }, SYNC_INTERVAL_MS);
}

module.exports = {
  startScheduledJobs
};
