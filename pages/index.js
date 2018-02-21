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
import SearchInput, {createFilter} from 'react-search-input'
import {Flex, Box} from 'grid-styled'
import Ratings from 'react-ratings-declarative';
const Grid = makeResponsive(measureItems(CSSGrid, { measureImages: true }), {
  maxWidth: 1920,
  minPadding: 100
});

export default withPage(({url: {query: {refetch}}}) => (
    <Layout title="Movies" page="dashboard">

        <div className="">
          <Movies refetch={refetch}/>
          <style jsx global>{`
            .grid{
          list-style: none;
    padding: 0;
    margin: 0 auto;
  }
  `}</style>
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
        releaseDay

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
class MoviesComponent extends React.Component {
  constructor (props) {
   super(props)
   this.state = {
     searchTerm: '',
     rating:0
   }
   this.searchUpdated = this.searchUpdated.bind(this)
   this.ratingUpdated = this.ratingUpdated.bind(this)
 }
  searchUpdated (term) {
 this.setState({searchTerm: term})
}
ratingUpdated (rate) {
this.setState({rating: rate})
}
    render() {
        const {data: {loading, movies, refetch}} = this.props
        if(movies){
        var KEYS_TO_FILTERS = ['title','releaseDay']
        var filteredMovies = movies.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS))
         filteredMovies = filteredMovies.filter( (a)=>(a.avgRating | 0) >= (this.state.rating==1?0:this.state.rating) )
        }
        if (loading) {
            return <p>Loading...</p>
        }
        return <div>
        <Flex flexWrap='wrap' alignItems='center' style={{
            color: "rgba(255, 255, 255, 0.9)",
            backgroundColor: "#383838",
            paddingLeft: "10px",
            paddingRight: "2%",
            marginBottom: "20px",
            borderBottom: "3px solid",
            minHeight:"70px"
          }}>

          <Box>
          <SearchInput type="search" className="search-input" onChange={this.searchUpdated} />
          </Box>
          <Box p={2} flex='none' style={{paddingTop:'20px'}} >
                      </Box>
          <Box ml={"auto"} >
        <CreateRating  onCreateRatingComponent={this.ratingUpdated} />

          </Box>
        </Flex>



            <Grid


                  columnWidth={300}
                  gutterWidth={5}
                  gutterHeight={5}
                  duration={800}
                  easing="ease-out"
                  layout={layout.pinterest}

                  className="grid"
                  >
                {filteredMovies && filteredMovies.map(movie => (
                    <div key={movie._id}  className="grid-item">
                      <Movie movie={movie}/>
                    </div>
                ))}
          </Grid>
        </div>
    }
}
const Movies = graphql(MovieQuery)(MoviesComponent)

const CreateRatingQuery = gql`
    mutation($movieId: ID!, $content: String!) {
    createRating(movieId: $movieId, rate: $content) {
        _id
    }
    }
`

class CreateRatingComponent extends React.Component {
  state = {
      rating: 0
  };
  rate = (newRating) => {
      console.log("WTF")
        this.setState({
          rating: newRating
          });
          this.onCreateRatingComponent(newRating)
  }
    render() {
      const {user, mutate, onCreateRatingComponent, movieId} = this.props
      this.onCreateRatingComponent=onCreateRatingComponent
      return <div>
        <Ratings rating={this.state.rating}   widgetSpacings="5px" widgetRatedColors={"rgb(242,218,92)"} widgetDimensions="20px" changeRating={this.rate}>
          <Ratings.Widget/>
          <Ratings.Widget/>
          <Ratings.Widget/>
          <Ratings.Widget/>
        </Ratings>
      </div>

    }
}

const CreateRating = compose(
    withUser,
    graphql(CreateRatingQuery)
)(CreateRatingComponent)
