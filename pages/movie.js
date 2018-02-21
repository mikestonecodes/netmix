import Layout from '../components/layout'
import withPage from '../providers/page'
import gql from 'graphql-tag'
import {graphql} from 'react-apollo'
import {compose} from 'recompose'
import {withUser} from 'ooth-client-react'
import Rating from 'react-rating';
import Img from 'react-image'
import ReactPlayer from 'react-player'
import {CSSGrid, measureItems, makeResponsive} from 'react-stonecutter';
import Ratings from 'react-ratings-declarative';
import {Flex, Box} from 'grid-styled'
const Grid = makeResponsive(measureItems(CSSGrid), {
  maxWidth: 1920,
  minPadding: 100
});
let movieId = ""
export default withPage(({
  url: {
    query: {
      id
    }
  }
}) => {
  const MovieQuery = gql `
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
  return (<Layout title="Movies" page="dashboard">

    <Movies/>

  </Layout>)
})

class Movie extends React.Component {
  render() {
    const {movie} = this.props
    return <div>
      <Img width={'150px'} src={[movie.imageLink, "https://images.template.net/wp-content/uploads/2017/02/17221912/Printable-Blank-Movie-Poster.jpg"]}/>
    </div>

  }
}

class MoviesComponent extends React.Component {
  render() {
    const {
      data: {
        loading,
        movie,
        refetch
      }
    } = this.props
    if (loading) {
      return <p>Loading...</p>
    }
    return <div>

      <Flex flexWrap='wrap' alignItems='center' style={{
          color: "rgba(255, 255, 255, 0.9)",
          backgroundColor: "#383838",
          paddingLeft: "5%",
          paddingRight: "5%",
          marginBottom: "20px",
          borderBottom: "3px solid",
          minHeight:"150px"
        }}>

        <Box >
          <h2

            style={{
              fontSize: "3em",
              marginTop: '10px',
              paddingTop:'0px'
            }}>{movie.title}</h2>
        </Box>
        <Box p={2} flex='none' style={{paddingTop:'20px'}} >
          <CreateRating movieId={movie._id} rating={movie.avgRating | 0} onCreateRatingComponent={refetch}/>
        </Box>
        <Box ml={"auto"} >
      <img height={'120px'} src={movie.imageLink} />
        </Box>
      </Flex>

      <ReactPlayer width={"90%"} style={{
          margin: "0 auto"
        }} url={movie.trailerVideoLink}/>

    </div>

  }
}

const CreateCommentQuery = gql `
    mutation($movieId: ID!, $content: String!) {
    createComment(movieId: $movieId, content: $content) {
        _id
    }
    }
`
const CreateRatingQuery = gql `
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
      return <p>
        <a href={`/login?next=/blog`}>log in to comment</a>.</p>
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
        <textarea className="form-control" ref={ref => {
            this.content = ref
          }}/>
      </div>
      <button>Comment</button>
    </form>
  }
}
class CreateRatingComponent extends React.Component {
  render() {
    const {user, mutate, onCreateRatingComponent, movieId, rating} = this.props

    let ratingFunction = (rating) => {

      mutate({
        variables: {
          movieId,
          content: rating
        }
      }).then(({data}) => {

        if (onCreateRatingComponent) {
          onCreateRatingComponent()
          ratingFunction = null
        }
      }).catch(e => {
        console.error(e)
      })

    }
    if (!user) {
      ratingFunction = null
    }
    return <div>
      <Ratings rating={rating}   widgetSpacings="5px" widgetRatedColors={"rgb(242,218,92)"} widgetDimensions="20px" changeRating={ratingFunction}>
        <Ratings.Widget/>
        <Ratings.Widget/>
        <Ratings.Widget/>
        <Ratings.Widget/>
      </Ratings>
    </div>

  }
}
const CreateComment = compose(withUser, graphql(CreateCommentQuery))(CreateCommentComponent)

const CreateRating = compose(withUser, graphql(CreateRatingQuery))(CreateRatingComponent)
