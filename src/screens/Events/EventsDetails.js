import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import EventsListCard from "../../components/Events/EventsListCard";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DynamicMetaTags from "../../utils/DynamicMetaTags";

class EventsDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _id: "",
      title: "",
      file: [],
      brief: "",
      website: "",
      description: "",
      startTime: null,
      startDate: null,
      endDate: null,
      eventType: "",
      organiserName: "",
      organiserEmail: "",
      venue: "",
      city: "",
      state: "",
      country: "",
      metaDescription: "",
      metaKeywords: "",
      isLoading: true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { match } = this.props;
    const eventId = match.params.eventId;
    console.log(eventId, "idsss");

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/events/${eventId}`)
      .then((response) => {
        console.log(response, "Event response");
        const eventsData = response.data.event;
        console.log(eventsData._id, "esfsv,sdsvns");
        this.setState({
          _id: eventsData._id,
          title: eventsData.title,
          // file: eventsData.media,
          brief: eventsData.brief,
          website: eventsData.website,
          description: eventsData.description,
          startTime: eventsData.startTime,
          startDate: eventsData.startDate,
          endDate: eventsData.endDate,
          eventType: eventsData.eventType,
          organiserName: eventsData.organiserName,
          organiserEmail: eventsData.organiserEmail,
          venue: eventsData.venue,
          city: eventsData.city,
          state: eventsData.state,
          country: eventsData.country,
          metaDescription: eventsData.metaDescription,
          metaKeywords: eventsData.metaKeywords,
          isLoading: false,
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
      // file,
      brief,
      website,
      description,
      startTime,
      startDate,
      endDate,
      eventType,
      organiserName,
      organiserEmail,
      venue,
      city,
      state,
      country,
      metaDescription,
      metaKeywords,
      isLoading,
    } = this.state;

    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <>
        <DynamicMetaTags pageTitle={title} pageDescription={brief} />
        <div
          onClick={() => {
            document.body.classList.remove("offcanvas-active");
          }}
        >
          <div>
            <div className="container-fluid">
              <PageHeader
                HeaderText="Event Details"
                Breadcrumb={[
                  { name: "Events", navigate: "" },
                  { name: "Event Details", navigate: "" },
                ]}
              />

              <div className="row clearfix">
                <div className="col-lg-8 col-md-12 left-box">
                  <EventsListCard
                    // FileArray={file}
                    title={title}
                    brief={brief}
                    eventId={_id}
                    website={website}
                    description={description}
                    startTime={startTime}
                    startDate={startDate}
                    endDate={endDate}
                    eventType={eventType}
                    organiserName={organiserName}
                    organiserEmail={organiserEmail}
                    venue={venue}
                    city={city}
                    state={state}
                    country={country}
                    metaDescription={metaDescription}
                    metaKeywords={metaKeywords}
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

export default withRouter(connect(mapStateToProps, {})(EventsDetails));
