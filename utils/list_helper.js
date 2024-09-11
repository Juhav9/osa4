var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}
const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.length === 0 ? 0 : blogs.reduce(reducer,0)
}

const mostLikedBlog = (blogs) => {
    const reducer = (mostLiked, item) => {
        if(item.likes>mostLiked.likes){
            return item
        }
        else{
            return mostLiked
        }
    }
    
    return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
    const authorAndLikes = [] 
    const authors = _.groupBy(blogs, 'author')
    _.forEach(authors, (k,v)=>{
        authorAndLikes .push( {
            author: v,
            blogs: k.length
        })
    })
    return _.orderBy(authorAndLikes, ['blogs'],['desc'])[0]
}

const mostLikes = (blogs) => {  
    const authorAndLikes = [] 
    const authors = _.groupBy(blogs, 'author')
    _.forEach(authors, (k,v)=>{
        const likes = _.sumBy(k, 'likes')
        authorAndLikes.push( {
            author: v,
            likes: likes
        })
    })  
    return _.orderBy(authorAndLikes, ['likes'],['desc'])[0]
}


module.exports = {
    dummy,
    totalLikes,
    mostLikedBlog,
    mostLikes,
    mostBlogs
}