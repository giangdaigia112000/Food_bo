import { useEffect, useState } from "react";
import Link from "next/link";
import classNames from "classnames/bind";
import { useRouter } from "next/router";
import {
    HomeFilled,
    CustomerServiceFilled,
    GoldFilled,
    ContactsFilled,
    ReadFilled,
    AlertFilled,
    DoubleRightOutlined,
    DoubleLeftOutlined,
} from "@ant-design/icons";
import {
    FcConferenceCall,
    FcDam,
    FcDocument,
    FcKindle,
    FcOrgUnit,
    FcPanorama,
    FcPositiveDynamic,
    FcSalesPerformance,
    FcStackOfPhotos,
} from "react-icons/fc";
import styles from "./Navbar.module.scss";
import { useAppSelector } from "../../store/hooks";
const cx = classNames.bind(styles);
function Navbar() {
    const navList = [
        {
            id: 1,
            role: 3,
            title: "Slider",
            url: "/home",
            icon: <FcPanorama />,
            color: "#ee2b2b",
        },
        {
            id: 2,
            role: 3,
            title: "Category",
            url: "/category",
            icon: <FcOrgUnit />,
            color: "#8f11d3",
        },
        {
            id: 3,
            role: 3,
            title: "Danh sách Sản phẩm",
            url: "/product",
            icon: <FcStackOfPhotos />,
            color: "#11d37b",
        },
        {
            id: 4,
            role: 3,
            title: "Bài viết và Khuyễn mãi",
            url: "/post",
            icon: <FcDocument />,
            color: "#e0880a",
        },
        {
            id: 5,
            role: 3,
            title: "Shop",
            url: "/shop",
            icon: <FcDam />,
            color: "#e0880a",
        },
        {
            id: 6,
            role: 4,
            title: "User",
            url: "/user",
            icon: <FcConferenceCall />,
            color: "#e0880a",
        },
        {
            id: 7,
            role: 3,
            title: "Voucher",
            url: "/voucher",
            icon: <FcSalesPerformance />,
            color: "#e0880a",
        },
        {
            id: 7,
            role: 2,
            title: "Danh sách đơn hàng",
            url: "/order",
            icon: <FcKindle />,
            color: "#e0880a",
        },
        {
            id: 8,
            role: 4,
            title: "Biểu đồ",
            url: "/chart",
            icon: <FcPositiveDynamic />,
            color: "#e0880a",
        },
    ];
    const { user } = useAppSelector((state) => state.login);
    const [checkPageLogin, setCheckPageLogin] = useState(false);
    const { pathname } = useRouter();

    useEffect(() => {
        if (!user) return;
    }, [user]);

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
                <div className={cx("nav")}>
                    <div className={cx("nav-container")}>
                        <div className={cx("nav-active")}>
                            <DoubleRightOutlined
                                className={cx("nav-active_right")}
                            />
                            <DoubleLeftOutlined
                                className={cx("nav-active_left")}
                            />
                        </div>
                        <div className={cx("nav-logo")}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={cx("nav-logo_small")}
                                src="/juwanfood-logo-short.png"
                                alt="logo vfast"
                            />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                className={cx("nav-logo_full")}
                                src="/juwanfood-logo.png"
                                alt="logo vfast"
                            />
                        </div>
                        <nav>
                            <ul>
                                {user &&
                                    navList.map((item) => {
                                        return (
                                            <>
                                                {user.role >= item.role && (
                                                    <Link
                                                        key={item.id}
                                                        href={item.url}
                                                    >
                                                        <li
                                                            className={cx(
                                                                `${
                                                                    pathname ==
                                                                    item.url
                                                                        ? "active"
                                                                        : ""
                                                                }`
                                                            )}
                                                        >
                                                            <div
                                                                className={cx(
                                                                    "nav-icon"
                                                                )}
                                                            >
                                                                {item.icon}
                                                            </div>
                                                            <span>
                                                                {item.title}
                                                            </span>
                                                        </li>
                                                    </Link>
                                                )}
                                            </>
                                        );
                                    })}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}

export default Navbar;
