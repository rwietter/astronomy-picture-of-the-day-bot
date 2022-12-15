import { fetchAstronomyPicture } from './fech-apod';
import { twit } from './twit';
import { Post } from '../types/post'

require('dotenv').config();

const formatText  = ({title = '', copyright =  '', date = '', hdurl = ''}: Post) => {
  const res = {
    title: title && `"${title}"\n\n`,
    copyright: copyright && `Copyright: ${copyright}\n`,
    date: date && `Date: ${date}\n\n`,
    hdurl: hdurl && `hdurl: ${hdurl}\n\n`,
    hashtags: `#NASA #Astronomy #Space #AstronomyPictureOfTheDay #APOD @NASA`,
  }

  return Object.values(res).join('');
}

const postTwt = async () => {
  try {
    const {
      imgB64, hdurl, title, copyright, date,
    } = await fetchAstronomyPicture();

    const tweet = formatText({
      title, copyright, date, hdurl,
    });

    twit.post('media/upload', { media_data: imgB64 }, (err: any, data: any) => {
      const mediaIdStr = data.media_id_string;
      const metaParams = { media_id: mediaIdStr, alt_text: { text: tweet } };

      twit.post('media/metadata/create', metaParams, (err: any) => {
        if (err) {
          return false;
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
