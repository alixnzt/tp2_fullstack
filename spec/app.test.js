const request = require('supertest')
const app = require('../app')
const db = {
    Author: require('../models/mongoModels/author'),
    Post: require('../models/mongoModels/post')
}

const cleanDb = require('./helpers/cleanDb')
require('./factories/author').factory
const factory = require('factory-girl').factory
require('./factories/post').factory

beforeAll(async () => {
    // await cleanDb(db)
});

afterAll(async () => {
    // await cleanDb(db)
    // await db.close()
});

describe('GET /', () => {
    let response;

    beforeEach(async () => {
        // await cleanDb(db)
        response = await request(app).get('/');
    })

    test('It should respond with a 200 status code', async () => {
        expect(response.statusCode).toBe(200);
    });
});

describe('POST /author', () => {

    let response;
    let data = {};

    beforeAll(async () => {
        data.firstName = 'John'
        data.lastName = 'Wick'
        response = await request(app).post('/author').send(data);
    })

    test('It should respond with a 200 status code', async () => {
        expect(response.statusCode).toBe(200);
    });

    test('It should return a json with the new author', async () => {
        expect(response.body.firstName).toBe(data.firstName);
        expect(response.body.lastName).toBe(data.lastName);
    });

    test('It should create and retrieve a post for the selected author', async () => {
        const author = await db.Author.findOne({ _id: response.body._id })
        expect(author._id.toString()).toBe(response.body._id)
        expect(author.firstName).toBe(data.firstName)
        expect(author.lastName).toBe(data.lastName)
    });

});



describe('GET /authors', () => {

    let response;
    let data = {};

    // beforeAll(async () => await cleanDb(db))

    describe('when there is no author in database', () => {
        beforeAll(async () => {
            response = await request(app).get('/authors').set('Accept', 'application/json');
        })

        test('It should not retrieve any authors in db', async () => {
            const authors = await db.Author.find()
            expect(authors.length).toBe(0);
        });

        test('It should respond with a 200 status code', async () => {
            expect(response.statusCode).toBe(200);
        });

        test('It should return a json with a void array', async () => {
            expect(response.body).toStrictEqual([]);
        });
    })

    describe('when there is one or more authors in database', () => {
        beforeAll(async () => {
            authors = await factory.createMany('author', 5)
            response = await request(app).get('/authors').set('Accept', 'application/json')
        })

        test('It should not retrieve any author in db', async () => {
            const authorsInDatabase = await db.Author.find()
            expect(authorsInDatabase.length).toBe(5)
        });
        test('It should respond with a 200 status code', async () => {
            expect(response.statusCode).toBe(200)
        });
        test('It should return a json with a void array', async () => {
            expect(response.body.length).toBe(5)
            for (i = 0; i < 5; i++) {
                const expectedBody = {
                    _id: authors[i]._id.toString(),
                    firstName: authors[i].firstName,
                    lastName: authors[i].lastName,
                }
                //Workaround to make id to string
                const tempBody = response.body.map(x => {
                    return {
                        ...x,
                        _id: x._id.toString()
                    }
                })
                expect(tempBody).toContainEqual(expectedBody)
            }
        });
    })

});

describe('POST /post', () => {

    let response
    let data = {}
    let post
    let author

    // beforeAll(async () => await cleanDb(db))

    describe('The author has one or multiple posts', () => {
        beforeAll(async () => {
            author = await factory.create('author')
            post = await factory.build('post')
            // author.posts = [post]
            data.title = post.title
            data.content = post.content
            data.author = author
            // console.log(data)
            response = await request(app).post('/post').send(data).set('Accept', 'application/json')
        })
        test('It should respond with a 200 status code', async () => {
            expect(response.statusCode).toBe(200);
        });
        test('It should create and retrieve a post for the selected author', async () => {
            const postsInDatabase = await db.Post.find()
            expect(postsInDatabase.length).toBe(1)
            expect(postsInDatabase[0].title).toBe(post.title)
            expect(postsInDatabase[0].content).toBe(post.content)
        });

        test('It should return a json with the author\'s posts', async () => {
            expect(response.body.title).toBe(data.title);
            expect(response.body.content).toBe(data.content);
        });

        test('The post should belong to the selected authors\' posts', async () => {
            // const posts = await author.getPosts()
            const posts = await db.Post.find({ author: author._id })
            console.log(posts)
            expect(posts.length).toBe(1)
            expect(posts[0].title).toBe(post.title)
            expect(posts[0].content).toBe(post.content)
        })

    })
});

describe('GET /posts', () => {
    let response
    let data = {}
    let post
    let author

    beforeAll(async () => {
        await cleanDb(db)
        author = await factory.create('author')
        post = await factory.createMany('post', 2, {author})

        response = await request(app).get('/posts').set('Accept', 'application/json');
    })

    test('The post should retrieve posts with authors\' posts', async () => {
        var result = { data: []}
        
        for (var i = 0;i<post.length;i++){
        
            if (post[i].author != null && post[i].author != undefined) {
               let maPost = [...post][i]
               maPost.author = [...post][i].author._id
                result.data.push({
                    post: maPost, 
                    relationship: {
                        _id: post[i].author._id,
                        firstName: post[i].author.firstName,
                        lastName: post[i].author.lastName
                }})
            } else {
                result.data.push({
                    post: maPost,
                    relationship: ""
                })
            }
        }
        expect(response.body).toEqual(result)
})
})

