import { Button, Form, Input, Modal, Popconfirm, Table, Upload } from "antd";
import { useEffect, useState } from "react";
import { EditFilled, DeleteFilled, PlusCircleFilled } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    createShop,
    deleteShop,
    getAllShop,
    updateShop,
} from "../../store/slice/shopSlice";
import TitleSearch from "../../components/TitleSearch";
import { Shop as ShopInterface } from "../../interface";

interface DataType {
    id: number;
    address: string;
}

const Shop = () => {
    const { listShop, loading, loadingApi } = useAppSelector(
        (state) => state.shop
    );
    const dispatch = useAppDispatch();

    const [listShopShow, setListShopShow] = useState<ShopInterface[]>([]);
    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllShop());
    }, [reLoad]);

    useEffect(() => {
        setListShopShow(listShop);
    }, [listShop]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };
    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const category = listShop.filter((shop) => shop.id === id)[0];
        form.setFieldsValue({
            address: category.address,
            id: id,
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteShop(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListShopShow(listShop);
            return;
        }
        const filteredEvents = listShopShow.filter(({ address }) => {
            address = address.toLowerCase();
            return address.includes(searchText);
        });
        setListShopShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        if (isAddOrFix === true) {
            //  -----------------------????y l?? th??m m???i --------------------------------
            const { address } = values;
            dispatch(createShop({ address }));
        } else {
            //  -----------------------????y l?? s???a --------------------------------
            const { address, id } = values;
            dispatch(updateShop({ id, address }));
        }
    };
    const onSubmitFormFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const normUpdateFile = (e: any) => {
        console.log(e);
        if (Array.isArray(e)) {
            console.log(e);
            return e;
        }
        return e?.fileList;
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
            title: "?????a ch???",
            dataIndex: "address",
            key: "address",
            width: 500,
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Qu???n l?? danh s??ch Shop</h1>
                <div>
                    <Button
                        type="text"
                        size="large"
                        onClick={() => {
                            setReLoad((state) => !state);
                        }}
                    >
                        ReLoad
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
                    placeholder="Search ?????a ch???"
                    userSearch={handleSearchTitle}
                />
            </div>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Modal
                title={`${isAddOrFix ? "Th??m m???i Shop" : "S???a Shop"}`}
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
                        label="?????a ch???"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                    >
                        <Input />
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
                dataSource={listShopShow}
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

export default Shop;
