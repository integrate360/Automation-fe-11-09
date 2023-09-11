import React from "react";
import { connect } from "react-redux";

class SearchCard extends React.Component {
  state = {
    searchQuery: "",
  };

  handleSearchInputChange = (event) => {
    const searchQuery = event.target.value;
    this.setState({ searchQuery });
  };

  render() {
    const { searchQuery } = this.state;

    return (
      <div className="card">
        <div className="body search">
          <div className="input-group m-b-0">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="icon-magnifier"></i>
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              value={searchQuery}
              onChange={this.handleSearchInputChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({
  // Assuming your searchQuery is stored in mailInboxReducer.searchQuery
  searchQuery: mailInboxReducer.searchQuery,
});

export default connect(mapStateToProps, {})(SearchCard);
