import { Button, Form, Input, Modal, Popconfirm, Table, Upload } from "antd";
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
    createCategory,
    deleteCategory,
    getAllCategory,
    updateCategory,
} from "../../store/slice/categorySlice";
import TitleSearch from "../../components/TitleSearch";
import { Category as CategoryInterface } from "../../interface";

interface DataType {
    id: number;
    name: string;
    img: string;
}

const Category = () => {
    const { listCategory, loading, loadingApi } = useAppSelector(
        (state) => state.category
    );
    const dispatch = useAppDispatch();
    const [listCategoryShow, setListCategoryShow] = useState<
        CategoryInterface[]
    >([]);
    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [imgFix, setImgFix] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllCategory());
    }, [reLoad]);

    useEffect(() => {
        setListCategoryShow(listCategory);
    }, [listCategory]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };
    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const category = listCategory.filter(
            (category) => category.id === id
        )[0];
        setImgFix(category.img);
        form.setFieldsValue({
            name: category.name,
            id: id,
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteCategory(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListCategoryShow(listCategory);
            return;
        }
        const filteredEvents = listCategoryShow.filter(({ name }) => {
            name = name.toLowerCase();
            return name.includes(searchText);
        });
        setListCategoryShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        if (isAddOrFix === true) {
            //  -----------------------????y l?? th??m m???i --------------------------------
            const { name, Image } = values;
            const imageFile = Image[0].originFileObj;
            dispatch(createCategory({ name, imageFile }));
        } else {
            //  -----------------------????y l?? s???a --------------------------------
            const { name, Image, id } = values;
            const imageFile = Image ? Image[0].originFileObj : null;
            dispatch(updateCategory({ id, name, imageFile }));
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
            width: 500,
        },
        {
            title: "H??nh bi???u di???n",
            dataIndex: "img",
            width: 200,
            render: (img: string) => (
                <div className="">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`${process.env.HOST_NAME_API}/${img}`}
                        alt="icon"
                    />
                </div>
            ),
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Qu???n l?? danh s??ch Category</h1>
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
                    placeholder="Search Title"
                    userSearch={handleSearchTitle}
                />
            </div>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Modal
                title={`${isAddOrFix ? "Th??m m???i Category" : "S???a Category"}`}
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
                        label="T??n category"
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
                dataSource={listCategoryShow}
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

export default Category;
