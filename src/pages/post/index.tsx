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
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import {
    EditFilled,
    DeleteFilled,
    PlusCircleFilled,
    UploadOutlined,
} from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import TextArea from "antd/lib/input/TextArea";

import "react-quill/dist/quill.snow.css";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    createBlog,
    deleteBlog,
    getAllBlog,
    updateBlog,
} from "../../store/slice/blogSlice";
import OptionSearch from "../../components/OptionSearch";
import TitleSearch from "../../components/TitleSearch";
import { Blog } from "../../interface";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const { Option } = Select;
const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        [{ align: ["", "center", "right", "justify"] }],
        [
            "link",
            "image",
            {
                color: [
                    "#000000d9",
                    "#fff",
                    "red",
                    "#ff4d4f",
                    "#ee5c12",
                    "blue",
                    "#52c41a",
                    "#40a9ff",
                    "yellow",
                ],
            },
            {
                background: [
                    "",
                    "#000000d9",
                    "#fff",
                    "red",
                    "#ff4d4f",
                    "#ee5c12",
                    "blue",
                    "#52c41a",
                    "#40a9ff",
                    "yellow",
                ],
            },
        ],
        ["clean"],
    ],
};
const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "align",
    "background",
];
interface DataType {
    id: number;
    title: string;
    thumb: string;
    desc: string;
    type: number;
}

const listOption = [
    {
        value: 0,
        name: "B??i vi???t blog",
    },
    {
        value: 1,
        name: "Khuy???n m??i",
    },
];
const Post = () => {
    const { listBlog, loading, loadingApi } = useAppSelector(
        (state) => state.blog
    );
    console.log(listBlog);

    const dispatch = useAppDispatch();

    const [listBlogShow, setListBlogShow] = useState<Blog[]>([]);

    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [imgFix, setImgFix] = useState<string>("");
    const [form] = Form.useForm();
    useEffect(() => {
        dispatch(getAllBlog());
    }, [reLoad]);

    useEffect(() => {
        setListBlogShow(listBlog);
    }, [listBlog]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };
    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const blog = listBlog.filter((blog) => blog.id === id)[0];
        setImgFix(blog.thumb);
        form.setFieldsValue({
            title: blog.title,
            desc: blog.desc,
            id: id,
            content: blog.content,
            type: blog.type,
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteBlog(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListBlogShow(listBlog);
            return;
        }
        const filteredEvents = listBlogShow.filter(({ title }) => {
            title = title.toLowerCase();
            return title.includes(searchText);
        });
        setListBlogShow(filteredEvents);
    };

    const handleSearchOption = (value: any) => {
        if (!value && value !== 0) {
            setListBlogShow(listBlog);
            return;
        }
        const filterValua = value ? value : "";
        const filteredEvents = listBlogShow.filter(
            (blog) => blog.type === filterValua
        );
        console.log(filterValua);

        setListBlogShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        console.log(values);

        if (isAddOrFix === true) {
            //  -----------------------????y l?? th??m m???i --------------------------------
            const { title, Image, desc, type, content } = values;
            const imageFile = Image[0].originFileObj;

            dispatch(
                createBlog({
                    title,
                    imageFile,
                    desc,
                    type,
                    content,
                })
            );
        } else {
            //  -----------------------????y l?? s???a --------------------------------
            const { title, Image, id, desc, type, content } = values;
            const imageFile = Image ? Image[0].originFileObj : null;
            dispatch(
                updateBlog({
                    id,
                    title,
                    imageFile,
                    desc,
                    type,
                    content,
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
            title: "Ti??u ?????",
            dataIndex: "title",
            key: "title",
            width: 500,
        },
        {
            title: "H??nh bi???u di???n",
            dataIndex: "thumb",
            width: 200,
            render: (thumb: string) => (
                <div className="">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={`${process.env.HOST_NAME_API}/${thumb}`}
                        alt="icon"
                    />
                </div>
            ),
        },
        {
            title: "M?? t???",
            dataIndex: "desc",
            key: "desc",
            width: 500,
        },
        {
            title: "Lo???i",
            dataIndex: "type",
            key: "type",
            render: (type: number) => (
                <span>{type === 1 ? "Khuy???n m??i" : "B??i vi???t Blog"}</span>
            ),
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Qu???n l?? danh s??ch Blog v?? Khuy???n m??i</h1>
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
                <OptionSearch
                    placeholder="Lo???i"
                    optionSearch={handleSearchOption}
                    listOption={listOption.map((op) => {
                        return {
                            value: op.value,
                            title: op.name,
                        };
                    })}
                />
                <TitleSearch
                    placeholder="Search Name"
                    userSearch={handleSearchTitle}
                />
            </div>

            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Modal
                title={`${
                    isAddOrFix
                        ? "Th??m m???i B??i vi???t ho???c Khuy???n m??i"
                        : "S???a  B??i vi???t ho???c Khuy???n m??i"
                }`}
                visible={isOpenModal}
                onCancel={handleCancelModal}
                footer={[
                    <Button key="back" onClick={handleCancelModal}>
                        Cancel
                    </Button>,
                ]}
                width={1000}
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
                        name="title"
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
                        name="desc"
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
                        name="type"
                        label="Th??? lo???i"
                        rules={[
                            { required: true, message: "Kh??ng b??? tr???ng!!!" },
                        ]}
                    >
                        <Select placeholder="Category" allowClear>
                            <Option value={0}>B??i vi???t blog</Option>
                            <Option value={1}>Khuy???n m??i</Option>
                        </Select>
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
                        label="N???i dung"
                        name="content"
                        rules={[
                            {
                                required: isAddOrFix,
                                message: "Kh??ng b??? tr???ng!!!",
                            },
                        ]}
                    >
                        <ReactQuill
                            placeholder="Nh???p n???i dung b??i vi???t"
                            modules={modules}
                            formats={formats}
                        />
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
                dataSource={listBlogShow}
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

export default Post;
