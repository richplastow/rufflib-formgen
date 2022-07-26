// rufflib-formulate/server.js

// A specialised server, designed for developing and testing RuffLIB Formulate.

/* --------------------------------- Imports -------------------------------- */

import child_process from 'child_process';
import fs from 'fs';
import http from 'node:http';
import { Transform } from 'stream';


/* -------------------------------- Constants ------------------------------- */

const hostname = '127.0.0.1'; // localhost
const port = 4321;


/* ----------------------------------- Env ---------------------------------- */

// `npm start --open` or `npm start -o` means we should open a browser window.
const doOpen = process.env.npm_config_open || process.env.npm_config_o;

// `npm start --src` means we should use the 'src/docs/' folder, not 'docs/'.
const dir = process.env.npm_config_src ? 'src/docs' : 'docs';

// `npm start --test` or `npm start -t` opens run-browser-tests.html not index.html.
const doTest = process.env.npm_config_test || process.env.npm_config_t;


/* --------------------------------- Server --------------------------------- */

// Defines a transformer which will change an HTML page’s RUFFLIB_ENV from
// 'public' to 'source', if the `--src` option was set.
// Note that a new Transformer must be created for each request.
const setEnvironmentToSource = () => new Transform({
    transform: (chunk, _encoding, done) => {
        const chunkStr = chunk.toString();
        const needle = "<script>window.RUFFLIB_ENV='public'</script>";
        done(
            null,
            chunkStr.includes(needle)
                ? chunkStr.replace(needle, "<script>window.RUFFLIB_ENV='source'</script>")
                : chunkStr
        );
    }
});

// Create the server.
const server = http.createServer((req, res) => {

    // Redirect '/' to the homepage.
    const url = req.url === '/' ? '/index.html' : req.url;

    // Set up the file-stream reader for this request.
    // This usually points to a file in 'docs/' or 'src/docs/', but sometimes
    // '<script type="importmap">' needs access to 'src/' or 'node_modules/'.
    const srcProxy = url.includes('__src__')
        ? `src/${url.split('/').slice(url.indexOf('__src__')+1).join('/')}`
        : false;
    const rufflibExpectProxy = url.includes('__rufflib-expect-dist__')
        ? `node_modules/rufflib-expect/dist/${url.split('/').pop()}`
        : false;
    const rufflibValidateProxy = url.includes('__rufflib-validate-dist__')
        ? `node_modules/rufflib-validate/dist/${url.split('/').pop()}`
        : false;
    const readStream = fs.createReadStream(
        srcProxy || rufflibExpectProxy || rufflibValidateProxy || `${dir}${url}`);

    // Serve the file.
    // If the `--src` option was set, and this is an HTML file, change the
    // page’s RUFFLIB_ENV from 'public' to 'source'.
    readStream.on('open', function () {
        res.setHeader('Content-Type', getMimetype(url));
        if (dir === 'src/docs' && url.slice(-5) === '.html')
            readStream.pipe(setEnvironmentToSource()).pipe(res);
        else
            readStream.pipe(res);
    });

    // Respond with a 404 error, probably because the file does not exist.
    readStream.on('error', function () {
        res.setHeader('Content-Type', 'text/plain');
        res.statusCode = 404;
        res.end('Not found');
    });

});

// Start the server.
server.listen(port, hostname, () =>
    console.log(`Serving ${dir}/ at http://${hostname}:${port}/`)
);

// Open a Browser Window, if the '--open' or '-o' command line option was set.
// Visit 'run-browser-tests.html', if the '--test' or '-t' option was set, or
// otherwise visit 'index.html'.
// Based on https://stackoverflow.com/a/49013356
// @TODO test on Windows and Linux
if (doOpen) {
    const openCommand = process.platform === 'darwin'
        ? 'open'
        : process.platform === 'win32'
            ? 'start'
            : 'xdg-open'
    ;
    const filename = doTest
        ? 'test/run-browser-tests.html'
        : 'index.html'
    ;
    const fullUrl = `http://${hostname}:${port}/${filename}`;
    console.log(`Opening ${fullUrl} in your default browser...`);
    child_process.exec(`${openCommand} ${fullUrl}`);
}


/* --------------------------------- Helpers -------------------------------- */

// Infer the Content-Type header from a file extension.
function getMimetype(url) {
    const ext = url.split('.').pop().toLowerCase();
    const mimetype = {
        css: 'text/css',
        gif: 'image/gif',
        htm: 'text/html',
        html: 'text/html',
        ico: 'image/x-icon',
        jpeg: 'image/jpeg',
        jpg: 'image/jpeg',
        js: 'application/javascript',
        json: 'application/json',
        png: 'image/png',
        svg: 'image/svg+xml',
        txt: 'text/plain',
        xml: 'text/xml',
    }[ext];
    if (! mimetype) throw Error(`url '${url}' has unexpected extension '.${ext}'`);
    return mimetype;
}
