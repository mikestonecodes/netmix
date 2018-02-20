const {MongoClient, ObjectId} = require('mongodb')
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const {graphqlExpress, graphiqlExpress} = require('graphql-server-express')
const {makeExecutableSchema} = require('graphql-tools')
const morgan = require('morgan')
const cors = require('cors')
const nodeify = require('nodeify')
const ooth = require('./ooth')

const prepare = (o) => {
    if (o && o._id) {
        o._id = o._id.toString()
    }
    return o
}

function nodeifyAsync(asyncFunction) {
    return function(...args) {
        return nodeify(asyncFunction(...args.slice(0, -1)), args[args.length-1])
    }
}

const start = async (app, settings) => {
    let db;
    try {
        db = await MongoClient.connect(settings.mongoUrl)

        const Movies = db.collection('movies')
        const Comments = db.collection('comments')
        const Ratings = db.collection('ratings')

        const typeDefs = [`
            type Query {
                me: User
                movie(_id: ID!): Movie
                movies: [Movie]
                comment(_id: ID!): Comment
                rating(_id: ID!): Rating
            }
            type User {
                _id: ID!
            }
            type Movie {
                _id: ID!
                authorId: ID!
                title: String
                content: String
                imageLink: String
                releaseDay: String
                trailerVideoLink: String
                author: User
                comments: [Comment]!
                ratings: [Rating]!
                avgRating: Float
            }
            type Comment {
                _id: ID!
                movieId: ID!
                authorId: ID
                content: String

                author: User
                movie: Movie
            }
            type Rating {
                _id: ID!
                movieId: ID!
                authorId: ID
                rate: Int

                author: User
                movie: Movie
            }
            type Mutation {
                createMovie(title: String, content: String,imageLink: String,releaseDay: String,trailerVideoLink: String): Movie
                createComment(movieId: ID!, content: String): Comment
                createRating(movieId: ID!, rate: String): Rating
            }
            schema {
                query: Query
                mutation: Mutation
            }
        `];

        const resolvers = {
            Query: {
                me: async (root, args, {userId}) => {
                    if (!userId) {
                        return null
                    }
                    return {
                        _id: userId
                    }
                },
                movie: async (root, {_id}) => {

                    return prepare(await Movies.findOne(ObjectId(_id)))
                },
                movies: async (root, args, context) => {
                    return (await Movies.find({}, {sort: { createdAt: -1}}).toArray()).map(prepare)
                },
                comment: async (root, {_id}) => {
                    return prepare(await Comments.findOne(ObjectId(_id)))
                },
                rating: async (root, {_id}) => {
                    return prepare(await Ratings.findOne(ObjectId(_id)))
                },
            },
            Movie: {
                comments: async ({_id}) => {
                    return (await Comments.find({movieId: _id}, {sort: {createdAt: 1}}).toArray()).map(prepare)
                },
                ratings: async ({_id}) => {
                    return (await Ratings.find({movieId: _id}, {sort: {createdAt: 1}}).toArray()).map(prepare)
                },
                avgRating: async ({_id}) => {
                    let allratings=await Ratings.find({movieId: _id}).toArray()
                    return allratings.reduce( (a, b)=>a+parseInt(b.rate),0) / allratings.length
                }
            },
            Comment: {
                movie: async ({movieId}) => {
                    return prepare(await Movies.findOne(ObjectId(movieId)))
                }
            },
            Rating: {
                movie: async ({movieId}) => {
                    return prepare(await Movies.findOne(ObjectId(movieId)))
                }
            },
            Mutation: {
                createMovie: async (root, args, {userId}, info) => {
                    if (!userId) {
                        throw new Error('User not logged in.')
                    }
                    args.authorId = userId
                    args.createdAt = new Date()
                    const _id = (await Movies.insertOne(args)).insertedId
                    return prepare(await Movies.findOne(ObjectId(_id)))
                },
                createComment: async (root, args, {userId}) => {
                    if (!userId) {
                        throw new Error('User not logged in.')
                    }
                    args.authorId = userId
                    args.createdAt = new Date()
                    const _id = (await Comments.insertOne(args)).insertedId
                    return prepare(await Comments.findOne(ObjectId(_id)))
                },
                createRating: async (root, args, {userId}) => {
                    if (!userId) {
                        throw new Error('User not logged in.')
                    }
                    if (!Number.isInteger(parseInt(args.rate)) ){
                            throw new Error('Not an Int')
                    }
                    if(args.rate<1 || args.rate >4){
                        throw new Error('Rate range invalid')
                    }
                    args.authorId = userId
                    args.createdAt = new Date()
                    const _id = (await Ratings.insertOne(args)).insertedId
                    return prepare(await Ratings.findOne(ObjectId(_id)))
                },
            },
        }

        const schema = makeExecutableSchema({
            typeDefs,
            resolvers
        })

        app.use(morgan('dev'))

        const corsMiddleware = cors({
            origin: settings.originUrl,
            credentials: true,
            preflightContinue: false
        })
        app.use(corsMiddleware)
        app.options(corsMiddleware)

        app.use(session({
            name: 'api-session-id',
            secret: settings.sessionSecret,
            resave: false,
            saveUninitialized: true,
        }))
        await ooth(app, settings)

        app.use('/graphql', bodyParser.json(), graphqlExpress((req, res) => {
            return {
                schema,
                context: { userId: req.user && req.user._id }
            }
        }))

        app.use('/graphiql', graphiqlExpress({
            endpointURL: '/graphql',
        }))
    } catch (e) {
        if (db) {
            db.close();
        }
        throw e;
    }
}

module.exports = {
    start
}
