import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState, useContext } from "react";
import { Bar } from "react-chartjs-2";
import styles from "../styles/pages.module.scss";
import { formatStringifiedTimestampToDate } from "../src/utils/date";
import { databaseId } from "../src/utils/constants";
import { CollectionNames } from "../src/utils/models";
import { AppWriteClientContext } from "../src/contexts/AppWriteClientContext/AppWriteClientContext";
import { Databases, ID, Models, Query } from "appwrite";
import { CookingEvent } from "../src/types/meals";
import { CircularProgress } from "@mui/material";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Meals Cooked",
    },
  },
};

const Analytics = () => {
  const { client, session } = useContext(AppWriteClientContext);
  const [rawData, setRawData] = useState<CookingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataset, setDataset] = useState<number[]>([]);

  useEffect(() => {
    if (!client || !session) return;
    fetchData();
  }, [client, session]);

  useEffect(() => {
    const dataset = rawData.reduce<Record<string, number>>(
      (accumulator, value) => {
        const formattedDate: string = formatStringifiedTimestampToDate(
          value.$createdAt
        );
        accumulator[formattedDate] = (accumulator[formattedDate] ?? 0) + 1;
        return accumulator;
      },
      {}
    );
    setDataset(Object.values(dataset));
    setLabels(Object.keys(dataset));
  }, [rawData]);

  if (!client || !session) {
    return null;
  }

  const databases = new Databases(client);
  const userId = session?.userId;

  async function fetchData() {
    setIsLoading(true);
    try {
      const { total, documents } = await databases.listDocuments(
        databaseId,
        CollectionNames.COOKING_EVENTS,
        [
          Query.equal("createdBy", [userId]),
          Query.orderAsc("cookingDate"),
          Query.equal("isDeleted", [false]),
        ]
      );
      if (documents) {
        setRawData(documents as CookingEvent[]);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }

  const data = {
    labels,
    datasets: [
      {
        label: "Meals Cooked",
        data: dataset,
        color: "#2c3639",
        backgroundColor: ["rgba(63, 78, 79, 0.8)", "rgba(44, 54, 57, 0.9)"],
      },
    ],
  };

  return (
    session && (
      <div className={styles.container}>
        {isLoading ? (
          <div className={styles.loader}>
            <CircularProgress />
          </div>
        ) : (
          <div className={styles["analytics-chart"]}>
            <Bar height={"90%"} options={options} data={data} />
          </div>
        )}
      </div>
    )
  );
};

export default Analytics;
