import { DbVersionModel } from './db_version';

export default async function updateMongoDB() {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  let preDBVersion = await DbVersionModel.findOne({ _id: 'db_version' });
  if (!preDBVersion) {
    preDBVersion = new DbVersionModel({
      _id: 'db_version',
    });
    await preDBVersion.save();
  }

  let preVersion = preDBVersion.version;
  let nextVersion = require('./nextVersion').default;

  if (preVersion === nextVersion) {
    return;
  }

  for (let version = preVersion; version < nextVersion; version++) {
    let updatorFunc = require(`./version/${version}`).default;
    await updatorFunc();
    preDBVersion.version += 1;
    await preDBVersion.save();
  }
}
