import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Button, Fade, TextField } from "@mui/material";
import React, { useState, useContext } from "react";
import { AppWriteClientContext } from "../../contexts/AppWriteClientContext/AppWriteClientContext";

import { Database, BucketNames } from "../../utils/models";
import { Storage, ID } from "appwrite";

import styles from "./Picture.module.scss";

export default function Picture({
  unique_id: uid,
  bucketName,
  onUpload,
  canEdit = false,
}: {
  unique_id?: string;

  bucketName: BucketNames;
  onUpload?: (url: string) => void;
  canEdit?: boolean;
}) {
  const { client } = useContext(AppWriteClientContext);
  const [pictureUrl, setPictureUrl] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [isFromUrl, setIsFromUrl] = useState(false);

  if (!client) {
    return null;
  }
  const storage = new Storage(client);

  const urlInput = (
    <TextField
      variant="standard"
      color="primary"
      value={pictureUrl}
      className={styles["image-url-input"]}
      hiddenLabel
      onChange={(event) => {
        setPictureUrl(event.target.value);
        onUpload?.(event.target.value);
      }}
    />
  );

  const uploadPicture: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setIsUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      const createdFile = await storage.createFile(
        bucketName,
        ID.unique(),
        file
      );
      const resourceUrl = storage.getFileView(bucketName, createdFile.$id);
      onUpload?.(resourceUrl.toString());
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles["picture-wrapper"]}>
      {canEdit && (
        <>
          <Button
            variant="contained"
            component="label"
            className={styles["edit-img-button"]}
            disabled={isFromUrl}
          >
            <FileUploadOutlinedIcon className={styles["edit-icon"]} />
            <input
              type="file"
              hidden
              id="upload-image"
              onChange={uploadPicture}
              disabled={isUploading}
              accept="image/*"
            />
          </Button>
          <Button
            onClick={() => {
              setIsFromUrl(!isFromUrl);
            }}
            variant="contained"
            className={styles["edit-img-button"]}
          >
            <LinkOutlinedIcon className={styles["edit-icon"]} />
          </Button>
          <Fade in={isFromUrl}>{urlInput}</Fade>
        </>
      )}
    </div>
  );
}
