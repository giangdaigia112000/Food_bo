import {
    Button,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Table,
    Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
    EditFilled,
    DeleteFilled,
    PlusCircleFilled,
    UploadOutlined,
} from "@ant-design/icons";
import {
    FcInTransit,
    FcCustomerSupport,
    FcPaid,
    FcHighPriority,
    FcDisapprove,
} from "react-icons/fc";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { getAllOrder, updateOrder } from "../../store/slice/orderSlice";
import TitleSearch from "../../components/TitleSearch";
import { Order, Voucher } from "../../interface";
import moment from "moment";
import { getAllShop } from "../../store/slice/shopSlice";
import OptionSearch from "../../components/OptionSearch";
import { notiWarning } from "../../utils/notification";

const { Option } = Select;

interface DataType {
    id: number;
    shop_id: number;
    name: string;
    phone: string;
    address: string;
    totalprice: number;
    status: number;
    message: string;
    created_at: string;
    updated_at: string;
    code: string;
}

const Liststatus = [
    {
        id: 0,
        title: "Chờ xác nhận.",
        icon: <FcCustomerSupport className="text-2xl" />,
    },
    {
        id: 1,
        title: "Đang chuẩn bị món.",
        icon: <FcCustomerSupport className="text-2xl" />,
    },
    {
        id: 2,
        title: "Đang giao hàng.",
        icon: <FcInTransit className="text-2xl" />,
    },
    {
        id: 3,
        title: "Giao hàng thành công.",
        icon: <FcPaid className="text-2xl" />,
    },
    {
        id: 4,
        title: "Đơn hàng bị hủy.",
        icon: <FcHighPriority className="text-2xl" />,
    },
    {
        id: 5,
        title: "Giao hàng thất bại.",
        icon: <FcDisapprove className="text-2xl" />,
    },
];

const ListstatusChange = [
    {
        id: 1,
        title: "Đang chuẩn bị món.",
        icon: <FcCustomerSupport className="text-2xl" />,
    },
    {
        id: 2,
        title: "Đang giao hàng.",
        icon: <FcInTransit className="text-2xl" />,
    },
    {
        id: 3,
        title: "Giao hàng thành công.",
        icon: <FcPaid className="text-2xl" />,
    },
    {
        id: 5,
        title: "Giao hàng thất bại.",
        icon: <FcDisapprove className="text-2xl" />,
    },
];
const OrderPage = () => {
    const { listOrder, loading, loadingUpdateOrder } = useAppSelector(
        (state) => state.oder
    );
    const { listShop } = useAppSelector((state) => state.shop);
    const dispatch = useAppDispatch();
    const [listOrderShow, setListOrderShow] = useState<Order[]>([]);
    const [orderShow, setOrderShow] = useState<Order>();
    const [typeSelect, setTypeSelect] = useState<number | null>(null);

    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllOrder());
        if (listShop.length === 0) {
            dispatch(getAllShop());
        }
    }, [reLoad]);

    useEffect(() => {
        setListOrderShow(listOrder);
    }, [listOrder]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };

    const handleRepair = (id: number) => {
        setIsOpenModal(true);
        const order = listOrder.filter((order) => order.id === id)[0];
        setOrderShow(order);
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListOrderShow(listOrder);
            return;
        }
        const filteredEvents = listOrderShow.filter(({ name }) => {
            name = name.toLowerCase();
            return name.includes(searchText);
        });
        setListOrderShow(filteredEvents);
    };

    const handleSearchOption = (value: any) => {
        if (!value) {
            setListOrderShow(listOrder);
            return;
        }
        const filterValua = value ? value : "";
        const filteredEvents = listOrderShow.filter(
            (order) => order.shop_id === filterValua
        );
        setListOrderShow(filteredEvents);
    };

    const handleSearchStatus = (value: any) => {
        if (!value) {
            setListOrderShow(listOrder);
            return;
        }
        const filterValua = value ? value : "";
        const filteredEvents = listOrderShow.filter(
            (order) => order.status === filterValua
        );
        setListOrderShow(filteredEvents);
    };

    const onSubmitForm = async () => {
        if (!typeSelect) {
            notiWarning("Vui lòng chọn trạng thái.");
            return;
        }
        if (!orderShow) return;
        dispatch(
            updateOrder({
                id: orderShow.id,
                status: typeSelect,
            })
        );
    };

    const columns: ColumnsType<DataType> = [
        {
            title: "Hành động",
            dataIndex: "id",
            width: 100,
            render: (id: number) => (
                <div key={id} className="flex gap-2">
                    <Button
                        type="primary"
                        icon={<EditFilled />}
                        onClick={() => handleRepair(id)}
                    />
                </div>
            ),
        },
        {
            title: " Mã đơn hàng",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: (status: number) => (
                <div key={status} className="flex gap-2">
                    <span className="text-2xl">{Liststatus[status].icon}</span>
                    <span className="font-semibold ">
                        {Liststatus[status].title}
                    </span>
                </div>
            ),
        },
        {
            title: "Chi nhánh",
            dataIndex: "shop_id",
            render: (shop_id: number) => (
                <span key={shop_id}>
                    {listShop.length > 0 &&
                        listShop.filter((shop) => shop.id === shop_id).length >
                            0 &&
                        listShop.filter((shop) => shop.id === shop_id)[0]
                            .address}
                </span>
            ),
        },

        {
            title: "Tên khách",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Số điện thoại",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalprice",
            render: (totalprice: number) => (
                <span key={totalprice}>{totalprice} vnđ</span>
            ),
        },
        {
            title: "Ngày tạo",
            dataIndex: "created_at",
            render: (created_at: string) => (
                <span key={created_at}>
                    {moment(created_at).locale("vi").format("L,h:mm a")}
                </span>
            ),
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Quản lý danh sách Đơn hàng</h1>
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

            {/* --------------------------------------------Filter--------------------------------------------------- */}
            <div className="w-full flex justify-end py-[10px]">
                <OptionSearch
                    placeholder="Trạng thái đơn"
                    optionSearch={handleSearchStatus}
                    listOption={Liststatus.map((status) => {
                        return {
                            value: status.id,
                            title: status.title,
                        };
                    })}
                />
                <OptionSearch
                    placeholder="Chi nhánh"
                    optionSearch={handleSearchOption}
                    listOption={listShop.map((shop) => {
                        return {
                            value: shop.id,
                            title: shop.address,
                        };
                    })}
                />
                <TitleSearch
                    placeholder="Tìm thêm tên khách"
                    userSearch={handleSearchTitle}
                />
            </div>
            {/* --------------------------------------------Modal--------------------------------------------------- */}
            <Modal
                title="Chi tiết đơn hàng."
                centered
                visible={isOpenModal}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="back" onClick={handleCancelModal}>
                        Cancel
                    </Button>,
                    <Button
                        type="primary"
                        key="submit"
                        disabled={
                            orderShow &&
                            orderShow.status !== 3 &&
                            orderShow.status !== 4 &&
                            orderShow.status !== 5
                                ? false
                                : true
                        }
                        loading={loadingUpdateOrder}
                        onClick={onSubmitForm}
                    >
                        Chuyển trạng thái đơn
                    </Button>,
                ]}
            >
                {orderShow && (
                    <div className="w-full">
                        {orderShow.status !== 3 &&
                            orderShow.status !== 4 &&
                            orderShow.status !== 5 && (
                                <div className="w-full p-[5px] flex justify-end">
                                    <Select
                                        placeholder="Chuyển đổi trạng thái"
                                        onChange={(value: any) => {
                                            setTypeSelect(value);
                                        }}
                                        allowClear
                                    >
                                        {ListstatusChange.map((option) => {
                                            if (
                                                option.id !== orderShow.status
                                            ) {
                                                return (
                                                    <Option
                                                        key={option.id}
                                                        value={option.id}
                                                    >
                                                        {option.title}
                                                    </Option>
                                                );
                                            }
                                        })}
                                    </Select>
                                </div>
                            )}

                        <div className="w-full p-[5px] flex items-center uppercase mb-[20px]">
                            <span className="text-2xl">
                                {Liststatus[orderShow.status].icon}
                            </span>
                            <span className="font-semibold ">
                                {Liststatus[orderShow.status].title}
                            </span>
                        </div>
                        <div className="w-full mb-[20px]">
                            {orderShow.order_items.map((item) => (
                                <div
                                    key={item.id}
                                    className="w-full p-[5px] flex items-center relative border-b-[1px] border-[#d1d1d1]	"
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        className="h-[30px] w-[30px] laptop:w-[60px] laptop:h-[60px] object-cover"
                                        src={
                                            process.env.HOST_NAME_API +
                                            "/" +
                                            item.products.thumb
                                        }
                                        alt="food"
                                    />
                                    <div className="pl-[10px]">
                                        <div className="flex items-center">
                                            <h1 className="text-xs laptop:text-base pr-[10px] font-semibold uppercase">
                                                {item.products.name}
                                            </h1>
                                            <span className="pr-[10px] text-sm">
                                                ---
                                            </span>
                                            <span className="font-semibold text-sm laptop:text-base text-[#b11c1c]">
                                                {item.product_options.op}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="font-semibold text-sm laptop:text-base text-[#b11c1c]">
                                                {item.quantity}
                                            </span>
                                            <span className="px-[5px] text-sm">
                                                x
                                            </span>
                                            <span className="font-semibold text-sm laptop:text-base text-[#b11c1c]">
                                                {item.product_options.price}
                                            </span>
                                            <span className="px-[2px] text-sm">
                                                đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="w-full ">
                            {orderShow.code && (
                                <span className="text-[#ca1d1d] uppercase text-xs laptop:text-sm border-r-[1px] border-[#ca1d1dbd] pr-[10px] block">
                                    Mã Khuyến mãi:{" "}
                                    <span className="font-semibold text-base">
                                        {orderShow.code}
                                    </span>
                                </span>
                            )}
                            <span className="text-[#ca1d1d] uppercase text-xs laptop:text-sm border-r-[1px] border-[#ca1d1dbd] pr-[10px] block">
                                Mã đơn hàng:{" "}
                                <span className="font-semibold text-base">
                                    {orderShow.id}
                                </span>
                            </span>
                            <span className="text-[#ca1d1d] uppercase text-xs laptop:text-sm  border-r-[1px] border-[#ca1d1dbd] pr-[10px]  block">
                                Thời gian:{" "}
                                <span className="font-semibold text-base">
                                    {moment(orderShow.created_at)
                                        .locale("vi")
                                        .format("L,h:mm a")}
                                </span>
                            </span>
                            <span className="text-[#ca1d1d] uppercase text-xs laptop:text-sm  block">
                                Tổng tiền:
                                <span className="font-semibold text-base">
                                    {orderShow.totalprice}.đ
                                </span>
                            </span>
                        </div>
                    </div>
                )}
            </Modal>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Table
                columns={columns}
                dataSource={listOrderShow}
                pagination={{
                    defaultPageSize: 8,
                    showSizeChanger: true,
                    pageSizeOptions: ["8", "20", "30"],
                }}
                tableLayout={"auto"}
                scroll={{ x: 900 }}
                loading={loading}
                rowKey="id"
            />
        </div>
    );
};

export default OrderPage;
