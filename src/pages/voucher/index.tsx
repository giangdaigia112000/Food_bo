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
import { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    createVoucher,
    deleteVoucher,
    getAllVoucher,
    updateVoucher,
} from "../../store/slice/voucherSlice";
import TitleSearch from "../../components/TitleSearch";
import { Voucher } from "../../interface";
import moment from "moment";

const { Option } = Select;

interface DataType {
    id: number;
    code: string;
    discount: number;
    type: string;
    start: string;
    end: string;
}

const listType = [
    { value: "%", name: "%" },
    { value: "vnd", name: "vnd" },
];
const VoucherPage = () => {
    const { listVoucher, loading, loadingApi } = useAppSelector(
        (state) => state.voucher
    );
    const dispatch = useAppDispatch();
    const [listVoucherShow, setListVoucherShow] = useState<Voucher[]>([]);
    const [typeSelect, setTypeSelect] = useState<string | null>(null);

    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllVoucher());
    }, [reLoad]);

    useEffect(() => {
        setListVoucherShow(listVoucher);
    }, [listVoucher]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };

    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const voucher = listVoucher.filter((voucher) => voucher.id === id)[0];
        form.setFieldsValue({
            code: voucher.code,
            discount: voucher.discount,
            type: voucher.type,
            start: moment(voucher.start),
            end: moment(voucher.end),
            id: id,
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteVoucher(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListVoucherShow(listVoucher);
            return;
        }
        const filteredEvents = listVoucherShow.filter(({ code }) => {
            code = code.toLowerCase();
            return code.includes(searchText);
        });
        setListVoucherShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        console.log(moment(values.start).format("YYYY-MM-DD"));

        if (isAddOrFix === true) {
            //  -----------------------Đây là thêm mới --------------------------------
            const { code, discount, type, start, end } = values;
            dispatch(
                createVoucher({
                    code,
                    discount,
                    type,
                    start: moment(values.start).format("YYYY-MM-DD"),
                    end: moment(values.end).format("YYYY-MM-DD"),
                })
            );
        } else {
            //  -----------------------Đây là sửa --------------------------------
            const { id, code, discount, type, start, end } = values;

            dispatch(
                updateVoucher({
                    id,
                    code,
                    discount,
                    type,
                    start: moment(values.start).format("YYYY-MM-DD"),
                    end: moment(values.end).format("YYYY-MM-DD"),
                })
            );
        }
    };
    const onSubmitFormFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
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

                    <Popconfirm
                        placement="top"
                        title="Bạn muốn xóa bản ghi này?"
                        onConfirm={() => handleDelete(id)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ loading: false }}
                    >
                        <Button type="primary" icon={<DeleteFilled />} danger />
                    </Popconfirm>
                </div>
            ),
        },
        {
            title: "Mã giảm giá",
            dataIndex: "code",
            key: "name",
            width: 500,
        },
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
        },
        {
            title: "Loại",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Ngày bắt đầu",
            dataIndex: "start",
            key: "start",
        },
        {
            title: "Ngày kết thúc",
            dataIndex: "end",
            key: "end",
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Quản lý danh sách Khuyến mãi</h1>
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
                    <Button
                        type="primary"
                        size="large"
                        onClick={() => {
                            setIsOpenModal(true);
                            setIsAddOrFix(true);
                            form.resetFields();
                        }}
                    >
                        <div className="flex justify-center items-center gap-2">
                            <PlusCircleFilled />
                            Thêm bản ghi
                        </div>
                    </Button>
                </div>
            </div>

            {/* --------------------------------------------Filter--------------------------------------------------- */}
            <div className="w-full flex justify-end py-[10px]">
                <TitleSearch
                    placeholder="Search Title"
                    userSearch={handleSearchTitle}
                />
            </div>
            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Modal
                title={`${isAddOrFix ? "Thêm mới Slide" : "Sửa Slide"}`}
                visible={isOpenModal}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="back" onClick={handleCancelModal}>
                        Cancel
                    </Button>,
                ]}
            >
                <Form
                    name="basic"
                    form={form}
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={onSubmitForm}
                    onFinishFailed={onSubmitFormFailed}
                    autoComplete="off"
                >
                    {!isAddOrFix && (
                        <Form.Item
                            label="Id"
                            name="id"
                            rules={[
                                {
                                    required: true,
                                    message: "Không bỏ trống!!!",
                                },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Mã giảm giá"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: "Không bỏ trống!!!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Loại giảm giá"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: "Không bỏ trống!!!",
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            onChange={(value) => {
                                setTypeSelect(value);
                            }}
                        >
                            {listType.map((role) => (
                                <Option key={role.value} value={role.value}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Discount"
                        name="discount"
                        rules={[
                            {
                                required: true,
                                message: "Không bỏ trống!!!",
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={typeSelect === "%" ? 100 : 1000000000000000}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ngày bắt đầu"
                        name="start"
                        rules={[
                            {
                                required: true,
                                message: "Không bỏ trống!!!",
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        label="Ngày kết thúc"
                        name="end"
                        rules={[
                            {
                                required: true,
                                message: "Không bỏ trống!!!",
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loadingApi}
                        >
                            {`${isAddOrFix ? "Thêm mới" : "Sửa"}`}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Table
                columns={columns}
                dataSource={listVoucherShow}
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

export default VoucherPage;
