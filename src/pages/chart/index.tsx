import { Button } from "antd";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllChart } from "../../store/slice/chartSlice";
import Loading from "../../components/Loading";
import OptionSearch from "../../components/OptionSearch";

const listColor = ["green", "blue", "red", "gray", "yellow"];
const listMonth = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const ChartPage = () => {
    const { allChart, loading } = useAppSelector((state) => state.chart);
    const dispatch = useAppDispatch();
    const [reLoad, setReLoad] = useState<boolean>(false);
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

    useEffect(() => {
        dispatch(getAllChart(month));
    }, [reLoad, month]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "Biểu đồ doanh thu theo tháng",
            },
        },
    };

    const data = {
        labels: allChart ? Object.keys(allChart?.total) : [],
        datasets:
            allChart && allChart?.shop.length > 0
                ? allChart?.shop.map((shop, idx) => {
                      return {
                          id: idx,
                          label: shop.address,
                          data: shop.month,
                          borderColor: listColor[idx],
                          backgroundColor: "rgba(255, 255, 255, 0.5)",
                      };
                  })
                : [],
    };

    const handleSearchOption = (value: any) => {
        if (!value) {
            setMonth(new Date().getMonth() + 1);
            return;
        }
        setMonth(value);
    };

    return (
        <div className="w-full">
            {loading && <Loading />}
            <div className="py-[10px]">
                <h1>Biểu đồ thống kê</h1>
                <div>
                    <Button
                        type="text"
                        size="large"
                        onClick={() => {
                            setReLoad((state) => !state);
                        }}
                    >
                        Reload
                    </Button>
                </div>
            </div>
            <div className="w-full flex justify-end py-[10px]">
                <OptionSearch
                    placeholder="Theo tháng"
                    optionSearch={handleSearchOption}
                    listOption={listMonth.map((month) => {
                        return {
                            value: month,
                            title: month.toString(),
                        };
                    })}
                />
            </div>
            <div className="w-full h-[700px]">
                <Line datasetIdKey="id" options={options} data={data} />;
            </div>
        </div>
    );
};

export default ChartPage;
