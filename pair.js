const PastebinAPI = require('pastebin-js');
const pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require('pino');
const {
    default: Toxic_Tech,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require('@whiskeysockets/baileys');

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;
    console.log('Received number:', num); // Debug log

    async function Toxic_MD_PAIR_CODE() {
        console.log('Creating auth state in ./temp/' + id); // Debug log
        const { state, saveCreds } = await useMultiFileAuthState('./temp/' + id);
        console.log('Auth state directory exists:', fs.existsSync('./temp/' + id)); // Debug log

        try {
            console.log('Initializing Toxic_Tech with browser:', Browsers.macOS('Chrome')); // Debug log
            let Pair_Code_By_Toxic_Tech = Toxic_Tech({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' }).child({ level: 'fatal' })),
                },
                printQRInTerminal: false,
                logger: pino({ level: 'fatal' }).child({ level: 'fatal' }),
                browser: Browsers.macOS('Chrome')
            });

            if (!Pair_Code_By_Toxic_Tech.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                console.log('Requesting pairing code for number:', num); // Debug log
                const code = await Pair_Code_By_Toxic_Tech.requestPairingCode(num);
                console.log('Pairing code generated:', code); // Debug log
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_Toxic_Tech.ev.on('creds.update', saveCreds);
            Pair_Code_By_Toxic_Tech.ev.on('connection.update', async (s) => {
                console.log('Connection update:', s); // Debug log
                const { connection, lastDisconnect } = s;
                if (connection === 'open') {
                    await delay(5000);
                    console.log('Reading creds.json from ./temp/' + id); // Debug log
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    console.log('Sending base64 session data'); // Debug log
                    let session = await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: '' + b64data });

                    let Toxic_MD_TEXT = `
        𝙎𝙀𝙎𝙎𝙄𝙊𝙉 𝘾𝙊𝙉𝙉𝙀𝘾𝙏𝙀𝘿
        
         𝙏𝙤𝙭𝙞𝙘-𝙈𝘿 𝙇𝙤𝙜𝙜𝙚𝙙  

『••• 𝗩𝗶𝘀�_i𝘁 𝗙𝗼𝗿 𝗛𝗲𝗹𝗽 •••』
> 𝐎𝐰𝐧𝐞𝐫: 
_https://wa.me/254735342808_

> 𝐑𝐞𝐩𝐨: 
_https://github.com/xhclintohn/Toxic-v2_

> 𝐖𝐚𝐆𝐫𝐨𝐮𝐩: 
_https://chat.whatsapp.com/GoXKLVJgTAAC3556FXkfFI_

> 𝐖𝐚𝐂𝐡𝐚𝐧𝐧𝐞𝐥:
 _https://whatsapp.com/channel/0029VagJlnG6xCSU2tS1Vz19_
 
> 𝐈𝐧𝐬𝐭𝐚𝐠𝐫𝐚𝐦:
 _https://www.instagram.com/xh_clinton_

Don't Forget To Give Star and fork My Repo :)`;

                    console.log('Sending success message'); // Debug log
                    await Pair_Code_By_Toxic_Tech.sendMessage(Pair_Code_By_Toxic_Tech.user.id, { text: Toxic_MD_TEXT }, { quoted: session });

                    await delay(100);
                    console.log('Closing WebSocket connection'); // Debug log
                    await Pair_Code_By_Toxic_Tech.ws.close();
                    console.log('Removing temp directory ./temp/' + id); // Debug log
                    return await removeFile('./temp/' + id);
                } else if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
                    console.log('Connection closed, retrying in 10 seconds'); // Debug log
                    await delay(10000);
                    Toxic_MD_PAIR_CODE();
                }
            });
        } catch (err) {
            console.error('Service error:', err); // Improved error logging
            await removeFile('./temp/' + id);
            if (!res.headersSent) {
                await res.send({ code: 'Service Currently Unavailable' });
            }
        }
    }

    return await Toxic_MD_PAIR_CODE();
});

module.exports = router;
