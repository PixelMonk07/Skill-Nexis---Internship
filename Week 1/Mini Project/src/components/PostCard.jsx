function PostCard({post}) {
    return (
        <article className="post-card">
            <img src={post.image} alt={post.title} className="post-image" />

            <div className="psot-content">
                <span className="post-category">
                    {post.category}
                </span>

                <h2>{post.title}</h2>

                <p className="post-excerpt">
                    {post.excerpt}
                </p>

                <div className="post-meta">
                    <span>{post.author}</span>
                    <span>{post.readTime}</span>
                </div>
            </div>
        </article>
    );
}

export default PostCard;