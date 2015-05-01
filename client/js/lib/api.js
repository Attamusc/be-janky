import xhr from './xhr';

const api = {
  loadJobs() {
    return xhr({
      url: '/api/jobs',
      method: 'get'
    });
  },

  loadBuilds(job) {
    return xhr({
      url: '/api/jobs/' + job,
      method: 'get'
    })
    .then((data) => {
      return data.get('builds');
    });
  },

  loadBuild(job, number) {
    return xhr({
      url: '/api/jobs/' + job + '/' + number,
      method: 'get'
    });
  },

  loadBuildConsole(job, number, offset) {
    return xhr({
      url: '/api/jobs/' + job + '/' + number + '/console',
      data: { start: offset },
      method: 'get'
    });
  }
};

export default api;
