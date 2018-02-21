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
import Router from 'next/router'

export default withPage(({url: {query: {id}}}) => {

  return(

    <Layout title="Movies" page="dashboard">
        <div className="container">
            {id}
          <CreateMovie onCreateMovie={ ()=>    Router.push(`/`)}/>
        </div>
    </Layout>
)})



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
            return <p><a href={`/login?next=/`}>log in to add a movie</a>.</p>
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
            <h2>Add movie</h2>
            <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                    className="form-control"
                    ref={ref => {
                        this.title = ref
                    }}
                />
            </div>
            <div className="form-group">
                <label htmlFor="content">Description</label>
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
