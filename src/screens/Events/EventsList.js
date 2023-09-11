import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import SearchCard from "../../components/Blog/SearchCard";
import axios from "axios";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import EventsListCardList from "../../components/Events/EventsListCardList";

const perPage = 12;
const maxPagesDisplayed = 10;

class EventsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsListCardData: [],
      isLoading: true,
      filteredEvents: [],
      currentPage: 1,
      totalEvents: 0,
    };
  }

  filterEventsByKeyword = (keyword) => {
    const filteredEvents = this.state.eventsListCardData.filter((event) =>
      event.metaKeywords.includes(keyword)
    );
    this.setState({ filteredEvents });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
    // Load initial page (page 1)
    this.loadEventsList(1);
  }

  loadEventsList = (page) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/events/allevents?page=${page}`)
      .then((response) => {
        this.setState({
          eventsListCardData: response.data.posts,
          isLoading: false,
          currentPage: page,
          totalEvents: response.data.totalEvents,
        });
        this.filterEventsByKeywordFromURL();
      })
      .catch(() => {
        console.log("Error");
      });
  };

  filterEventsByKeywordFromURL = () => {
    const params = new URLSearchParams(this.props.location.search);
    const keyword = params.get("keyword");
    if (keyword) {
      const filteredEvents = this.state.eventsListCardData.filter((event) =>
        event.metaKeywords.includes(keyword)
      );
      this.setState({ filteredEvents });
    }
  };
  handlePageClick = (page) => {
    this.loadEventsList(page);
  };

  calculatePaginationRange = () => {
    const { currentPage } = this.state;
    const totalPages = Math.ceil(this.state.totalEvents / perPage);

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
    const { eventsListCardData, filteredEvents, currentPage } = this.state;
    const isLoading = this.state.isLoading;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    const { startPage, endPage } = this.calculatePaginationRange();
    const totalPages = Math.ceil(this.state.totalEvents / perPage);
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
              HeaderText="Events List"
              Breadcrumb={[
                { name: "Events", navigate: "/eventslist" },
                { name: "Events List", navigate: "" },
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
                          <h4>Organiser Name</h4>
                        </th>
                        <th>
                          <h4>Published Date</h4>
                        </th>
                        <th>
                          <h4>Read More</h4>
                        </th>
                      </tr>
                    </thead>
                    {(filteredEvents.length > 0
                      ? filteredEvents
                      : eventsListCardData
                    ).map((data, i) => {
                      return (
                        <EventsListCardList
                          key={"eni" + i}
                          HeaderText={data.title}
                          organiserName={data.organiserName}
                          createdAt={data.createdAt}
                          postId={data._id}
                          blogs={eventsListCardData}
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
                    onClick={() => this.handlePageClick(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  {pages}
                  <button
                    onClick={() => this.handlePageClick(currentPage + 1)}
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

export default withRouter(connect(mapStateToProps, {})(EventsList));
