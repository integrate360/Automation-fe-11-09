import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import FileDocumentCard from "../../components/FileManager/FileDocumentCard";
import axios from "axios";

class FileMedia extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaFiles: [],
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/media/allfiles`)
      .then((response) => {
        console.log(response.data, "ASd");
        this.setState({ mediaFiles: response.data });
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  render() {
    const deleteMedia = (idToDelete) => {
      this.setState(prevState => ({
        mediaFiles: prevState.mediaFiles.filter(item => item._id !== idToDelete)
      }));
    };
    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="File Media"
              Breadcrumb={[
                { name: "File Manager", navigate: "" },
                { name: "File Media", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {this.state.mediaFiles.map((data, i) => {
                return (
                  <FileDocumentCard
                    key={i}
                    DocumentIconClass={"fa fa-image"}
                    DocumentName={data.fileName}
                    DocumentSize={data.fileSize.substring(0, 4)}
                    DocumentDate={data.createdAt}
                    FileUrl={data.fileUrl}
                    FileId={data._id}
                    deleteMedia={deleteMedia}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({
  isSecuritySystem: ioTReducer.isSecuritySystem,
});

export default connect(mapStateToProps, {})(FileMedia);
