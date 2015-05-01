import Flux from '../dispatcher/dispatcher';

const BuildActions = Flux.createActions({
  loadBuild(job, buildId) {
    return {
      actionType: "LOAD_BUILD",
      job: job,
      buildId: buildId
    };
  },

  loadBuildConsole(job, number, offset) {
    return {
      actionType: "LOAD_BUILD_CONSOLE",
      job: job,
      number: number,
      offset: offset
    };
  }
});

export default BuildActions;
