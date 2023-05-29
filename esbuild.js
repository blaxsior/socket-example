import { readdir, stat } from 'fs/promises';
import * as esbuild from 'esbuild';
import { join } from 'path';
import { argv } from 'process';

const source = 'pub-develop/js';
const outdir = 'public/js';
// const fileNames = [];

async function getFiles(path, deep = true) {
    let fileNames = [];
    const targets = (await readdir(path)).filter(it => it.match(/^(?!.*\.d\.ts$)(.+\.ts|[^.]+)$/));
    // console.log(targets);
    // thanks for chatgpt! -> exclude .*.d.ts and include .*.d.ts
    // ^: Matches the start of the string.
    // (?!.*\.d\.ts$): Negative lookahead assertion. It ensures that the string does not end with .d.ts.
    // [^.]+\.ts: Matches one or more characters that are not a dot, followed by .ts (for files).
    // |: Alternation operator.
    // [^.]+: Matches one or more characters that are not a dot
    // $: Matches the end of the string.
    for (const target of targets) {
        const targetName = join(path, target);
        // console.log(targetName);
        const info = await stat(targetName);
        if (info.isDirectory() && deep) // 폴더 + 깊게 볼거면
        {
            fileNames = fileNames.concat(await getFiles(targetName)); // 깊게 한번 더 보자.
        }
        else
            fileNames.push(targetName); // 아님 조건 맞는 파일만 추가.
    }
    return fileNames;
}


async function bundleFiles() {
    let watch = false;
    if (argv.length > 2 && argv[2] === '--watch') {
        watch = true;
    }
    try {
        const fileNames = await getFiles(source);
       
        const config = {
            entryPoints: fileNames,
            platform: 'browser',
            bundle: true,
            minify: true,
            outdir: outdir,
            format: 'esm'
        }; // esbuild config
       
        if (watch) {
            const ctx = await esbuild.context(config);
            await ctx.watch();
        }
        else {
            await esbuild.build(config);
        }
    } catch (err) {
        console.log("error occured");
        console.error(err);
    }
}
// "esbuild pub-develop/js/main.ts --bundle --minify --platform=browser --format=esm --outdir=public/js --watch"

await bundleFiles();