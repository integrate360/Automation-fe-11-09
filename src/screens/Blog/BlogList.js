import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import SearchCard from "../../components/Blog/SearchCard";
import axios from "axios";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import BlogListCardList from "../../components/Blog/BlogListCardList";

const perPage = 16;
const maxPagesDisplayed = 10;

class BlogList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogListCardData: [],
      isLoading: true,
      filteredBlogs: [],
      currentPage: 1, // Current page
      totalPosts: 0, // Total number of posts
    };
  }

  filterBlogsByKeyword = (keyword) => {
    const filteredBlogs = this.state.blogListCardData.filter((blog) =>
      blog.keyword.includes(keyword)
    );
    this.setState({ filteredBlogs });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    // Load initial page (page 1)
    this.loadBlogPosts(1);
  }

  loadBlogPosts = (page) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/post/allposts?page=${page}`)
      .then((response) => {
        this.setState({
          blogListCardData: response.data.posts,
          isLoading: false,
          currentPage: page,
          totalPosts: response.data.totalPosts,
        });
        this.filterBlogsByKeywordFromURL();
      })
      .catch(() => {
        console.log("Error");
      });
  };

  filterBlogsByKeywordFromURL = () => {
    const params = new URLSearchParams(this.props.location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      const filteredBlogs = this.state.blogListCardData.filter((blog) =>
        blog.keyword.includes(keyword)
      );
      this.setState({ filteredBlogs });
    }
  };

  // Handle pagination button clicks
  handlePageClick = (page) => {
    this.loadBlogPosts(page);
  };

  calculatePaginationRange = () => {
    const { currentPage } = this.state;
    const totalPages = Math.ceil(this.state.totalPosts / perPage);

    let startPage = currentPage - Math.floor(maxPagesDisplayed / 2);
    let endPage = currentPage + Math.floor(maxPagesDisplayed / 2);

    if (startPage < 1) {
      startPage = 1;
      endPage = Math.min(maxPagesDisplayed, totalPages);
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, totalPages - maxPagesDisplayed + 1);
    }

    return { startPage, endPage };
  };

  render() {
    const { blogListCardData, filteredBlogs, currentPage } = this.state;
    const isLoading = this.state.isLoading;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    const { startPage, endPage } = this.calculatePaginationRange();
    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => this.handlePageClick(i)}
          className={i === currentPage ? "active" : ""}
        >
          {i}
        </button>
      );
    }

    return (
      <div style={{ flex: 1 }}>
        <Helmet>
          <title>My React App</title>
          <meta name="Shreyas" content="This is my React application." />
          <meta name="keywords" content="React, JavaScript, Web Development" />
          <meta name="author" content="Your Name" />
        </Helmet>
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Blog List"
              Breadcrumb={[
                { name: "Blog", navigate: "/bloglist" },
                { name: "Blog List", navigate: "" },
              ]}
            />

            <div className="col-lg-4 col-md-12 left-box">
              <SearchCard />
            </div>
            <div className="row clearfix">
              <div className="col-lg-8 col-md-12 left-box">
                <div className="blog-list-container">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>
                          <h4>ID</h4>
                        </th>
                        <th>
                          <h4>Title</h4>
                        </th>
                        <th>
                          <h4>Category</h4>
                        </th>
                        <th>
                          <h4>Published Date</h4>
                        </th>
                        <th>
                          <h4>Read More</h4>
                        </th>
                      </tr>
                    </thead>
                    {(filteredBlogs.length > 0
                      ? filteredBlogs
                      : blogListCardData
                    ).map((data, i) => {
                      return (
                        <BlogListCardList
                          key={"eni" + i}
                          HeaderText={data.title}
                          category={data.category}
                          createdAt={data.createdAt}
                          postId={data._id}
                          blogs={blogListCardData}
                        />
                      );
                    })}
                  </table>
                </div>
                <div className="pagination" style={{justifyContent:"space-evenly"}}>
                  <button
                    onClick={
                      () => this.handlePageClick(currentPage - 1) // Previous page button
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {pages}
                  <button
                    onClick={
                      () => this.handlePageClick(currentPage + 1) // Next page button
                    }
                    disabled={
                      currentPage === Math.ceil(this.state.totalPosts / perPage)
                    }
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default withRouter(connect(mapStateToProps, {})(BlogList));
