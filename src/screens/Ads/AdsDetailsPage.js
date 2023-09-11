import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DynamicMetaTags from "../../utils/DynamicMetaTags";
import AdsListCard from "../../components/Ads/AdsListCard";

class AdsDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      name: "",
      image: null,
      link: "",
      category: "",
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    const { match } = this.props;
    const adsId = match.params.adsId;

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/mainads/get/${adsId}`)
      .then((response) => {
        console.log(response.data, "Sfdafsafasf");
        this.setState({
          _id: response.data._id,
          name: response.data.name,
          link: response.data.link,
          image: response.data.image,
          category: response.data.category,
          isLoading: false,
        });
      })
      .catch(() => {
        console.log("Error");
      });
  }

  render() {
    const { _id, name, link, image, category, isLoading } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }
    return (
      <>
        <DynamicMetaTags
          pageTitle={this.state.title}
          pageDescription={this.state.description}
        />
        <div
          onClick={() => {
            document.body.classList.remove("offcanvas-active");
          }}
        >
          <div>
            <div className="container-fluid">
              <PageHeader
                HeaderText="Blog Details"
                Breadcrumb={[
                  { name: "Ads", navigate: "" },
                  { name: "Ads Details", navigate: "" },
                ]}
              />

              <div className="row clearfix">
                <div className="col-lg-8 col-md-12 left-box">
                  <AdsListCard
                    name={name}
                    link={link}
                    adsId={_id}
                    category={category}
                    image={image}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default withRouter(connect(mapStateToProps, {})(AdsDetailsPage));
