/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-shadow */
import Twit from 'twit';
import { fetchAstronomyPicture } from './fechApod';

require('dotenv').config();

const T = new Twit({
  consumer_key: process.env.CONSUMER_KEY as string,
  consumer_secret: process.env.CONSUMER_SECRET as string,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
});

const postTwt = async () => {
  const {
    imgB64, hdurl, title, copyright, date,
  } = await fetchAstronomyPicture();
  const altText = `${`"${title}"`}\n\nCopyright: ${copyright}\nDate: ${date}\n\nhdUrl: ${hdurl}`;

  T.post('media/upload', { media_data: imgB64 }, (err: any, data: any) => {
    const mediaIdStr = data.media_id_string;
    const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } };

    T.post('media/metadata/create', metaParams, (err: any) => {
      if (!err) {
        const params = {
          status: altText,
          media_ids: [mediaIdStr],
        };

        T.post('statuses/update', params);
      }
    });
  });
};

postTwt();
