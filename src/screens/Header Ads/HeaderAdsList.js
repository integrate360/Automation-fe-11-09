import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import SearchCard from "../../components/Blog/SearchCard";
import axios from "axios";
import { Helmet } from "react-helmet";
import { withRouter } from "react-router-dom";
import HeaderAdsListCard from "../../components/HeaderAds/HeaderAdsListCard";

class HeaderAdsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      blogListCardData: [],
      isLoading: true,
      filteredBlogs: [],
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
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/headerads/allads`)
      .then((response) => {
        console.log(response.data, "ASd");
        this.setState({ blogListCardData: response.data, isLoading: false });
        this.filterBlogsByKeywordFromURL();
      })
      .catch(() => {
        console.log("Error");
      });
  }
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
  render() {
    const { blogListCardData, filteredBlogs } = this.state;
    const isLoading = this.state.isLoading;
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
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
                { name: "Blog", navigate: "/adslist" },
                { name: "Blog List", navigate: "" },
              ]}
            />

            <div className="col-lg-4 col-md-12 left-box">
              {/* <SearchCard /> */}
            </div>
            <div className="row clearfix">
              <div className="col-lg-8 col-md-12 left-box">
                <div className="blog-list-container">
                  <table className="table table-bordered">
                    {(filteredBlogs.length > 0
                      ? filteredBlogs
                      : blogListCardData
                    ).map((data, i) => {
                      console.log(data, "ASFASfasfasf");
                      return (
                        <HeaderAdsListCard
                          key={"eni" + i}
                          name={data.name}
                          link={data.link}
                          image={data.image}
                          adsId={data._id}
                          blogs={blogListCardData}
                        />
                      );
                    })}
                  </table>
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

export default withRouter(connect(mapStateToProps, {})(HeaderAdsList));
