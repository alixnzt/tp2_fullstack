const factoryGirl = require('factory-girl')
const adapter = new factoryGirl.MongooseAdapter()
factory = factoryGirl.factory
factory.setAdapter(adapter)

const Post = require('../../models/mongoModels/post')

factory.define('post', Post, {
    title: factory.sequence((n) => `title${n}`),
    content: factory.sequence((n) => `content${n}`),
})
