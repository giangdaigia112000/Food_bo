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
import { EditFilled, DeleteFilled, PlusCircleFilled } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    createUser,
    deleteUser,
    getAllUser,
} from "../../store/slice/userSlice";
import OptionSearch from "../../components/OptionSearch";
import TitleSearch from "../../components/TitleSearch";
import { User as UserInterface } from "../../interface";
const { Option } = Select;
interface DataType {
    id: number;
    name: string;
    email: string;
}

const listRole = [
    {
        value: 1,
        name: "Khách",
    },
    {
        value: 2,
        name: "Nhân viên",
    },
    {
        value: 3,
        name: "Quản trị viên",
    },
    {
        value: 4,
        name: "Super Admin",
    },
];
const User = () => {
    const { listUser, loading, loadingApi } = useAppSelector(
        (state) => state.user
    );
    const dispatch = useAppDispatch();

    const [listUserShow, setListUserShow] = useState<UserInterface[]>([]);
    const [reLoad, setReLoad] = useState<boolean>(false);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [isAddOrFix, setIsAddOrFix] = useState<boolean>(true);
    const [form] = Form.useForm();

    useEffect(() => {
        dispatch(getAllUser());
    }, [reLoad]);

    useEffect(() => {
        setListUserShow(listUser);
    }, [listUser]);

    const handleCancelModal = () => {
        setIsOpenModal(false);
    };
    const handleRepair = (id: number) => {
        form.resetFields();
        setIsAddOrFix(false);
        setIsOpenModal(true);
        const user = listUser.filter((user) => user.id === id)[0];
        form.setFieldsValue({
            name: user.name,
            email: user.email,
            role: user.role,
            id: id,
        });
    };
    const handleDelete = async (id: number) => {
        dispatch(deleteUser(id));
    };

    const handleSearchTitle = (searchText: string) => {
        if (!searchText) {
            setListUserShow(listUser);
            return;
        }
        const filteredEvents = listUserShow.filter(({ email }) => {
            email = email.toLowerCase();
            return email.includes(searchText);
        });
        setListUserShow(filteredEvents);
    };

    const handleSearchOption = (value: any) => {
        if (!value) {
            setListUserShow(listUser);
            return;
        }
        const filterValua = value ? value : "";
        const filteredEvents = listUserShow.filter(
            (user) => user.role === filterValua
        );
        setListUserShow(filteredEvents);
    };

    const onSubmitForm = async (values: any) => {
        if (isAddOrFix === true) {
            //  -----------------------Đây là thêm mới --------------------------------
            const { name, email, role } = values;
            dispatch(createUser({ name, email, role }));
        } else {
            //  -----------------------Đây là sửa --------------------------------
            const { name, email, role, id } = values;
            // dispatch(updateShop({ id, address }));
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
            title: "Tên",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Chức vụ",
            dataIndex: "role",
            key: "role",
            render: (role: number) => (
                <span>
                    {listRole.filter((rol) => rol.value === role)[0].name}
                </span>
            ),
        },
    ];
    return (
        <div className="w-full">
            <div className="py-[10px]">
                <h1>Quản lý danh sách User</h1>
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
                            Thêm bản ghi
                        </div>
                    </Button>
                </div>
            </div>
            {/* --------------------------------------------Filter--------------------------------------------------- */}
            <div className="w-full flex justify-end py-[10px]">
                <OptionSearch
                    placeholder="Chức vụ"
                    optionSearch={handleSearchOption}
                    listOption={listRole.map((role) => {
                        return {
                            value: role.value,
                            title: role.name,
                        };
                    })}
                />
                <TitleSearch
                    placeholder="Search Email"
                    userSearch={handleSearchTitle}
                />
            </div>
            {/* --------------------------------------------Modal--------------------------------------------------- */}

            <Modal
                title={`${isAddOrFix ? "Thêm mới Shop" : "Sửa Shop"}`}
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
                        label="Họ tên"
                        name="name"
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
                        label="Email"
                        name="email"
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
                        name="role"
                        label="Chức vụ"
                        rules={[
                            { required: true, message: "Không bỏ trống!!!" },
                        ]}
                    >
                        <Select allowClear>
                            {listRole.map((role) => (
                                <Option key={role.value} value={role.value}>
                                    {role.name}
                                </Option>
                            ))}
                        </Select>
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
                dataSource={listUserShow}
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

export default User;
