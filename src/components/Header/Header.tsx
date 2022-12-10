import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import classNames from "classnames/bind";
import { LogoutOutlined } from "@ant-design/icons";
import styles from "./Header.module.scss";
import { Button, Form, Input } from "antd";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { changePassword, logOut } from "../../store/slice/loginSlice";
const cx = classNames.bind(styles);

function Header(): JSX.Element {
    const { pathname, push } = useRouter();

    const { user, loadingApi } = useAppSelector((state) => state.login);
    const dispatch = useAppDispatch();

    const [checkPageLogin, setCheckPageLogin] = useState(false);
    const [changePass, setChangePass] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckChangePass = (option: string) => {
        if (option == "logout") {
            if (!changePass) return;
            setChangePass(false);
        }
        if (option == "changepass") {
            if (changePass) return;
            setChangePass(true);
        }
    };
    const onFinish = async (values: any) => {
        const { old_password, password } = values;
        dispatch(
            changePassword({
                old_password,
                password,
                password_confirmation: password,
            })
        );
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };
    useEffect(() => {
        if (pathname != "/login") {
            setCheckPageLogin(true);
        } else {
            setCheckPageLogin(false);
        }
    }, [pathname]);
    return (
        <>
            {checkPageLogin && (
                <>
                    <header className={cx("header")}>
                        <div className={cx("header-profile")}>
                            <div className={cx("header-profile_show")}>
                                <h2>{user?.name}</h2>
                                <LogoutOutlined
                                    className={cx("header-profile_icon")}
                                />
                            </div>
                            <div
                                className={cx(
                                    "header-profile_hover",
                                    `${changePass ? "is-change-pass" : ""}`
                                )}
                            >
                                <div className={cx("header-profile_control")}>
                                    <span
                                        className={cx(
                                            `${!changePass ? "active" : ""}`
                                        )}
                                        onClick={() =>
                                            handleCheckChangePass("logout")
                                        }
                                    >
                                        Đăng xuất
                                    </span>
                                    <span
                                        className={cx(
                                            `${changePass ? "active" : ""}`
                                        )}
                                        onClick={() =>
                                            handleCheckChangePass("changepass")
                                        }
                                    >
                                        Đổi mật khẩu
                                    </span>
                                </div>
                                <div className={cx("header-profile_main")}>
                                    {!changePass ? (
                                        <div
                                            className={cx(
                                                "header-profile_logout"
                                            )}
                                        >
                                            <Button
                                                type="primary"
                                                htmlType="submit"
                                                onClick={() => {
                                                    dispatch(logOut());
                                                    push("/login");
                                                }}
                                            >
                                                Đăng xuất
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className={cx(
                                                "header-profile_changepass"
                                            )}
                                        >
                                            <Form
                                                name="basic"
                                                labelCol={{ span: 10 }}
                                                wrapperCol={{ span: 14 }}
                                                initialValues={{
                                                    remember: true,
                                                }}
                                                onFinish={onFinish}
                                                onFinishFailed={onFinishFailed}
                                                autoComplete="off"
                                            >
                                                <Form.Item
                                                    label="Mật khẩu hiện tại"
                                                    name="old_password"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống!",
                                                        },
                                                    ]}
                                                >
                                                    <Input.Password />
                                                </Form.Item>

                                                <Form.Item
                                                    label="Mật khẩu mới"
                                                    name="password"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message:
                                                                "Vui lòng không bỏ trống!",
                                                        },
                                                    ]}
                                                >
                                                    <Input.Password />
                                                </Form.Item>

                                                <Form.Item
                                                    wrapperCol={{
                                                        offset: 8,
                                                        span: 16,
                                                    }}
                                                >
                                                    <Button
                                                        type="primary"
                                                        htmlType="submit"
                                                        loading={loadingApi}
                                                    >
                                                        Đổi mật khẩu
                                                    </Button>
                                                </Form.Item>
                                            </Form>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </header>
                </>
            )}
        </>
    );
}

export default Header;
