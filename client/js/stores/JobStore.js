import { List } from 'immutable';

import api from '../lib/api';
import Flux from '../dispatcher/dispatcher';

let _jobs = new List();

const JobStore = Flux.createStore({
  getJobs() {
    return _jobs;
  },

  loadJobs() {
    return api.loadJobs()
    .then((data) => {
      _jobs = data;
    });
  }
}, function(payload) {
  switch (payload.actionType) {
  case "LOAD_JOBS":
    JobStore.loadJobs().then(() => JobStore.emitChange());
    break;
  default:
    return true;
  }
});

export default JobStore;
