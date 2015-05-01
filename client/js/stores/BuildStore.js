import { List } from 'immutable';

import api from '../lib/api';
import Flux from '../dispatcher/dispatcher';

let _builds = new List();

const BuildStore = Flux.createStore({
  getBuilds() {
    return _builds;
  },

  getBuild() {
    return _builds.first();
  },

  clearBuilds() {
    _builds = new List();
  },

  loadBuilds(job) {
    return api.loadBuilds(job)
    .then((data) => {
      _builds = data;
    });
  },

  loadBuild(job, buildId) {
    return api.loadBuild(job, buildId)
    .then((data) => {
      _builds = List([data]);
    });
  }
}, function(payload) {
  switch (payload.actionType) {
  case 'LOAD_BUILDS':
    BuildStore.clearBuilds();
    BuildStore.loadBuilds(payload.job)
      .then(() => BuildStore.emitChange());
    break;
  case 'LOAD_BUILD':
    BuildStore.clearBuilds();
    BuildStore.loadBuild(payload.job, payload.buildId)
      .then(() => BuildStore.emitChange());
    break;
  default:
    return true;
  }
});

export default BuildStore;
