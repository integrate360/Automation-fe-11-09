import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DynamicMetaTags from "../../utils/DynamicMetaTags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

class HeaderAdsListCard extends React.Component {
  handleClick = (adsId) => {
    this.props.history.push(`/ads/${adsId}`);
  };

  handleDelete = () => {
    const { adsId } = this.props;

    // Make an API call to delete the post
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/headerads/${adsId}`)
      .then((response) => {
        window.location.reload();

        // Show a success message prompt
        window.alert("Post deleted successfully");
        console.log("Post deleted successfully");
      })
      .catch((error) => {
        // Handle errors, e.g., display an error message
        console.error("Error deleting post:", error);
      });
  };

  render() {
    const { name, image, link} = this.props;

    return (
      <>
        <DynamicMetaTags pageTitle={name} pageDescription={link} />
        <div className="card event_card" style={{width: "1200px"}}>
          <button
            onClick={this.handleDelete}
            style={{
              float: "right",
              margin: "10px",
              color: "white",
              background: "red",
              border: "none",
            }}
          >
            <FontAwesomeIcon icon={faTrash} /> Delete{" "}
          </button>
          <div className="body">
            <a href={link} target="_blank" rel="noopener noreferrer">
              <img
                className="d-block img-fluid"
                src={image}
                alt="First slide"
                style={{ width: "1200px", height: "150px" }}
              />
            </a>
          </div>
          <div className="event-info" style={{ marginLeft: "20px" }}>
            <h3>{name}</h3>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({});

export default withRouter(connect(mapStateToProps, {})(HeaderAdsListCard));
