import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DynamicMetaTags from "../../utils/DynamicMetaTags";

class EventsListCard extends React.Component {
  handleClick = (eventId) => {
    this.props.history.push(`/events/${eventId}`);
  };

  render() {
    const {
      // FileArray = [],
      title,
      brief,
      eventId,
      website,
      description,
      eventType,
      organiserName,
      organiserEmail,
      venue,
      city,
      state,
      country,
      metaDescription,
      metaKeywords,
    } = this.props;
    
    // const fileUrl = FileArray[0].fileUrl;
    // const fileType = FileArray[0].fileType;

    return (
      <>
        <DynamicMetaTags pageTitle={title} pageDescription={brief} />
        <div className="card event_card">
          <div className="body">
            {/* <div className="img-post">
            {fileType.includes("video") && (
                <video className="d-block img-fluid" controls>
                  <source src={FileArray[0].fileUrl} />
                </video>
              )}
              {fileType.includes("image") && (
                <img
                  className="d-block img-fluid"
                  src={fileUrl}
                  alt="First slide"
                />
              )}
              {fileType.includes("youtube") && (
                <iframe
                  width="560"
                  height="315"
                  src={fileUrl}
                  title="YouTube video player"
                  frameorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  controls
                ></iframe>
              )}
            </div> */}
            <h3>
              <a href="events">{title}</a>
            </h3>
            <div dangerouslySetInnerHTML={{ __html: description }} />
          </div>
          <div className="footer">
            <div className="event-info">
              <div>{brief}</div>
              <div>{website}</div>
              <div>{eventType}</div>
              <div>{organiserName}</div>
              <div>{organiserEmail}</div>
              <div>{venue}</div>
              <div>{city}</div>
              <div>{state}</div>
              <div>{country}</div>
              <div>{metaDescription}</div>
              <div>{metaKeywords}</div>
            </div>
            <div className="actions">
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  this.handleClick(eventId);
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

export default withRouter(connect(mapStateToProps, {})(EventsListCard));
