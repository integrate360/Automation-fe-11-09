import React from "react";
import { connect } from "react-redux";
import JoditEditor from "jodit-react";
import ReactS3 from "react-s3";
import { withRouter } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class EventsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      userFile: [],
      brief: "",
      website: "",
      description: "",
      youtubeFile: false,
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
    };
  }
  

  postData = async () => {
    try {
      const {
        title,
        userFile,
        brief,
        website,
        description,
        youtubeFile,
        youtubeUrl,
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
      } = this.state;

      if ((userFile && !youtubeFile) || (youtubeFile && youtubeUrl)) {
        let fileArray = [];

        if (userFile && !youtubeFile) {
          for (const singleFile of userFile) {
            // Upload the file to AWS S3
            const config = {
              bucketName: "mif-bucket",
              region: "ap-south-1",
              accessKeyId: "AKIAQPOZMTKKXS7QDAGZ",
              secretAccessKey: "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",
            };

            const awsResponse = await ReactS3.uploadFile(singleFile, config);
            const fileSizeKb = singleFile.size / 1024;
            const fileSizeMb = fileSizeKb / 1024;

            if (awsResponse.location !== "") {
              const fileObj = {
                fileSize: fileSizeMb,
                fileName: singleFile.name,
                fileType: singleFile.type,
                fileUrl: awsResponse.location,
              };

              fileArray.push(fileObj);
            } else {
              throw new Error("AWS Upload Error");
            }
          }
        }

        if (youtubeFile && youtubeUrl) {
          const youtubeObj = {
            fileSize: 0,
            fileName: "YouTube.mp4",
            fileType: "youtube",
            fileUrl: youtubeUrl,
          };

          fileArray.push(youtubeObj);
        }

        const obj = {
          title,
          files: fileArray,
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
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/events/create`,
          obj
        );

        if (response) {
          if (this.state.redirectToList) {
            this.props.history.push(`/directory/${response.data._id}`);
          } else {
            this.props.history.push("/eventsList");
          }
        } else {
          throw new Error("Mongo DB Upload Error");
        }
      } else {
        throw new Error("Please upload a file or provide a YouTube URL");
      }
    } catch (error) {
      console.log(error);
    }
  };
  isMediaFile = (file) => {
    const mediaTypes = [
      "audio/mp3",
      "video/mp4",
      "video/quicktime",
      "video/x-msvideo",
      "video/x-matroska",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    return mediaTypes.includes(file.type);
  };

  handleFileChange = async (event) => {
    const file = event.target.files[0];
    
    if (this.isMediaFile(file)) {
      this.setState({ userFile: event.target.files });
    } else {
      document.getElementById("fileUpload").reset();
      window.alert("Invalid file type");
    }
  };
  handleYouTubeUrlChange = (event) => {
    const youtubeUrl = event.target.value;
    this.setState({ youtubeUrl });
  };

  handleEditorChange = (content) => {
    this.setState({ description: content });
  };

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleDateChange = (name, date) => {
    this.setState({ [name]: date });
  };

  render() {
    const {
      title,
      brief,
      youtubeFile,
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
    } = this.state;

    return (
      <div className="card">
        <div className="body">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Event Title"
              name="title"
              value={title}
              onChange={this.handleInputChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-danger my-2"
            onClick={() => this.setState({ youtubeFile: !youtubeFile })}
          >
            {youtubeFile ? "Switch to File Upload" : "Switch to URL"}
          </button>
          {this.state.youtubeFile ? (
            <div className="form-group m-t-10 m-b-20">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Youtube URL"
                name="fileUrl"
                id="youtubeUrl"
                onChange={this.handleYouTubeUrlChange}
              />
            </div>
          ) : (
            <div className="form-group m-t-10 m-b-20">
              <input
                accept="audio/*,video/*,image/*"
                type="file"
                className="form-control-file"
                id="fileUpload"
                multiple
                aria-describedby="fileHelp"
                onChange={this.handleFileChange}
              />
              <small id="fileHelp" className="form-text text-muted">
                This is some placeholder block-level help text for the above
                input. It's a bit lighter and easily wraps to a new line.
              </small>
            </div>
          )}
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Enter Event Brief"
              name="brief"
              value={brief}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Event Website"
              name="website"
              value={website}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <JoditEditor
              value={description}
              config={{ readonly: false }}
              tabIndex={1}
              onBlur={(text) => this.handleEditorChange(text)}
            />
          </div>

          <div className="form-group">
            <input
              type="time"
              className="form-control"
              placeholder="Enter Start Time"
              name="startTime"
              value={startTime}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <DatePicker
              selected={startDate}
              onChange={(date) => this.handleDateChange("startDate", date)}
              className="form-control"
              placeholderText="Select Start Date"
            />
          </div>

          <div className="form-group">
            <DatePicker
              selected={endDate}
              onChange={(date) => this.handleDateChange("endDate", date)}
              className="form-control"
              placeholderText="Select End Date"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Event Type"
              name="eventType"
              value={eventType}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Organiser Name"
              name="organiserName"
              value={organiserName}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Organiser Email"
              name="organiserEmail"
              value={organiserEmail}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Venue"
              name="venue"
              value={venue}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter City"
              name="city"
              value={city}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter State"
              name="state"
              value={state}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Country"
              name="country"
              value={country}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Enter Meta Description"
              name="metaDescription"
              value={metaDescription}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Enter Meta Keywords"
              name="metaKeywords"
              value={metaKeywords}
              onChange={this.handleInputChange}
            />
          </div>

          <button
            type="button"
            className="btn btn-block btn-danger m-t-20"
            onClick={this.postData}
          >
            Post
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(null, {})(EventsCard));
