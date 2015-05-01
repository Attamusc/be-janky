import { Map } from 'immutable';

import api from '../lib/api';
import Flux from '../dispatcher/dispatcher';

let _console = Map({});

const ConsoleStore = Flux.createStore({
  getConsole() {
    return _console;
  },

  loadConsole(job, number, offset) {
    return api.loadBuildConsole(job, number, offset)
    .then((data) => {
      _console = data;
    });
  }
}, function(payload) {
  switch (payload.actionType) {
  case "LOAD_BUILD_CONSOLE":
    ConsoleStore.loadConsole(
      payload.job,
      payload.number,
      payload.offset
    ).then(() => ConsoleStore.emitChange());
    break;
  default:
    return true;
  }
});

export default ConsoleStore;
