module.exports = (app, db) => {
    app.post('/post', async (req, res) => {
        let post = new db.Post({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
        })
        await post.save()
            .then(data => res.status(200).json(data))
            .catch(err => res.status(400).json(err))
    })

    app.get('/posts', async (req, res) => {
        // await db.Post.find()
        //     .select('_id ).exec()
        //     .then(data => res.status(200).json(formatJson(data)))
        //     .catch(err => res.status(400).json(err))
        await db.Post.find({})
            .exec()
            .then(async data => {
                let temp = await formatJson(data)
                res.status(200).json(temp)
            })
            .catch(err => console.error(err))
    })

    async function formatJson(json) {

         return await new Promise(async(resolve, reject) => {
            let newJson = {
                data: []
            }
            for (const post of json) {
                if (post.author != null && post.author != undefined) {
                    let author = await db.Author.findOne({ _id: post.author })
                    newJson.data.push(
                        {
                            post: post,
                            relationship: {
                                _id: author._id,
                                firstName: author.firstName,
                                lastName: author.lastName
                            }

                        }
                    )
                } else {
                    newJson.data.push(
                        {
                            post: post,
                            relationship: ""
                        }
                    )
                }
                console.log(newJson)
            }
            console.log("END")            
            console.log(newJson)
            resolve(newJson)
        })
        .then(x => {return x})
    }
}
