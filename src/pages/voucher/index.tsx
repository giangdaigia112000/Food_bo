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
            //  -----------------------????y l?? th??m m???i --------------------------------
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
            //  -----------------------????y l?? s???a --------------------------------
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
            title: "H??nh ?????ng",
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
                        title="B???n mu???n x??a b???n ghi n??y?"
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
            title: "M?? gi???m gi??",
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
            title: "Lo???i",
            dataIndex: "type",
            key: "type",
        },
        {
            title: "Ng??y b???t ?????u",
            dataIndex: "start",
            key: "start",
        },
        {
            title: "Ng??y k???t th??c",
            dataIndex: "end",
            key: "end",
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Qu???n l?? danh s??ch Khuy???n m??i</h1>
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
                            Th??m b???n ghi
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
                title={`${isAddOrFix ? "Th??m m???i Slide" : "S???a Slide"}`}
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
                                    message: "Kh??ng b??? tr???ng!!!",
                                },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="M?? gi???m gi??"
                        name="code"
                        rules={[
                            {
                                required: true,
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Lo???i gi???m gi??"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: "Kh??ng b??? tr???ng!!!",
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
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            max={typeSelect === "%" ? 100 : 1000000000000000}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Ng??y b???t ?????u"
                        name="start"
                        rules={[
                            {
                                required: true,
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        label="Ng??y k???t th??c"
                        name="end"
                        rules={[
                            {
                                required: true,
                                message: "Kh??ng b??? tr???ng!!!",
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
                            {`${isAddOrFix ? "Th??m m???i" : "S???a"}`}
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
