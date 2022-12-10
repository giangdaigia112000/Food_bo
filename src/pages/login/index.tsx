import { useEffect, useState } from "react";
import { NextPage } from "next";
import classNames from "classnames/bind";
import { Button, Form, Input } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import styles from "./Login.module.scss";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/slice/loginSlice";
const cx = classNames.bind(styles);

const Login: NextPage = () => {
    const { user, loadingApi } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();
    const { push } = useRouter();
    const onFinish = async (values: any) => {
        dispatch(login(values));
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };
    useEffect(() => {
        if (user) {
            push("/");
        }
    }, [user]);
    return (
        <main className={cx("login")}>
            <div className={cx("container")}>
                <div className={cx("logo")}>
                    <img src="/juwanfood-logo-short.png" alt="Logo vFast" />
                </div>
                <div className={cx("login-form")}>
                    <h1>JuwanFood</h1>
                    <div className={cx("form-main")}>
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="Tên đăng nhập"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập vào tài khoản!",
                                    },
                                ]}
                            >
                                <Input
                                    size="large"
                                    prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                    }
                                />
                            </Form.Item>

                            <Form.Item
                                label="Mật khẩu"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: "Nhập vào mật khẩu!",
                                    },
                                ]}
                            >
                                <Input.Password
                                    size="large"
                                    prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                    }
                                />
                            </Form.Item>

                            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loadingApi}
                                    danger
                                >
                                    Đăng nhập
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    );
};
export default Login;
