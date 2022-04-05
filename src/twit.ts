import Twit from 'twit';

export const twit = new Twit({
  consumer_key: process.env.CONSUMER_KEY as string,
  consumer_secret: process.env.CONSUMER_SECRET as string,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});
