import Layout from '../components/layout'
import withPage from '../providers/page'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {compose} from 'recompose'
import {withUser} from 'ooth-client-react'
import  Rating from 'react-rating';
import Img from 'react-image'
import ReactPlayer from 'react-player'
import { CSSGrid, measureItems, makeResponsive,layout } from 'react-stonecutter';
import Link from 'next/link'
const Grid = makeResponsive(measureItems(CSSGrid, { measureImages: true }), {
  maxWidth: 1920,
  minPadding: 100
});

export default withPage(() => (
    <Layout title="Movies" page="dashboard">
        <div className="container">
          <Movies/>
        </div>
    </Layout>
))

const MovieQuery = gql`
    query {
    movies {
        _id
        title
        imageLink
        avgRating
    }
    }
`
class Movie extends React.Component {
    render() {
        const {movie} = this.props

        return<div>
              <Link href={{ pathname: '/movie', query: { id: movie._id } }}>

                <img width={'300px'} src={movie.imageLink} />
              </Link>
            </div>

    }
  }
  /*  <CreateComment movieId={movie._id} onCreateComment={refetch}/>
    <CreateRating movieId={movie._id} onCreateRating={refetch}/>
    {movie.comments.map(comment => (
        <div key={comment._id}>
            <span>From: {comment.authorId}</span>
            <div>
                {comment.content}
            </div>
        </div>
    ))}
     */
class MoviesComponent extends React.Component {
    render() {
        const {data: {loading, movies, refetch}} = this.props
        if (loading) {
            return <p>Loading...</p>
        }
        return <div>


            <Grid


                  columnWidth={300}
                  gutterWidth={5}
                  gutterHeight={5}
                  duration={800}
                  easing="ease-out"
                  layout={layout.pinterest}

                  className="grid"
                  >
                {movies && movies.map(movie => (
                    <div key={movie._id}  className="grid-item">
                      <Movie movie={movie}/>
                    </div>
                ))}
          </Grid>
        </div>
    }
}
const Movies = graphql(MovieQuery)(MoviesComponent)

const CreateMovieQuery = gql`
    mutation($title: String!, $content: String!,$imageLink: String!,$releaseDay: String!,$trailerVideoLink:String!) {
    createMovie(title: $title, content: $content,imageLink:$imageLink,releaseDay:$releaseDay,trailerVideoLink:$trailerVideoLink) {
        _id
    }
    }
`
class CreateMovieComponent extends React.Component {
    render() {
        const {user, mutate, onCreateMovie} = this.props
        if (!user) {
            return <p><a href={`/login?next=/blog`}>log in to write a movie</a>.</p>
        }
        return <form onSubmit={e => {
            e.preventDefault()
            mutate({
                variables: {
                    title: this.title.value,
                    content: this.content.value,
                    imageLink: this.imageLink.value,
                    releaseDay: this.releaseDay.value,
                    trailerVideoLink: this.trailerVideoLink.value
                }
            }).then(({data}) => {
                if (onCreateMovie) {
                    onCreateMovie()
                }
            }).catch(e => {
                console.error(e)
            })
        }}>
            <h2>Write movie</h2>
            <div className="form-grouip">
                <label htmlFor="title">Title</label>
                <input
                    className="form-control"
                    ref={ref => {
                        this.title = ref
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                    className="form-control"
                    ref={ref => {
                        this.content = ref
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">image Link</label>
                <textarea
                    className="form-control"
                    ref={ref => {
                        this.imageLink = ref
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Release Day</label>
                <textarea
                    className="form-control"
                    ref={ref => {
                        this.releaseDay = ref
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Trailer Video Link</label>
                <textarea
                    className="form-control"
                    ref={ref => {
                        this.trailerVideoLink = ref
                    }}
                />
            </div>


            <button>Create</button>
        </form>
    }
}
const CreateMovie = compose(
    withUser,
    graphql(CreateMovieQuery)
)(CreateMovieComponent)



const CreateCommentQuery = gql`
    mutation($movieId: ID!, $content: String!) {
    createComment(movieId: $movieId, content: $content) {
        _id
    }
    }
`
const CreateRatingQuery = gql`
    mutation($movieId: ID!, $content: String!) {
    createRating(movieId: $movieId, rate: $content) {
        _id
    }
    }
`
class CreateCommentComponent extends React.Component {
    render() {
        const {user, mutate, onCreateComment, movieId} = this.props
        if (!user) {
            return <p><a href={`/login?next=/blog`}>log in to comment</a>.</p>
        }
        return <form onSubmit={e => {
            e.preventDefault()
            mutate({
                variables: {
                    movieId,
                    content: this.content.value
                }
            }).then(({data}) => {
                if (onCreateComment) {
                    onCreateComment()
                }
            }).catch(e => {
                console.error(e)
            })
        }}>
            <div className="form-group">
                <textarea
                    className="form-control"
                    ref={ref => {
                        this.content = ref
                    }}
                />
            </div>
            <button>Comment</button>
        </form>
    }
}
class CreateRatingComponent extends React.Component {
    render() {
        const {user, mutate, onCreateRatingComponent, movieId} = this.props
        if (!user) {
            return <p><a href={`/login?next=/blog`}>log in to comment</a>.</p>
        }
        return <form onSubmit={e => {
            e.preventDefault()
            mutate({
                variables: {
                    movieId,
                    content: this.content.value
                }
            }).then(({data}) => {
                if (onCreateRatingComponent) {
                    onCreateRatingComponent()
                }
            }).catch(e => {
                console.error(e)
            })
        }}>
            <div className="form-group">
                <textarea
                    className="form-control"
                    ref={ref => {
                        this.content = ref
                    }}
                />
            </div>
            <button>Rating</button>
        </form>
    }
}
const CreateComment = compose(
    withUser,
    graphql(CreateCommentQuery)
)(CreateCommentComponent)

const CreateRating = compose(
    withUser,
    graphql(CreateRatingQuery)
)(CreateRatingComponent)
