import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect, useState } from "react";
import { CollectionNames, Database } from "../utils/models";

export const useResolveImageUrl = (
  collectionName: CollectionNames,
  path: string
) => {
  const [imageUrl, setImageUrl] = useState<string>();
  const [error, setError] = useState<Error>();
  const [isLoading, setIsLoading] = useState(true);
  const supabase = useSupabaseClient<Database>();

  useEffect(() => {
    async function fetchImage() {
      const { data, error } = await supabase.storage
        .from(collectionName)
        .download(path);
      if (!data || error) {
        setError(error ?? new Error("No data"));
      } else {
        setImageUrl(URL.createObjectURL(data));
      }
      setIsLoading(false);
    }
    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName, path]);

  return { imageUrl, isLoading, error };
};
