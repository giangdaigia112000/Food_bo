import {
    Button,
    Checkbox,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Table,
    Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
    EditFilled,
    DeleteFilled,
    PlusCircleFilled,
    UploadOutlined,
    MinusCircleOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import TextArea from "antd/lib/input/TextArea";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    createProduct,
    deleteProduct,
    getAllProduct,
    updateProduct,
} from "../../store/slice/productSlice";
import { getAllCategory } from "../../store/slice/categorySlice";
import OptionSearch from "../../components/OptionSearch";
import TitleSearch from "../../components/TitleSearch";
import { Product } from "../../interface";

const { Option } = Select;
interface DataType {
    id: number;
    name: string;
    thumb: string;
    category_id: number;
    description: string;
}

const ProductPage = () => {
    const { listProduct, loading, loadingApi } = useAppSelector(
        (state) => state.product
    );
    const { listCategory } = useAppSelector((state) => state.category);
    const dispatch = useAppDispatch();
    const [listProductShow, setListProductShow] = useState<Product[]>([]);

    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [imgFix, setImgFix] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        if (listCategory.length === 0) {
            dispatch(getAllCategory());
        }
        dispatch(getAllProduct());
    }, [reLoad]);

    useEffect(() => {
        setListProductShow(listProduct);
    }, [listProduct]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };
    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const product = listProduct.filter((product) => product.id === id)[0];
        setImgFix(product.thumb);
        form.setFieldsValue({
            name: product.name,
            id: id,
            category_id: product.category_id,
            description: product.description,
            sale: product.sale,
            options: product.options.size.map((op) => {
                return {
                    op: op.op,
                    price: op.price,
                };
            }),
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteProduct(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListProductShow(listProduct);
            return;
        }
        const filteredEvents = listProductShow.filter(({ name }) => {
            name = name.toLowerCase();
            return name.includes(searchText);
        });
        setListProductShow(filteredEvents);
    };

    const handleSearchOption = (value: any) => {
        if (!value) {
            setListProductShow(listProduct);
            return;
        }
        const filterValua = value ? value : "";
        const filteredEvents = listProductShow.filter(
            (product) => product.category_id === filterValua
        );
        setListProductShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        console.log(values);
        // --------------------------Th??m b???n ghi-------------------------------
        if (isAddOrFix === true) {
            const { name, Image, description, category_id, options, sale } =
                values;
            const imageFile = Image[0].originFileObj;
            dispatch(
                createProduct({
                    name,
                    imageFile,
                    description,
                    category_id,
                    options,
                    sale,
                })
            );
        } else {
            // --------------------------S???a b???n ghi------------------------------
            const { id, name, Image, description, category_id, options, sale } =
                values;
            const imageFile = Image ? Image[0].originFileObj : null;
            dispatch(
                updateProduct({
                    id,
                    name,
                    imageFile,
                    description,
                    category_id,
                    options,
                    sale,
                })
            );
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
            title: "T??n",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Th??? lo???i",
            dataIndex: "category_id",
            filters: listCategory.map((cate) => {
                return {
                    text: cate.name,
                    value: cate.name,
                };
            }),

            render: (category_id: number) => (
                <span>
                    {(listCategory.length > 0 &&
                        listCategory.filter(
                            (cate) => cate.id === category_id
                        )[0]?.name) ||
                        ""}
                </span>
            ),
        },
        {
            title: "M?? t???",
            dataIndex: "description",
            key: "description",
        },
        {
            title: "H??nh thumb",
            dataIndex: "thumb",
            width: 400,
            render: (thumb: string) => (
                <div className="">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        className="max-w-[200px] max-h-[300px] object-cover"
                        src={`${process.env.HOST_NAME_API}/${thumb}`}
                        alt="icon"
                    />
                </div>
            ),
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Qu???n l?? danh s??ch S???n ph???m</h1>
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
                <OptionSearch
                    placeholder="Lo???i"
                    optionSearch={handleSearchOption}
                    listOption={listCategory.map((cate) => {
                        return {
                            value: cate.id,
                            title: cate.name,
                        };
                    })}
                />
                <TitleSearch
                    placeholder="Search Name"
                    userSearch={handleSearchTitle}
                />
            </div>

            {/* --------------------------Modal------------------------------------ */}
            <Modal
                title={`${isAddOrFix ? "Th??m m???i Product" : "S???a Product"}`}
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
                        label="T??n s???n ph???m"
                        name="name"
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
                        label="M?? t???"
                        name="description"
                        rules={[
                            {
                                required: true,
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item
                        name="Image"
                        label="Thumb"
                        valuePropName="image"
                        rules={[
                            {
                                required: isAddOrFix,
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                        getValueFromEvent={normUpdateFile}
                    >
                        <Upload
                            maxCount={1}
                            listType="picture"
                            multiple={false}
                            beforeUpload={() => {
                                return false;
                            }}
                            withCredentials={false}
                            showUploadList={true}
                            accept="image/png, image/jpeg"
                        >
                            <Button icon={<UploadOutlined />}>
                                Ch???n h??nh ???nh
                            </Button>
                        </Upload>
                    </Form.Item>
                    {!isAddOrFix && (
                        <div className="w-full flex justify-center">
                            {/*  eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className="max-w-[200px] p-[10px]"
                                src={`${process.env.HOST_NAME_API}/${imgFix}`}
                                alt="img"
                            />
                        </div>
                    )}
                    <Form.Item
                        name="category_id"
                        label="Category"
                        rules={[
                            { required: true, message: "Kh??ng b??? tr???ng!!!" },
                        ]}
                    >
                        <Select placeholder="Category" allowClear>
                            {listCategory.length > 0 &&
                                listCategory.map((cate) => (
                                    <Option key={cate.id} value={cate.id}>
                                        {cate.name}
                                    </Option>
                                ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Option"
                        rules={[
                            ({ getFieldValue }) => ({
                                validator: async (rule, value) => {
                                    console.log(getFieldValue("imageFile"));
                                    if (
                                        getFieldValue("options") &&
                                        getFieldValue("options").length
                                    ) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject("Please add Option");
                                },
                            }),
                        ]}
                    >
                        <Form.List name="options">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map(
                                        (
                                            { key, name, ...restField },
                                            index
                                        ) => (
                                            <Space
                                                key={key}
                                                style={{
                                                    display: "flex",
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Form.Item
                                                    {...restField}
                                                    label={
                                                        "Option " +
                                                        `${index + 1}`
                                                    }
                                                    name={[name, "op"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui l??ng kh??ng b??? tr???ng!",
                                                        },
                                                    ]}
                                                >
                                                    <Input
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    label={"gi??"}
                                                    name={[name, "price"]}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui l??ng kh??ng b??? tr???ng!",
                                                        },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        size="middle"
                                                        min={1}
                                                        max={1_000_000_000}
                                                        style={{
                                                            width: "100%",
                                                        }}
                                                    />
                                                </Form.Item>
                                                {fields.length > 1 ? (
                                                    <MinusCircleOutlined
                                                        className="dynamic-delete-button"
                                                        onClick={() =>
                                                            remove(name)
                                                        }
                                                    />
                                                ) : null}
                                            </Space>
                                        )
                                    )}

                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => add()}
                                            block
                                            icon={<PlusOutlined />}
                                        >
                                            Th??m
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                        <Form.Item name="sale" valuePropName="checked">
                            <Checkbox>S???n ph???m khuy???n m??i</Checkbox>
                        </Form.Item>
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

            {/* --------------------------Modal------------------------------------ */}

            <Table
                columns={columns}
                dataSource={listProductShow}
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

export default ProductPage;
