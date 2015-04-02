import Flux from '../dispatcher/dispatcher';

const JobActions = Flux.createActions({
  loadJobs() {
    return {
      actionType: "LOAD_JOBS"
    };
  },

  loadJobBuilds(jobName) {
    return {
      actionType: "LOAD_BUILDS",
      job: jobName
    };
  }
});

export default JobActions;
