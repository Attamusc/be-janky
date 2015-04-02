import { List } from 'immutable';

import api from '../lib/api';
import Flux from '../dispatcher/dispatcher';

let _builds = new List();

const BuildStore = Flux.createStore({
  getBuilds() {
    return _builds;
  },

  loadBuilds(job) {
    return api.loadBuilds(job)
    .then((data) => {
      _builds = data;
    });
  }
}, function(payload) {
  switch (payload.actionType) {
  case "LOAD_BUILDS":
    BuildStore.loadBuilds(payload.job)
      .then(() => BuildStore.emitChange());
    break;
  default:
    return true;
  }
});

export default BuildStore;
