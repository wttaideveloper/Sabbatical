export default {
  type: 'content-api',
  routes: [
    {
      method: 'POST',
      path: '/publish',
      handler: 'publish.publish',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
