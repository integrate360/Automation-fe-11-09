import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactS3 from "react-s3";
import axios from "axios";


class FileDocumentCard extends React.Component {
  render() {
    const {
      DocumentIconClass,
      DocumentName,
      DocumentSize,
      DocumentDate,
      FileUrl,
      FileId,
      deleteMedia,
    } = this.props;

    const formatMongoDBDate =(dateString) => {
      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    }

    const handleDelete =()=>{
      const config = {
        bucketName: "mif-bucket",
        region: "ap-south-1",
        accessKeyId: "AKIAQPOZMTKKXS7QDAGZ",
        secretAccessKey: "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",
      };
      ReactS3.deleteFile(DocumentName, config)
      .then(response => {console.log(response)
        axios
        .delete(`${process.env.REACT_APP_API_URL}/api/media/delete`, {data: {
          fileId: FileId
        }})
        .then((response) => {
          console.log(response.data, "ASd");
          this.setState({ mediaFiles: response.data });
          deleteMedia(FileId);
        })
        .catch((err) => {
          console.log("Error", err);
        });
      
      })
      .catch(err => console.log(err))
    } 


    return (
      <div className="col-lg-3 col-md-4 col-sm-12">
        <div className="card">
          <div className="file">
            <a>
              <div className="hover">
                <button onClick={handleDelete} type="button" className="btn btn-icon btn-danger">
                  <i className="fa fa-trash"></i>
                </button>
              </div>

              {FileUrl ? (
                <div className="image">
                  <img src={FileUrl} alt="img" className="img-fluid" />
                </div>
              ) : (
                <div className="icon">
                  <i className={DocumentIconClass}></i>
                </div>
              )}
              <div className="file-name">
                <p className="m-b-5 text-muted">{DocumentName}</p>
                <small> 
                  Size: {DocumentSize}{" "}{"MB"}
                  <span className="date text-muted">{formatMongoDBDate(DocumentDate)}</span>
                </small>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

FileDocumentCard.propTypes = {
  DocumentName: PropTypes.string.isRequired,
  DocumentSize: PropTypes.string.isRequired,
  DocumentDate: PropTypes.string.isRequired,
};

const mapStateToProps = ({ mailInboxReducer, analyticalReducer }) => ({});

export default connect(mapStateToProps, {})(FileDocumentCard);
