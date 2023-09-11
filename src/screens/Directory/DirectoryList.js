import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import SearchCard from "../../components/Blog/SearchCard";
import axios from "axios";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import DirectoryListCardList from "../../components/Directory/DirectoryListCardList";

const perPage = 12;
const maxPagesDisplayed = 10;

class DirectoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      directoryListCardData: [],
      isLoading: true,
      filteredDirectories: [],
      currentPage: 1, // Current page
      totalDirectories: 0, // Total number of directories
    };
  }

  filterDirectoriesByKeyword = (keyword) => {
    const filteredDirectories = this.state.directoryListCardData.filter(
      (directory) => directory.metaKeywords.includes(keyword)
    );
    this.setState({ filteredDirectories });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    // Load initial page (page 1)
    this.loadDirectoryList(1);
  }

  loadDirectoryList = (page) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/directory/alldirectories?page=${page}`)
      .then((response) => {
        this.setState({
          directoryListCardData: response.data.posts,
          isLoading: false,
          currentPage: page,
          totalDirectories: response.data.totalDirectories,
        });
        this.filterDirectoriesByKeywordFromURL();
      })
      .catch(() => {
        console.log("Error");
      });
  };

  filterDirectoriesByKeywordFromURL = () => {
    const params = new URLSearchParams(this.props.location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      const filteredDirectories = this.state.directoryListCardData.filter(
        (directory) => directory.metaKeywords.includes(keyword)
      );
      this.setState({ filteredDirectories });
    }
  };

  // Handle pagination button clicks
  handlePageClick = (page) => {
    this.loadDirectoryList(page);
  };

  calculatePaginationRange = () => {
    const { currentPage } = this.state;
    const totalPages = Math.ceil(this.state.totalDirectories / perPage);

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
    const { directoryListCardData, filteredDirectories, currentPage } =
      this.state;
    const isLoading = this.state.isLoading;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    const { startPage, endPage } = this.calculatePaginationRange();
    const totalPages = Math.ceil(this.state.totalDirectories / perPage); // Calculate total pages
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
              HeaderText="Directory List"
              Breadcrumb={[
                { name: "Directory", navigate: "/directorylist" },
                { name: "Directory List", navigate: "" },
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
                          <h4>Contact Person</h4>
                        </th>
                        <th>
                          <h4>Published Date</h4>
                        </th>
                        <th>
                          <h4>Read More</h4>
                        </th>
                      </tr>
                    </thead>
                    {(filteredDirectories.length > 0
                      ? filteredDirectories
                      : directoryListCardData
                    ).map((data, i) => {
                      return (
                        <DirectoryListCardList
                          key={"eni" + i}
                          HeaderText={data.title}
                          contactPerson={data.contactPerson}
                          createdAt={data.establishedDate}
                          postId={data._id}
                          blogs={directoryListCardData}
                        />
                      );
                    })}
                  </table>
                </div>
                <div
                  className="pagination"
                  style={{ justifyContent: "space-evenly" }}
                >
                  <button
                    onClick={() => this.handlePageClick(currentPage - 1)} // Previous page button
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {pages}
                  <button
                    onClick={() => this.handlePageClick(currentPage + 1)} // Next page button
                    disabled={currentPage === totalPages}
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

export default withRouter(connect(mapStateToProps, {})(DirectoryList));
