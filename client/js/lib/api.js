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
  }
};

export default api;
