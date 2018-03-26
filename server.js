const express = require('express')
const app = express()
const { MongoClient } = require('mongodb')
const ImageSearch = require('./image-search')



MongoClient.connect(process.env.MONGODB_URL).then(client => {
  
  app.get("/api/imagesearch/:terms", async (req, res) => {
    try {
      const terms = req.params.terms.split(' ')
      const json = await ImageSearch.search(req.query.offset, ...terms)
      const recentCollection = client.db("image-search").collection('recent')
      console.log(req.params.terms, req.params.terms.length)
      const result = await recentCollection.insertOne({terms: req.params.terms, when: new Date() })

      res.json(json)
    } catch (e) {
      console.error(e)
      res.json({error: 'Something went wrong on the server side'})
    }
  })

  app.get("/api/latest/imagesearch", async (req, res) => {
    try {
      const recentCollection = client.db("image-search").collection('recent')
      const results = await recentCollection.find({}, {projection: {_id: 0}}).sort({when: -1}).toArray()
      res.json(results)
    } catch (e) {
      console.error(e)
      res.json({error: 'Something went wrong on the server side'})
    }
  })

  const listener = app.listen(process.env.PORT, () => {
    console.log(`Your app is listening on port ${listener.address().port}`)
  })
})



