import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { Button, Fade, TextField } from "@mui/material";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useState } from "react";
import { CollectionNames, Database } from "../../utils/models";
import styles from "./Picture.module.scss";

export default function Picture({
  unique_id: uid,
  collectionName,
  onUpload,
  canEdit = false,
}: {
  unique_id?: string;

  collectionName: CollectionNames;
  onUpload?: (url: string) => void;
  canEdit?: boolean;
}) {
  const supabase = useSupabaseClient<Database>();
  const [pictureUrl, setPictureUrl] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);
  const [isFromUrl, setIsFromUrl] = useState(false);

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

      let { error: uploadError } = await supabase.storage
        .from(collectionName)
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }
      const { data } = supabase.storage
        .from(collectionName)
        .getPublicUrl(filePath);

      onUpload?.(data.publicUrl);
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
