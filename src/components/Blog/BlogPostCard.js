import React from "react";
import { connect } from "react-redux";
import JoditEditor from "jodit-react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import ReactS3 from "react-s3";
import industriesData from "../../industry.json";
import "react-datepicker/dist/react-datepicker.css";

class BlogPostCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      userFile: [],
      keyword: "",
      youtubeFile: false,
      categories: [],
      newCategory: "",
      industries: [],
      selectedIndustry: "",
      slug: "",
      metaDescription: "",
    };
  }

  componentDidMount() {
    this.fetchCategories();
    const { industries } = industriesData;
    this.setState({ industries });
  }
  postData = async () => {
    try {
      const {
        description,
        userFile,
        youtubeFile,
        youtubeUrl,
        keyword,
        selectedIndustry,
        slug,
      } = this.state;
      const categoryResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/categories/getallcategories`
      );
      const categories = categoryResponse.data;
      console.log(categories, "categfsfnvsshnfer");
      const blogTitle = document.getElementById("blogTitle").value;
      const category = document.getElementById("categorySelect").value;
      const brief = document.getElementById("brief").value;
      const metaDescription = document.getElementById("metaDescription").value;

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
          title: blogTitle,
          category: category,
          description: description,
          selectedIndustry: selectedIndustry,
          brief: brief,
          keyword: keyword,
          slug: slug,
          metaDescription: metaDescription,
          files: fileArray,
        };
        console.log(obj.category, "keyword");
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/post/create`,
          obj
        );

        if (response) {
          if (this.state.redirectToList) {
            this.props.history.push(`/blogdetails/${response.data._id}`);
          } else {
            this.props.history.push("/bloglist");
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
  fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/categories/getallcategories`
      );
      const categories = response.data;
      console.log(categories, "bsfebshbfshf");
      this.setState({ categories });
    } catch (error) {
      console.log(error);
      // Handle the error
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
  handleChange = (event) => {
    const inputText = event.target.value;
    this.setState({ keyword: inputText });

    // Convert text to hashtags
    const hashtags = inputText.split(" ").map((word) => "#" + word);
    console.log(hashtags); // Output the converted hashtags to the console for demonstration
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

  handleEditorChange = (content) => {
    this.setState({ description: content });
  };

  handleYouTubeUrlChange = (event) => {
    const youtubeUrl = event.target.value;
    this.setState({ youtubeUrl });
  };
  handleNewCategoryChange = (event) => {
    const newCategory = event.target.value;
    this.setState({ newCategory });
  };

  addNewCategory = async () => {
    const { newCategory } = this.state;
    if (typeof newCategory === "string" && newCategory.trim() !== "") {
      try {
        // Send a POST request to add the new category
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/categories/createcategory`,
          { name: newCategory }
        );
        const addedCategory = response.data;

        // Update the state with the added category
        this.setState((prevState) => ({
          categories: [...prevState.categories, addedCategory],
          newCategory: "",
        }));
      } catch (error) {
        console.log(error);
        // Handle the error
      }
    }
  };

  handleIndustryChange = (event) => {
    this.setState({ selectedIndustry: event.target.value });
  };

  render() {
    const { youtubeFile } = this.state;
    const { keyword } = this.state;
    const { categories } = this.state;
    const { industries, selectedIndustry } = this.state;
    return (
      <div className="card">
        <div className="body">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Blog title"
              id="blogTitle"
            />
          </div>
          <div className="form-group">
            <select className="form-control show-tick" id="categorySelect">
              <option>Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter New Category"
              id="newCategory"
              onChange={this.handleNewCategoryChange}
            />
            <button
              type="button"
              className="btn btn-primary mt-2"
              onClick={this.addNewCategory}
            >
              Add New Category
            </button>
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
            <input
              type="text"
              className="form-control"
              placeholder="Enter a brief description"
              id="brief"
            />
          </div>
          <JoditEditor
            value={this.state.description}
            config={{ readonly: false }}
            tabIndex={1}
            onBlur={(text) => this.handleEditorChange(text)} // Call handleEditorChange when the editor content changes
            // onChange={(text) => this.handleEditorChange(text)} // Call handleFileChange when the file input changes
          />
          <div className="form-group my-3">
            {/* <textarea
              type="text"
              className=""
              placeholder="Enter Meta Keywords title"
              rows="3"
              id="keyword"
              cols="162"
              aria-describedby="fileHelp"
            /> */}
            <input
              type="text"
              value={keyword}
              placeholder="Enter Tags for the Post"
              className="form-control"
              onChange={this.handleChange}
            />
            {/* <div>
              {keyword &&
                keyword[0].split(" ").map((word, index) => {
                  return <span key={index}>#{word} </span>;
                })}
            </div> */}
            <small id="fileHelp" className="form-text text-muted">
              Enter (space) after every keyword{" "}
            </small>
          </div>
          <div className="form-group">
            <textarea
              type="text"
              className="form-control"
              placeholder="Enter a Meta description"
              id="metaDescription"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter the Slug"
              id="slug"
              value={this.state.slug}
              onChange={(event) => this.setState({ slug: event.target.value })}
            />
            <small id="fileHelp" className="form-text text-muted">
              Enter (-) after every word{" "}
            </small>
          </div>

          <button
            type="button"
            className="btn btn-block btn-danger m-t-20 "
            onClick={() => {
              this.postData();
            }}
          >
            Post
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
});

export default withRouter(connect(mapStateToProps, {})(BlogPostCard));
