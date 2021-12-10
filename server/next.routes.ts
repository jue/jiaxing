import routes from 'next-routes';
const nextRoutes = new routes()
  .add('/quality/inspectPlan/:action', '/quality/inspectPlan')
  .add('/quality/inspectPlan/:action(edit|view)/:_id', '/quality/inspectPlan')

  .add('/quality/inspectReport/:action', '/quality/inspectReport')
  .add(
    '/quality/inspectReport/:action(edit|view)/:_id',
    '/quality/inspectReport'
  )
  //质量检查
  .add('/quality/v2/inspection/:action', '/quality/v2/inspection')
  .add(
    '/quality/v2/inspection/:action(edit|view)/:_id',
    '/quality/v2/inspection'
  )
  //隐患排查
  .add('/safety/hiddenDanger/:action', '/safety/hiddenDanger')
  .add('/safety/hiddenDanger/:action(edit|view)/:_id', '/safety/hiddenDanger')

  //.add('/engineering/changeList/:action', '/engineering/changeList')
  .add('/engineering/changeList/:action/:_id', '/engineering/changeList')
  .add(
    '/authority/personnel/:action(create|edit)/:_id?',
    '/authority/personnel/edit'
  );
export const Router = nextRoutes.Router;

export default nextRoutes;
