import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';
import cookieParser from 'cookie-parser';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

const server = polka() // You can also use Express
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    cookieParser(),
    sapper.middleware({
      session: (req, res) => {
        const { jwt_access } = req.cookies;
        return {
          signedIn: !!jwt_access
        };
      }
    })
  );

server.listen(PORT, err => {
  if (err) console.log('error', err);
});
