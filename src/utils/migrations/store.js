const connect = require('./connect');

class MigrationStore {
  constructor() {
    this.collectionName = '_migrations';
  }

  async load(migrationCallback) {
    const actionCallback = async collection => {
      const store = await collection.findOne();
      return store || {};
    };

    return this.doAction(migrationCallback, actionCallback);
  }

  async save(set, migrationCallback) {
    const actionCallback = async collection => {
      const { migrations, lastRun } = set;
      return collection.replaceOne({}, { migrations, lastRun }, { upsert: true });
    };

    return this.doAction(migrationCallback, actionCallback);
  }

  async doAction(migrationCallback, actionCallback) {
    let client;
    try {
      client = await connect();
      const collection = client.db().collection(this.collectionName);
      const result = await actionCallback(collection);
      migrationCallback(undefined, result);
    } catch (error) {
      migrationCallback(error);
    } finally {
      try {
        await client.close();
      } catch (error) {
        // ignore
      }
    }
  }
}

module.exports = MigrationStore;
