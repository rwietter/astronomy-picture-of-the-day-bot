/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-shadow */
import { fetchAstronomyPicture } from './fech-apod';
import { twit } from './twit';

require('dotenv').config();

const postTwt = async () => {
  try {
    const {
      imgB64, hdurl, title, copyright, date,
    } = await fetchAstronomyPicture();

    const altText = `${`"${title}"`}\n\nCopyright: ${copyright}\nDate: ${date}\n\nhdUrl: ${hdurl}`;

    twit.post('media/upload', { media_data: imgB64 }, (err: any, data: any) => {
      const mediaIdStr = data.media_id_string;
      const metaParams = { media_id: mediaIdStr, alt_text: { text: altText } };

      twit.post('media/metadata/create', metaParams, (err: any) => {
        if (err) {
          console.error('Error on create metadata: ', err);
          return;
        }

        if (!err) {
          const params = {
            status: altText,
            media_ids: [mediaIdStr],
          };

          twit.post('statuses/update', params, (err: Error) => {
            if (err) throw err;

            console.log('Success!');
          });
        }
      });
    });
  } catch (error) {
    console.log(error);
  }
};

postTwt();
