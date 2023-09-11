import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import industriesData from "../../industry.json";
import JoditEditor from "jodit-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import schedule from "node-schedule";

class UpdateBlogPost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
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
      scheduled: false,
      scheduledDate: null,
    };
  }

  async componentDidMount() {
    this.fetchCategories();
    const { industries } = industriesData;
    this.setState({ industries });
    const postId = this.props.match.params.postId;
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/post/${postId}`
      );
      const postData = response.data.post; // Assuming the returned data has a "post" property with the post data
      const blogTitle = document.getElementById("blogTitle").value;
      // Update the state with the fetched post data
      this.setState({
        title: postData.title,
        description: postData.description,
        category: postData.category,
        selectedIndustry: postData.selectedIndustry,
        brief: postData.brief,
        keyword: postData.keyword,
        slug: postData.slug,
        metaDescription: postData.metaDescription,
        files: postData.fileArray,
        scheduled: this.state.scheduled,
        scheduledDate: this.state.scheduledDate,
      });
    } catch (error) {
      console.log(error);
      // Handle error when fetching data
    }
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleUpdatePost = async () => {
    const {
      blogTitle,
      description,
      category,
      selectedIndustry,
      brief,
      keyword,
      slug,
      metaDescription,
      files,
      scheduled,
      scheduledDate,
    } = this.state;
    const postId = this.props.match.params.postId;
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/api/post/update/${postId}`, {
        title: blogTitle,
        description,
        category,
        selectedIndustry,
        brief,
        keyword,
        slug,
        metaDescription,
        files,
        scheduled,
        scheduledDate,
      });

      // Handle success: redirect to the post details page or any other page you desire
      this.props.history.push(`/blogdetails/${postId}`);
    } catch (error) {
      console.log(error);
      // Handle error when updating the post
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
  schedulePost = () => {
    const { scheduledDate } = this.state;
    if (scheduledDate) {
      const currentTime = new Date();
      const timeDifference = scheduledDate.getTime() - currentTime.getTime();
      if (timeDifference > 0) {
        this.setState({ scheduled: true });
        const cronPattern = scheduledDate.toISOString(); // Convert the date to a valid cron string
        const job = schedule.scheduleJob(cronPattern, this.postData);
        this.setState({ job }); // Save the reference to the scheduled job
      }
    }
  };
  render() {
    const {
      title,
      description,
      category,
      brief,
      youtubeFile,
      categories,
      selectedIndustry,
      industries,
      keyword,
      scheduled,
      metaDescription,
      scheduledDate,
    } = this.state;

    return (
      <div className="card">
        <div className="body">
          <div className="form-group">
            <input
              type="text"
              value={title}
              className="form-control"
              placeholder="Enter Blog title"
              id="blogTitle"
            />
          </div>
          <div className="form-group">
            <select className="form-control show-tick" id="categorySelect">
              <option>{category}</option>
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
          {scheduled ? (
            <div>
              <p>Blog post scheduled for: {scheduledDate.toString()}</p>
            </div>
          ) : (
            <div>
              <DatePicker
                selected={scheduledDate}
                onChange={(date) => this.setState({ scheduledDate: date })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={5}
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="form-control my-2"
              />
              <button
                type="button"
                className="btn btn-danger mx-2"
                onClick={this.schedulePost}
              >
                Schedule Post
              </button>
            </div>
          )}
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
              value={brief}
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
              value={metaDescription}
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
              if (scheduled) {
                this.setState({ redirectToList: true }, () => {
                  this.schedulePost();
                });
              } else {
                this.handleUpdatePost();
              }
            }}
          >
            Update Post
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ mailInboxReducer }) => ({
  isEventModal: mailInboxReducer.isEventModal,
});

export default withRouter(connect(mapStateToProps, {})(UpdateBlogPost));
