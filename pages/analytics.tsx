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
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Database, ModelNames } from "../src/utils/models";
import styles from "../styles/pages.module.scss";
import { formatStringifiedTimestampToDate } from "../src/utils/date";

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
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const [rawData, setRawData] = useState<
    ({
      meal_id: any;
    } & {
      created_at: any;
    })[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [labels, setLabels] = useState<string[]>([]);
  const [dataset, setDataset] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { error, data } = await supabase
        .from(ModelNames.COOKING_EVENTS)
        .select("meal_id, created_at")
        .order("created_at", { ascending: true });
      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }
      setRawData(data);
      setIsLoading(false);
    };

    fetchData();
  }, [supabase]);

  useEffect(() => {
    const dataset = rawData.reduce<Record<string, number>>(
      (accumulator, value) => {
        const formattedDate: string = formatStringifiedTimestampToDate(
          value.created_at
        );
        accumulator[formattedDate] = (accumulator[formattedDate] ?? 0) + 1;
        return accumulator;
      },
      {}
    );
    setDataset(Object.values(dataset));
    setLabels(Object.keys(dataset));
  }, [rawData]);

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
          <span>loading...</span>
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
