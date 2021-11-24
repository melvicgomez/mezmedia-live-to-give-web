import Pusher from 'pusher-js';

const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
  cluster: process.env.PUSHER_APP_CLUSTER,
});

pusher.subscribe('activity-feed');
pusher.subscribe('challenge');
pusher.subscribe('live-session');
pusher.subscribe('meetup');
pusher.subscribe('admin');

export default pusher;
