import React, { useState, useEffect, useContext, useRef } from "react";
import { queryContext } from "../contexts/QueryContext";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Fab from "@material-ui/core/Fab";
import CloseIcon from "@material-ui/icons/Close";
import Slider from "@material-ui/core/Slider";
import { DropzoneArea } from "material-ui-dropzone";
import SeperateLine from "../components/SeperateLine";
import { baseColor } from "../utils/color";
import { delayRunFunc } from "../utils/Helper";

const Setting = (props: any) => {
  const isMobile = !useMediaQuery("(min-width:1000px)");
  const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
      setting: {
        display: "flex",
        flexDirection: "column",
        minWidth: isMobile ? "90%" : "300px",
        padding: "60px 20px",
        borderWidth: "1px",
        backgroundColor: "#1F2023",
        color: "#E4E4E6",
        overflowY: "auto",
      },
      header: {
        marginBottom: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      },
      configHead: {
        marginBottom: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      },
      config: {
        fontSize: "24px",
        color: "#FAFAFA",
      },
      clear: {
        color: baseColor,
        fontSize: "18px",
        cursor: "pointer",
      },
      imageSet: {},
      counts: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "30px",
        color: "#FAFAFA",
      },
      currTotal: {
        fontSize: "12px",
      },
      setPath: {
        display: "flex",
        justifyContent: "start",
        alignItems: "center",
        marginBottom: "30px",
      },
      customInput: {
        margin: "0 20px 0 0 !important",
        color: "blue !important",
        width: isMobile ? "80%" : "auto",
      },
      customFab: {
        color: "#fff",
        backgroundColor: baseColor,
        width: "36px",
        height: "36px",
        "&:hover": {
          backgroundColor: baseColor,
        },
      },
      customDeleteFab: {
        position: "absolute",
        top: "5px",
        right: "5px",
        color: "#fff",
        backgroundColor: "#666769",
        width: "24px",
        height: "24px",
        minHeight: "0px",
        "&:hover": {
          backgroundColor: "#666769",
        },
      },
      customDelete: {
        color: "#A7A7AF",
        width: "18px",
        height: "18px",
      },
      customIcon: {
        color: "#fff",
        backgroundColor: baseColor,
        width: "20px",
        height: "20px",
      },
      customSlider: {
        color: baseColor,
        marginBottom: "30px",
      },
      thumb: {
        width: "16px",
        height: "16px",
      },
      track: {
        height: "4px",
        borderRadius: "10px",
      },
      upload: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      benchImage: {
        width: "400px",
        height: "250px",
        position: "relative",
      },
      dropzoneContainer: {
        backgroundColor: "transparent",
        width: "250px",
        height: "250px",
        borderRadius: "10px",
        border: "solid .5px #C8C8C8",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      dropzoneText: {
        fontSize: "14px",
        color: "#B3B4B5",
        marginBottom: "30px",
      },
      notchedOutline: {
        borderWidth: ".5px",
        borderColor: "#838385 !important",
      },
      formLabel: {
        color: "#fff",
      },
      controlLabel: {
        color: "#838385",
      },
    });
  });
  const {search} = useContext(queryContext);
  const { setImages, setLoading } = props;
  const classes = useStyles({});
  const [topK, setTopK]: any = useState(5);
  const [image, setImage]: any = useState();
  const benchImage = useRef<any>(null);
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    function () {
      if (benchImage.current) {
        benchImage.current.src = reader.result;
      }
    },
    false
  );
  
  const _search = ({ topK, image }: any) => {
    const fd = new FormData();
    fd.set("topk", topK);
    fd.append("image", image);
    search(fd).then((res: any) => {
      const { status, data } = res || {};
      if (status === 200) {
        setImages(data);
        setLoading(false)
      }
    });
  };

  const uploadImg = (file: any) => {
    setImage(file);
    setLoading(true)
    reader.readAsDataURL(file);
    _search({ topK, image: file });
  };

  const onTopKChange = (e: any, val: any) => {
    setTopK(val);
    setLoading(true)
    if (val && image) {
      delayRunFunc({ topK: val, image }, _search, 300);
    }
    setLoading(false)
  };

  const clear = () => {
    setImage();
    setImages();
  };

  useEffect(() => {
  }, []);

  return (
    <div className={classes.setting}>
      <div className={classes.header}>
        <h3 className={classes.title}>Image Search</h3>
      </div>
      <div className={classes.configHead}>
        <h4 className={classes.clear} onClick={clear}>
          CLEAR
        </h4>
      </div>
      <div className={classes.imageSet}>
        <SeperateLine title={`TOP K(1－100)`} style={{ marginBottom: "20px" }} />
        <div className={classes.counts}>
          <p>{`Show top ${topK} results`}</p>
        </div>
        <Slider
          min={1}
          max={100}
          value={topK}
          onChange={onTopKChange}
          classes={{
            root: classes.customSlider,
            track: classes.track,
            rail: classes.track,
            thumb: classes.thumb,
          }}
        />
      </div>
      <SeperateLine title={`ORIGINAL IMAGE`} style={{ marginBottom: "20px" }} />
      <div className={classes.upload}>
        {image ? (
          <div className={classes.benchImage}>
            <img
              ref={benchImage}
              className={classes.benchImage}
              src={image}
              alt="..."
            />
            <Fab
              color="primary"
              aria-label="add"
              size="small"
              classes={{ root: classes.customDeleteFab }}
            >
              <CloseIcon
                onClick={() => {
                  setImage();
                  setImages([]);
                }}
                classes={{ root: classes.customDelete }}
              />
            </Fab>
          </div>
        ) : (
          <DropzoneArea
            acceptedFiles={["image/*"]}
            filesLimit={1}
            dropzoneText={`click to upload / drag a image here`}
            onDrop={uploadImg}
            dropzoneClass={classes.dropzoneContainer}
            showPreviewsInDropzone={false}
            dropzoneParagraphClass={classes.dropzoneText}
          />
        )}
      </div>
    </div>
  );
};

export default Setting;
