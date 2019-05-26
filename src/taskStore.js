import PouchyStore from 'pouchy-store';

class TaskStore extends PouchyStore {

  get name() {
    return this._name;
  }

  setName(dbName) {
    this._name = dbName;
  }

  get urlRemote() {
    return "http://13.250.43.79:5984";
  }

  get optionsRemote() {
    return {
      auth: {
	    username: 'admin',
	    password: 'iniadmin',
	  }
    };
  }
}

export default new TaskStore();