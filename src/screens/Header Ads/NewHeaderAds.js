import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import HeaderAdsCard from "../../components/HeaderAds/HeaderAdsCard";

class NewHeaderAds extends React.Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  render() {
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Blog Post"
              Breadcrumb={[
                { name: "Blog", navigate: "/bloglist" },
                { name: "Blog Post", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <HeaderAdsCard />
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

export default connect(mapStateToProps, {})(NewHeaderAds);
