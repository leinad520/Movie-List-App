import React, {Component} from 'react';
import './Home.css';
import {API_KEY, API_URL, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE, } from '../../config';
import HeroImage from '../elements/HeroImage/HeroImage.js'
import SearchBar from '../elements/SearchBar/SearchBar.js';
import FourColGrid from '../elements/FourColGrid/FourColGrid.js';
import MovieThumb from '../elements/MovieThumb/MovieThumb.js';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn.js';
import Spinner from '../elements/Spinner/Spinner.js';

class Home extends Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    }

    componentDidMount() {
        this.setState({loading: true});
        const endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        this.fetchItems(endpoint);
    }

    searchItems = (searchTerm) => {
        let endpoint = '';
        this.setState({
            movies: [],
            loading: true,
            searchTerm: searchTerm
        })

        if (searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=1`;
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query=${searchTerm}`;
        }
        this.fetchItems(endpoint)
    }

    loadMoreItems = () => {
        let endpoint = '';
        this.setState({loading: true});

        if (this.state.searchTerm === '') {
            endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&language=en-US&page=${this.state.currentPage}`
        } else {
            endpoint = `${API_URL}search/movie?api_key=${API_KEY}&language=en-US&query${this.state.searchTerm}&page=${this.state.currentPage + 1}`
        }
    }

    fetchItems(endpoint) {
        fetch(endpoint)
        .then(result => result.json())
        .then(result => {
            this.setState({
                movies: [...this.state.movies, ...result.results],
                heroImage: this.state.heroImage || result.results[0],
                loading: false,
                currentPage: result.page,
                totalPages: result.total_pages
            })
        })
    }

    render() {
        return (
            <div className='rmdb-home'>
                {this.state.heroImage ?
                <div>
                    <HeroImage 
                    image={IMAGE_BASE_URL+BACKDROP_SIZE+this.state.heroImage.backdrop_path}
                    title={this.state.heroImage.original_title}
                    text={this.state.heroImage.overview}
                    />
                    <SearchBar callback={this.searchItems}/>
                </div> : null}
                <div className='rmdb-home-grid'>
                    <FourColGrid 
                        header={this.state.searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading={this.state.loading}
                        >
                        {this.state.movies.map( (el, i) => {
                            return <MovieThumb 
                                        key={i} 
                                        clickable={true} 
                                        image={el.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${el.poster_path}` : './images/no_image.jpg'}
                                        movieId={el.id}
                                        movieName={el.original_title}
                                    />
                        })}
                    </FourColGrid>
                </div>
                <Spinner />
                <LoadMoreBtn />
            </div>
        )
    }
}

export default Home;