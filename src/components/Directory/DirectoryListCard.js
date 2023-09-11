/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DynamicMetaTags from "../../utils/DynamicMetaTags";

class DirectoryListCard extends React.Component {
  handleClick = (directoryId) => {
    this.props.history.push(`/directory/${directoryId}`);
  };

  render() {
    const {
      FileArray = [],
      title,
      logo,
      description,
      companyType,
      gst,
      website,
      directoryId,
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
      selectedIndustry,
    } = this.props;

    // const fileUrl = FileArray[0].fileUrl;
    // const fileType = FileArray[0].fileType;
    return (
      <>
        <DynamicMetaTags
          pageTitle="Directory Details"
          pageDescription="This is the home page of our website."
        />
        <div className="card directory_card">
          <div className="body">
            <div className="img-post">
              <img className="d-block img-fluid" src={logo} alt="First slide" />
              {/* {fileType.includes("video") && (
                <video className="d-block img-fluid" controls>
                  <source src={logo} />
                </video>
              )}
              {fileType.includes("image") && (
                <img
                  className="d-block img-fluid"
                  src={logo}
                  alt="First slide"
                />
              )}
              {fileType.includes("youtube") && (
                <iframe
                  width="560"
                  height="315"
                  src={logo}
                  title="YouTube video player"
                  frameorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  controls
                ></iframe>
              )} */}
            </div>
            <h3>
              <a href="directory">{title}</a>
            </h3>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className="footer">
            <div className="directory-info">
              <div>{selectedIndustry}</div>
              <div>{companyType}</div>
              <div>{gst}</div>
              <div>{website}</div>
              <div>{designation}</div>
              <div>{address}</div>
              <div>{city}</div>
              <div>{state}</div>
              <div>{pincode}</div>
              <div>{country}</div>
              <div>{status}</div>
              <div>{sector}</div>
              <div>{establishedDate}</div>
              <div>{contactPerson}</div>
            </div>
            <div className="actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  this.handleClick(directoryId);
                }}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default withRouter(connect(mapStateToProps, {})(DirectoryListCard));
