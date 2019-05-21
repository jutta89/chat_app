import React, { Component } from 'react';
import Post from './Post';

class PostsList extends Component {
    state = {
        posts: null
    }

    onClick = () => {
        fetch('https://jsonplaceholder.typicode.com/posts') 
            .then(response => response.json()) 
            .then(resp_json => this.setState({
                posts: resp_json 
            }))
    }
    mapPosts = (posts) => {
        return posts.map(post=>(          
            <Post body={post.body} title={post.title}/> // return
        ))
    }
    render () {
        const Posts = this.state.posts ? this.mapPosts(this.state.posts) : null ; 
        return (
            <div className="testowy__2">
                <button onClick={this.onClick}></button> 
                { Posts }
            </div>
        );
    }
}

export default PostsList;