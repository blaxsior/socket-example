// import * as esbuild from 'esbuild';

// await esbuild.build({
//     entryPoints:['src/index.ts'],
//     platform: 'node',
//     bundle: true,
//     minify: true,
//     // outdir: 'dist'
//     outfile: 'dist/main.js',
//     packages: 'external', // dynamic path 지원 안되서 path 기능 사용하려면...
//     format:"esm"
// });

// // "build": "esbuild src/index.ts --bundle --minify --platform=node --package=external format=esm --outfile=dist/main.js",

import * as esbuild from 'esbuild';

await esbuild.build({
    entryPoints:['pub-develop/js/main.ts'],
    platform:'browser',
    bundle: true,
    minify: true,
    outfile: 'public/js/main.js',
    // format: ''
})