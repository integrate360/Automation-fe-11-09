import React from "react";
import { connect } from "react-redux";
import JoditEditor from "jodit-react";
import { withRouter } from "react-router-dom";
import ReactS3 from "react-s3";
import axios from "axios";
import industriesData from "../../industry.json";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import schedule from "node-schedule";

class DirectoryCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      industries: [],
      selectedIndustry: "",
      youtubeFile: false,
      userFile: [],
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
      establishedDate: null,
      contactPerson: "",
      scheduled: false,
      scheduledDate: null,
      redirectToList: false,
      job: null,
    };
  }

  componentDidMount() {
    // this.fetchCategories();
    const { industries } = industriesData;
    this.setState({ industries });
  }

  postData = async () => {
    try {
      const {
        title,
        description,
        selectedIndustry,
        userFile,
        youtubeFile,
        youtubeUrl,
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
          description,
          selectedIndustry,
          files: fileArray,
          youtubeFile,
          youtubeUrl,
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
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/directory/create`,
          obj
        );

        if (response) {
          if (this.state.redirectToList) {
            this.props.history.push(`/directory/${response.data._id}`);
          } else {
            this.props.history.push("/directoryList");
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

  handleIndustryChange = (event) => {
    this.setState({ selectedIndustry: event.target.value });
  };

  // handleScheduledDateChange = (date) => {
  //   this.setState({ scheduledDate: date });
  // };

  // schedulePost = () => {
  //   const { scheduledDate } = this.state;
  //   if (scheduledDate) {
  //     const currentTime = new Date();
  //     const timeDifference = scheduledDate.getTime() - currentTime.getTime();
  //     if (timeDifference > 0) {
  //       this.setState({ scheduled: true });
  //       const cronPattern = scheduledDate.toISOString(); // Convert the date to a valid cron string
  //       const job = schedule.scheduleJob(cronPattern, this.postData);
  //       this.setState({ job }); // Save the reference to the scheduled job
  //     }
  //   }
  // };

  render() {
    const {
      title,
      description,
      industries,
      youtubeFile,
      selectedIndustry,
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
      // scheduled,
      // scheduledDate,
    } = this.state;

    return (
      <div className="card">
        <div className="body">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Directory Title"
              name="title"
              value={title}
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <select
              className="form-control show-tick"
              id="industry"
              value={selectedIndustry}
              onChange={this.handleIndustryChange}
            >
              <option value="">Select Industry</option>
              {industries.map((industry, index) => (
                <option key={index} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group mt-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Company Type"
              name="companyType"
              value={companyType}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter GST"
              name="gst"
              value={gst}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Website"
              name="website"
              value={website}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Designation"
              name="designation"
              value={designation}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Address"
              name="address"
              value={address}
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
              placeholder="Enter Pincode"
              name="pincode"
              value={pincode}
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
            <input
              type="text"
              className="form-control"
              placeholder="Enter Status"
              name="status"
              value={status}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Sector"
              name="sector"
              value={sector}
              onChange={this.handleInputChange}
            />
          </div>

          <div className="form-group">
            <DatePicker
              selected={establishedDate}
              onChange={(date) => this.setState({ establishedDate: date })}
              className="form-control"
              placeholderText="Select Established Date"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Contact Person"
              name="contactPerson"
              value={contactPerson}
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
            <JoditEditor
              value={description}
              config={{ readonly: false }}
              tabIndex={1}
              onBlur={(text) => this.handleEditorChange(text)} // Call handleEditorChange when the editor content changes
            />
          </div>

          {/* <div className="form-group">
            <DatePicker
              selected={scheduledDate}
              onChange={this.handleScheduledDateChange}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={5}
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-control"
              placeholderText="Select Scheduled Date"
            />
          </div>

          <div className="form-group">
            <button
              type="button"
              className="btn btn-danger mx-2"
              onClick={this.schedulePost}
            >
              Schedule Post
            </button>
          </div> */}

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

export default withRouter(connect(null, {})(DirectoryCard));
