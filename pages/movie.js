import Layout from '../components/layout'
import withPage from '../providers/page'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {compose} from 'recompose'
import {withUser} from 'ooth-client-react'
import  Rating from 'react-rating';
import Img from 'react-image'
import ReactPlayer from 'react-player'
import { CSSGrid, measureItems, makeResponsive } from 'react-stonecutter';

const Grid = makeResponsive(measureItems(CSSGrid), {
  maxWidth: 1920,
  minPadding: 100
});
let movieId=""
export default withPage(({url: {query: {id}}}) => {
  const MovieQuery = gql`
      query {
      movie(_id:"${id}") {
          _id
          authorId
          title
          content
          imageLink
          releaseDay
          trailerVideoLink
          avgRating
          comments {
          _id
          authorId
          content
          }
          ratings {
          _id
          authorId
          rate
          }
      }
      }
  `
  const Movies = graphql(MovieQuery)(MoviesComponent)
  return(
    <Layout title="Movies" page="dashboard">
        <div className="container">
          <Movies/>
        </div>
    </Layout>
)})



class Movie extends React.Component {
    render() {
        const {movie} = this.props
        return<div>
                <Img width={'150px'} src={[movie.imageLink,"https://images.template.net/wp-content/uploads/2017/02/17221912/Printable-Blank-Movie-Poster.jpg"]} />
            </div>

    }
  }


class MoviesComponent extends React.Component {
    render() {
        const {data: {loading, movie, refetch}} = this.props
        if (loading) {
            return <p>Loading...</p>
        }
        return <div>

            <h2>{movie.title}</h2>
           <div>  rating:{movie.avgRating | 0 }</div>
            <Img width={'400px'} src={[movie.imageLink,"https://images.template.net/wp-content/uploads/2017/02/17221912/Printable-Blank-Movie-Poster.jpg"]} />
            <CreateRating movieId={movie._id} onCreateComment={refetch}/>


        </div>
    }
}

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
            return <p><a href={`/login?next=/blog`}>login to add a movie</a>.</p>
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
            return <p><a href={`/login?next=/blog`}>log in to rate</a>.</p>
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
