import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import styles from "./Picture.module.scss";
import { CollectionNames, Database } from "../../utils/models";

export default function Picture({
  unique_id: uid,
  url,
  size,
  collectionName,
  onUpload,
  canEdit = false,
}: {
  unique_id?: string;
  url: string;
  size: number;
  collectionName: CollectionNames;
  onUpload?: (url: string) => void;
  canEdit?: boolean;
}) {
  const supabase = useSupabaseClient<Database>();
  const [pictureUrl, setPictureUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from(collectionName)
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setPictureUrl(url);
    } catch (error) {
      console.log("Error downloading image: ", error);
    }
  }

  const uploadPicture: React.ChangeEventHandler<HTMLInputElement> = async (
    event
  ) => {
    try {
      setUploading(true);

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

      onUpload?.(filePath);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles["picture-wrapper"]}>
      {pictureUrl ? (
        <img
          src={pictureUrl}
          alt="Picture"
          style={{ height: size, width: size }}
        />
      ) : (
        <div style={{ height: size, width: size }} />
      )}
      {canEdit && (
        <div className={styles["upload-input"]}>
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading ..." : "Upload"}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "absolute",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadPicture}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
