const express = require('express')
const app = express()
app.set('json spaces',1)
app.get('/',(req,res) => res.sendStatus(403))
const fetch = require('node-fetch')
const {NsfwSpy} = require('@nsfwspy/node'),
sharp = require('sharp'),
nsfwSpy = new NsfwSpy(`file://${process.cwd()}/model/model.json`);
app.get('/detect',async (req, res) => {
    if (!req.query.image || !req.query.key) {
        res.send({error:"No image query"})
    } else {
        if(req.query.key != "DuckDevisbest9447") return res.send({error:"no"});
        try {
            await nsfwSpy.load();
            fetch(req.query.image)
            .then(res => {
                if(!res.headers.get('content-type').startsWith("image/")) return res.send({error:"image?"})
                return res.buffer()
            })
            .then(data => {
                return sharp(data).toFormat('png').toBuffer();
            })
            .then(async data => {
                const result = await nsfwSpy.classifyImageFromByteArray(Uint8Array.from(data));
                res.send(result)
            })
            .catch(err => {console.log(err)
            res.send({error:"Something broke.",precautions:"Do not provide any base64 image data or a '.webp' image url."})})
        } catch(err) {
            console.log(err)
            res.send({error:"Something broke.",precautions:"Do not provide any base64 image data or a '.webp' image url."})
        }
    }
})
app.listen(process.env.PORT)
