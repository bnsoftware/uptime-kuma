console.log("Downloading dist");
const https = require("https");
const tar = require("tar");

const packageJSON = require("../package.json");
const fs = require("fs");
const rmSync = require("./fs-rmSync.js");
const version = packageJSON.version;

const filename = "dist.tar.gz";

const url = `https://github.com/bnsoftware/uptime-kuma/releases/download/${version}/${filename}`;
download(url);

/**
 * Downloads the latest version of the dist from a GitHub release.
 * @param {string} url The URL to download from.
 *
 * Generated by Trelent
 */
function download(url) {
    console.log(url);

    https.get(url, (response) => {
        if (response.statusCode === 200) {
            console.log("Extracting dist...");

            if (fs.existsSync("./dist")) {

                if (fs.existsSync("./dist-backup")) {
                    rmSync("./dist-backup", {
                        recursive: true
                    });
                }

                fs.renameSync("./dist", "./dist-backup");
            }

            const tarStream = tar.x({
                cwd: "./",
            });

            tarStream.on("close", () => {
                if (fs.existsSync("./dist-backup")) {
                    rmSync("./dist-backup", {
                        recursive: true
                    });
                }
                console.log("Done");
            });

            tarStream.on("error", () => {
                if (fs.existsSync("./dist-backup")) {
                    fs.renameSync("./dist-backup", "./dist");
                }
                console.error("Error from tarStream");
            });

            response.pipe(tarStream);
        } else if (response.statusCode === 302) {
            download(response.headers.location);
        } else {
            console.log("dist not found");
        }
    });
}
