import { fetchAstronomyPicture } from './fech-apod';
import { twit } from './twit';

require('dotenv').config();

const validateProps = ({
  title, copyright, date, hdurl,
}: any) => {
  const formatTwt = [];
  if (typeof title !== 'undefined') {
    formatTwt.push(`"${title}"\n\n`);
  }
  if (typeof copyright !== 'undefined') {
    formatTwt.push(`Copyright: ${copyright}\n`);
  }
  if (typeof date !== 'undefined') {
    formatTwt.push(`Date: ${date}\n\n`);
  }
  if (typeof hdurl !== 'undefined') {
    formatTwt.push(`hdurl: ${hdurl}`);
  }
  return formatTwt.join('').toString();
};

const postTwt = async () => {
  try {
    const {
      imgB64, hdurl, title, copyright, date,
    } = await fetchAstronomyPicture();
    console.log(copyright);

    const tweet = validateProps({
      title, copyright, date, hdurl,
    });

    twit.post('media/upload', { media_data: imgB64 }, (err: any, data: any) => {
      const mediaIdStr = data.media_id_string;
      const metaParams = { media_id: mediaIdStr, alt_text: { text: tweet } };

      twit.post('media/metadata/create', metaParams, (err: any) => {
        if (err) {
          console.error('Error on create metadata: ', err);
          return;
        }

        if (!err) {
          const params = {
            status: tweet,
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
