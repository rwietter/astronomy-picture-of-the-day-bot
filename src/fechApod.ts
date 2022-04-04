/* eslint-disable import/no-import-module-exports */
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
  const response = await http.get(APOD_URL);

  if (!response.data) {
    throw new Error('Não foi possível obter astronomy picture today');
  }

  const {
    hdurl, url, title, copyright, date,
  }: ApodType = response.data;

  const imgB64 = await imgToB64(hdurl ?? url);

  return {
    imgB64,
    hdurl,
    title,
    copyright,
    date,
  };
};

export { fetchAstronomyPicture };
