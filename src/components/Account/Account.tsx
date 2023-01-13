import { useState, useEffect } from "react";
import {
  useUser,
  useSupabaseClient,
  Session,
} from "@supabase/auth-helpers-react";
import Picture from "../Picture/Picture";
import styles from "./Account.module.scss";
import { CollectionNames, Database, ModelNames } from "../../utils/models";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export default function Account({ session }: { session: Session }) {
  const supabase = useSupabaseClient<Database>();
  const user = useUser();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<Profile["username"]>(null);
  const [avatar_url, setAvatarUrl] = useState<Profile["avatar_url"]>(null);

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      let { data, error, status } = await supabase
        .from(ModelNames.PROFILES)
        .select(`username, avatar_url`)
        .eq("id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    avatar_url,
  }: {
    username: Profile["username"];
    avatar_url: Profile["avatar_url"];
  }) {
    try {
      setLoading(true);
      if (!user) throw new Error("No user");

      const updates = {
        id: user.id,
        username,
        avatar_url,
        updated_at: new Date().toISOString(),
      };

      let { error } = await supabase.from(ModelNames.PROFILES).upsert(updates);
      if (error) throw error;
      console.log("Profile updated!");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    user && (
      <div className={styles["form-widget"]}>
        <Picture
          unique_id={user.id}
          url={avatar_url ?? ''}
          size={150}
          onUpload={(url: string) => {
            setAvatarUrl(url);
            updateProfile({ username, avatar_url: url });
          }}
          collectionName={CollectionNames.AVATARS}
          canEdit
        />

        <div className={styles["form-input"]}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="text" value={session.user.email} disabled />
          </div>
          <div>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username || ""}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>

        <div className={styles["form-input"]}>
          <button
            className="button primary block"
            onClick={() => updateProfile({ username, avatar_url })}
            disabled={loading}
          >
            {loading ? "Loading ..." : "Update"}
          </button>
        </div>

        <div className={styles["form-input"]}>
          <button
            className="button block"
            onClick={() => supabase.auth.signOut()}
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  );
}
