import {
    Button,
    Form,
    Input,
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
    createSlide,
    deleteSlide,
    getAllSlide,
    updateSlide,
} from "../../store/slice/slideSlice";
import TitleSearch from "../../components/TitleSearch";
import { Slider } from "../../interface";

const { Option } = Select;

interface DataType {
    id: number;
    name: string;
    image: string;
}

const Home = () => {
    const { listSlide, loading, loadingApi } = useAppSelector(
        (state) => state.slide
    );
    const { user } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();
    const [listSlideShow, setListSlideShow] = useState<Slider[]>([]);
    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [imgFix, setImgFix] = useState<string>("");
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllSlide());
    }, [reLoad]);

    useEffect(() => {
        setListSlideShow(listSlide);
    }, [listSlide]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };

    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const slide = listSlide.filter((slide) => slide.id === id)[0];
        setImgFix(slide.image);
        form.setFieldsValue({
            name: slide.name,
            id: id,
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteSlide(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListSlideShow(listSlide);
            return;
        }
        const filteredEvents = listSlideShow.filter(({ name }) => {
            name = name.toLowerCase();
            return name.includes(searchText);
        });
        setListSlideShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        console.log(values);

        if (isAddOrFix === true) {
            //  -----------------------????y l?? th??m m???i --------------------------------
            const { name, Image } = values;
            const imageFile = Image[0].originFileObj;
            dispatch(createSlide({ name, imageFile }));
        } else {
            //  -----------------------????y l?? s???a --------------------------------
            const { name, Image, id } = values;
            const imageFile = Image ? Image[0].originFileObj : null;
            dispatch(updateSlide({ id, name, imageFile }));
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
            title: "Ti??u ?????",
            dataIndex: "name",
            key: "name",
            width: 500,
        },
        {
            title: "H??nh bi???u di???n",
            dataIndex: "image",
            width: 200,
            render: (image: string) => (
                <div className="">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`${process.env.HOST_NAME_API}/${image}`}
                        alt="icon"
                    />
                </div>
            ),
        },
    ];
    return (
        <>
            {user ? (
                <div className="w-full">
                    <div className="py-[10px]">
                        <h1>Qu???n l?? danh s??ch Slide</h1>
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
                                label="Ti??u ?????"
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
                            <Form.Item />

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
                        dataSource={listSlideShow}
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
            ) : (
                <></>
            )}
        </>
    );
};

export default Home;
