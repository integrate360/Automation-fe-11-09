import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import DirectoryListCard from "../../components/Directory/DirectoryListCard";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DynamicMetaTags from "../../utils/DynamicMetaTags";

class DirectoryDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      title: "",
      description: "",
      file: [],
      category: [],
      companyType: "",
      gst: "",
      website: "",
      designation: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      status: "",
      sector: "",
      establishedDate: "",
      contactPerson: "",
      isLoading: true,
      selectedIndustry: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { match } = this.props;
    const directoryId = match.params.directoryId;
    console.log(directoryId, "idsss")

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/directory/${directoryId}`)
      .then((response) => {
        console.log(response, "Directory response");
        const directoryData = response.data.directories;
        this.setState({
          _id: directoryData._id,
          title: directoryData.title,
          description: directoryData.description,
          file: directoryData.media,
          category: directoryData.category,
          companyType: directoryData.companyType,
          gst: directoryData.gst,
          website: directoryData.website,
          designation: directoryData.designation,
          address: directoryData.address,
          city: directoryData.city,
          state: directoryData.state,
          pincode: directoryData.pincode,
          country: directoryData.country,
          status: directoryData.status,
          sector: directoryData.sector,
          establishedDate: directoryData.establishedDate,
          contactPerson: directoryData.contactPerson,
          isLoading: false,
          selectedIndustry: directoryData.selectedIndustry,
        });
      })
      .catch(() => {
        console.log("Error");
      });
  }

  render() {
    const {
      _id,
      title,
      description,
      file,
      category,
      companyType,
      gst,
      website,
      designation,
      address,
      city,
      state,
      pincode,
      country,
      status,
      sector,
      establishedDate,
      contactPerson,
      isLoading,
      selectedIndustry,
    } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <DynamicMetaTags
          pageTitle={title}
          pageDescription={description}
        />
        <div
          onClick={() => {
            document.body.classList.remove("offcanvas-active");
          }}
        >
          <div>
            <div className="container-fluid">
              <PageHeader
                HeaderText="Directory Details"
                Breadcrumb={[
                  { name: "Directory", navigate: "" },
                  { name: "Directory Details", navigate: "" },
                ]}
              />

              <div className="row clearfix">
                <div className="col-lg-8 col-md-12 left-box">
                  <DirectoryListCard
                    FileArray={file}
                    title={title}
                    description={description}
                    category={category}
                    companyType={companyType}
                    gst={gst}
                    directoryId={_id}
                    website={website}
                    designation={designation}
                    address={address}
                    city={city}
                    state={state}
                    pincode={pincode}
                    country={country}
                    status={status}
                    sector={sector}
                    establishedDate={establishedDate}
                    contactPerson={contactPerson}
                    selectedIndustry={selectedIndustry}
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

export default withRouter(connect(mapStateToProps, {})(DirectoryDetails));
