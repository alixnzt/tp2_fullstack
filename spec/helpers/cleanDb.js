const cleanDb = async (db) => {
    await db.Author.deleteMany({});
    await db.Post.deleteMany({});
}
module.exports = cleanDb
