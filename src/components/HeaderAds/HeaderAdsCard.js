import React from "react";
import { connect } from "react-redux";
import ReactS3 from "react-s3";
import { withRouter } from "react-router-dom";
import axios from "axios";

class HeaderAdsCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      imageFile: null,
      link: "",
      imageUrl: "", 
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleImageUpload = async (event) => {
    try {
      const file = event.target.files[0];

      if (file) {
        const maxFileSize = 100 * 1024; // 100KB in bytes

        if (file.size <= maxFileSize) {
          // Upload the image to AWS S3
          const config = {
            bucketName: "mif-bucket",
            region: "ap-south-1",
            accessKeyId: "AKIAQPOZMTKKXS7QDAGZ",
            secretAccessKey: "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",
          };

          const awsResponse = await ReactS3.uploadFile(file, config);

          if (awsResponse.location !== "") {
            // Update the state with the S3 URL
            this.setState({ imageUrl: awsResponse.location });
          } else {
            throw new Error("AWS Upload Error");
          }
        } else {
          throw new Error("File size exceeds the maximum limit of 100KB");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  postData = async () => {
    try {
      const { name, link, imageUrl } = this.state;
      const obj = {
        name,
        image: imageUrl,
        link,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/headerads/create`,
        obj
      );

      if (response) {
        this.props.history.push("/dashboard");
      } else {
        throw new Error("Mongo DB Upload Error");
      }
    } catch (error) {
      console.error("Axios POST Error:", error);
    }
  };

  render() {
    const { name, link } = this.state;

    return (
      <div className="card">
        <div className="body">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Ad Name"
              name="name"
              value={name}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Ad Link"
              name="link"
              value={link}
              onChange={this.handleInputChange}
            />
          </div>
          
          <div className="form-group">
            <input
              type="file"
              className="form-control-file"
              id="imageUpload"
              accept="image/*"
              onChange={this.handleImageUpload}
            />
            <medium id="fileHelp" className="form-text text-muted">
              Upload a file smaller than 100kb
            </medium>
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

export default withRouter(connect(null, {})(HeaderAdsCard));
