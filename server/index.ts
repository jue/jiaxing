import next from 'next';
import server, { server1 } from './app';
import { PORT, INTERNAL_PORT, dev } from './config';

import beforeServerStart from './beforeServerStart';
import scheduleCronstyle from './services/ProgressSchedule';
import progressSchedule from './schedule/progressSchedule';
import qualityInspectSchedule from './schedule/qualityInspectSchedule';
import securityRisksHiddenPerilsSchedule from './schedule/securityRisksHiddenPerilsSchedule';

import nextRoutes from './next.routes';

async function main() {
  await beforeServerStart();
  await scheduleCronstyle();

  await progressSchedule();
  await qualityInspectSchedule();
  await securityRisksHiddenPerilsSchedule();

  const app = next({ dev });
  await app.prepare();

  const nextRoutesHandler = nextRoutes.getRequestHandler(app);
  server.use(nextRoutesHandler);

  const port = parseInt(PORT || '3000', 10);
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
  server1.listen(INTERNAL_PORT || '3001', (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:3001`);
  });
}

main();
