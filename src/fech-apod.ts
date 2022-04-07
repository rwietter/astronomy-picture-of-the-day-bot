import http from 'axios';
import imgToB64 from 'image-to-base64';

require('dotenv').config();

type ApodType = {
  hdurl: string;
  url: string;
  title: string;
  copyright: string;
  date: string;
};

const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`;

const fetchAstronomyPicture = async () => {
  try {
    const response = await http.get(APOD_URL);

    if (!response.data) {
      throw new Error('Could not fetch image');
    }

    const {
      hdurl, url, title, copyright, date,
    }: ApodType = response.data;

    if (!url) throw new Error('Invalid image');

    const imgB64 = await imgToB64(url);

    return {
      imgB64,
      hdurl,
      title,
      copyright,
      date,
    };
  } catch (error) {
    console.error(error);
    return {};
  }
};

export { fetchAstronomyPicture };
